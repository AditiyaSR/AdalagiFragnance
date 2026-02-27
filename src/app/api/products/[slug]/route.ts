import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/products/[slug] - Get single product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await db.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        scentProfile: true,
        variants: {
          where: { isActive: true },
          orderBy: { size: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform for frontend
    const transformedProduct = {
      ...product,
      topNotes: product.topNotes.split(',').map((n: string) => n.trim()),
      heartNotes: product.heartNotes.split(',').map((n: string) => n.trim()),
      baseNotes: product.baseNotes.split(',').map((n: string) => n.trim()),
      images: JSON.parse(product.images),
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
