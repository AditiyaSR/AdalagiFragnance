import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/banners/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const banner = await db.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/banners/[id] - Update banner
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, image, link, position, isActive, order } = body;

    const banner = await db.banner.update({
      where: { id },
      data: {
        title,
        subtitle,
        image,
        link,
        position,
        isActive,
        order,
      },
    });

    return NextResponse.json({
      success: true,
      data: banner,
      message: 'Banner updated successfully',
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/banners/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.banner.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
