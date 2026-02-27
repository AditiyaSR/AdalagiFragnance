import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/content - Get content blocks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    const where: Record<string, unknown> = {};
    if (page) where.page = page;
    if (section) where.section = section;

    const contentBlocks = await db.contentBlock.findMany({
      where,
      orderBy: [{ page: 'asc' }, { order: 'asc' }],
    });

    return NextResponse.json({
      success: true,
      data: contentBlocks,
    });
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content blocks' },
      { status: 500 }
    );
  }
}

// POST /api/admin/content - Create content block
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, content, page, section, order, isActive, image } = body;

    const contentBlock = await db.contentBlock.create({
      data: {
        type: type || 'text',
        title,
        content,
        page: page || 'home',
        section: section || 'default',
        order: order || 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: contentBlock,
      message: 'Content block created successfully',
    });
  } catch (error) {
    console.error('Error creating content block:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create content block' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/content - Update content block
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, title, content, page, section, order, isActive } = body;

    const contentBlock = await db.contentBlock.update({
      where: { id },
      data: {
        type,
        title,
        content,
        page,
        section,
        order,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: contentBlock,
      message: 'Content block updated successfully',
    });
  } catch (error) {
    console.error('Error updating content block:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content block' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/content - Delete content block
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    await db.contentBlock.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Content block deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting content block:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete content block' },
      { status: 500 }
    );
  }
}
