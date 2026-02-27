import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/products - Get all products for admin
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          scentProfile: true,
          variants: {
            orderBy: { size: 'asc' },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.product.count({ where }),
    ]);

    const transformedProducts = products.map((product) => ({
      ...product,
      topNotes: product.topNotes.split(',').map((n: string) => n.trim()),
      heartNotes: product.heartNotes.split(',').map((n: string) => n.trim()),
      baseNotes: product.baseNotes.split(',').map((n: string) => n.trim()),
      images: JSON.parse(product.images),
    }));

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      longDescription,
      categoryId,
      scentProfileId,
      topNotes,
      heartNotes,
      baseNotes,
      basePrice,
      comparePrice,
      concentration,
      gender,
      launchYear,
      images,
      mainImage,
      isActive,
      isFeatured,
      isNewArrival,
      isBestSeller,
      sku,
      variants,
    } = body;

    const product = await db.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        longDescription,
        categoryId,
        scentProfileId,
        topNotes: Array.isArray(topNotes) ? topNotes.join(', ') : topNotes,
        heartNotes: Array.isArray(heartNotes) ? heartNotes.join(', ') : heartNotes,
        baseNotes: Array.isArray(baseNotes) ? baseNotes.join(', ') : baseNotes,
        basePrice: parseFloat(basePrice),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        concentration,
        gender,
        launchYear: launchYear ? parseInt(launchYear) : null,
        images: JSON.stringify(images || []),
        mainImage: mainImage || '',
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        isNewArrival: isNewArrival ?? false,
        isBestSeller: isBestSeller ?? false,
        sku,
        variants: {
          create: variants?.map((v: { name: string; size: number; sku: string; price: number; comparePrice?: number; stock: number }) => ({
            name: v.name,
            size: v.size,
            sku: v.sku,
            price: parseFloat(v.price),
            comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : null,
            stock: v.stock || 0,
          })) || [],
        },
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
