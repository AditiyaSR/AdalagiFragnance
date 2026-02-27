import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/settings - Get all settings
export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();
    
    const settingsMap: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json({
      success: true,
      data: {
        siteName: settingsMap.siteName || 'Adalagi',
        siteDescription: settingsMap.siteDescription || '',
        siteEmail: settingsMap.siteEmail || 'hello@adalagi.com',
        sitePhone: settingsMap.sitePhone || '+62 21 1234 567',
        siteAddress: settingsMap.siteAddress || 'Jl. Senopati No. 45, Jakarta Selatan',
        socialInstagram: settingsMap.socialInstagram || 'https://instagram.com/adalagi',
        socialFacebook: settingsMap.socialFacebook || 'https://facebook.com/adalagi',
        socialTwitter: settingsMap.socialTwitter || 'https://twitter.com/adalagi',
        heroTitle: settingsMap.heroTitle || 'The Art of Timeless Elegance',
        heroSubtitle: settingsMap.heroSubtitle || 'Discover our collection of rare and exquisite fragrances',
        freeShippingMin: settingsMap.freeShippingMin || '500000',
        currency: settingsMap.currency || 'IDR',
        taxRate: settingsMap.taxRate || '0',
        heroBanner1Title: settingsMap.heroBanner1Title || 'Discover the Art of Perfumery',
        heroBanner1Subtitle: settingsMap.heroBanner1Subtitle || 'Each fragrance tells a unique story',
        heroBanner2Title: settingsMap.heroBanner2Title || 'New Collection 2024',
        heroBanner2Subtitle: settingsMap.heroBanner2Subtitle || 'Explore our latest creations',
        brandStoryTitle: settingsMap.brandStoryTitle || 'Crafting Emotions, One Drop at a Time',
        brandStoryContent: settingsMap.brandStoryContent || 'At Adalagi, we believe that a fragrance is more than a scent...',
        brandStat1Value: settingsMap.brandStat1Value || '50+',
        brandStat1Label: settingsMap.brandStat1Label || 'Unique Fragrances',
        brandStat2Value: settingsMap.brandStat2Value || '12',
        brandStat2Label: settingsMap.brandStat2Label || 'Countries Sourced',
        brandStat3Value: settingsMap.brandStat3Value || '4',
        brandStat3Label: settingsMap.brandStat3Label || 'Years of Excellence',
        newsletterTitle: settingsMap.newsletterTitle || 'Join the VIP Club',
        newsletterSubtitle: settingsMap.newsletterSubtitle || 'Subscribe to receive exclusive offers',
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const settingKeys = [
      'siteName', 'siteDescription', 'siteEmail', 'sitePhone', 'siteAddress',
      'socialInstagram', 'socialFacebook', 'socialTwitter',
      'heroTitle', 'heroSubtitle',
      'freeShippingMin', 'currency', 'taxRate',
      'heroBanner1Title', 'heroBanner1Subtitle',
      'heroBanner2Title', 'heroBanner2Subtitle',
      'brandStoryTitle', 'brandStoryContent',
      'brandStat1Value', 'brandStat1Label',
      'brandStat2Value', 'brandStat2Label',
      'brandStat3Value', 'brandStat3Label',
      'newsletterTitle', 'newsletterSubtitle',
    ];

    for (const key of settingKeys) {
      if (body[key] !== undefined) {
        await db.siteSetting.upsert({
          where: { key },
          update: { value: String(body[key]) },
          create: { key, value: String(body[key]), type: 'string' },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
