import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Generate order number
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `ADL-${year}-${random}`;
}

// GET /api/orders - Get orders (for user or admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');

    if (orderId) {
      // Get single order
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          payments: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: order });
    }

    // Build where clause
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: { select: { name: true, mainImage: true } },
            variant: { select: { name: true, size: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      shippingAddress,
      courier,
      courierService,
      shippingCost,
      subtotal,
      discountAmount = 0,
      notes,
    } = body;

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in order' },
        { status: 400 }
      );
    }

    // Calculate total
    const totalAmount = subtotal + shippingCost - discountAmount;

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: userId || null,
        recipientName: shippingAddress.recipientName,
        phone: shippingAddress.phone,
        province: shippingAddress.province,
        city: shippingAddress.city,
        district: shippingAddress.district,
        postalCode: shippingAddress.postalCode,
        fullAddress: shippingAddress.fullAddress,
        subtotal,
        shippingCost,
        discountAmount,
        totalAmount,
        courier,
        courierService,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        notes,
        items: {
          create: items.map((item: { productId: string; variantId: string; productName: string; variantName: string; quantity: number; unitPrice: number }) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            notes: 'Order created, awaiting payment',
          },
        },
      },
      include: {
        items: true,
      },
    });

    // Update stock (reserve)
    for (const item of items) {
      await db.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
