import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/banners - Get all banners
export async function GET() {
  try {
    const banners = await db.banner.findMany({
      orderBy: [
        { position: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST /api/admin/banners - Create banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, image, link, position, isActive, order } = body;

    const banner = await db.banner.create({
      data: {
        title,
        subtitle,
        image,
        link,
        position: position || 'hero',
        isActive: isActive ?? true,
        order: order || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: banner,
      message: 'Banner created successfully',
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/banners - Update multiple banners order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { banners } = body;

    for (const banner of banners) {
      await db.banner.update({
        where: { id: banner.id },
        data: {
          order: banner.order,
          isActive: banner.isActive,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Banners order updated',
    });
  } catch (error) {
    console.error('Error updating banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update banners' },
      { status: 500 }
    );
  }
}
