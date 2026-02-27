import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        scentProfile: true,
        variants: true,
        reviews: {
          include: { user: { select: { name: true } } },
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

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    } = body;

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        slug,
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
        isActive,
        isFeatured,
        isNewArrival,
        isBestSeller,
        sku,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First delete variants
    await db.productVariant.deleteMany({
      where: { productId: id },
    });

    // Then delete the product
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
