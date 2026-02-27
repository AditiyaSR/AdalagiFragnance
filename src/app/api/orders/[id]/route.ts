import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/orders/[id] - Get order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
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
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, trackingNumber, notes, internalNotes } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;
    if (internalNotes) updateData.internalNotes = internalNotes;

    const order = await db.order.update({
      where: { id },
      data: updateData,
    });

    // Add status history if status changed
    if (status) {
      await db.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
          notes: notes || `Status updated to ${status}`,
        },
      });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
