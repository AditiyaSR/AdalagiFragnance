import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/products - Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const scentProfile = searchParams.get('scentProfile');
    const gender = searchParams.get('gender');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const newArrival = searchParams.get('newArrival');
    const bestSeller = searchParams.get('bestSeller');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (scentProfile) {
      where.scentProfile = { slug: scentProfile };
    }

    if (gender) {
      where.gender = gender;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (newArrival === 'true') {
      where.isNewArrival = true;
    }

    if (bestSeller === 'true') {
      where.isBestSeller = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          scentProfile: true,
          variants: {
            where: { isActive: true },
            orderBy: { size: 'asc' },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.product.count({ where }),
    ]);

    // Transform products for frontend
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
