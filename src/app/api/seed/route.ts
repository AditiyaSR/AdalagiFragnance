import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Seed database with initial data for Adalagi Luxury Perfume
export async function GET() {
  try {
    // Create Categories
    const categories = await Promise.all([
      db.category.upsert({
        where: { slug: 'signature' },
        update: {},
        create: {
          name: 'Signature Collection',
          slug: 'signature',
          description: 'Our most iconic and timeless fragrances',
        },
      }),
      db.category.upsert({
        where: { slug: 'limited-edition' },
        update: {},
        create: {
          name: 'Limited Edition',
          slug: 'limited-edition',
          description: 'Exclusive releases in limited quantities',
        },
      }),
      db.category.upsert({
        where: { slug: 'discovery' },
        update: {},
        create: {
          name: 'Discovery Set',
          slug: 'discovery',
          description: 'Curated sets to explore our collection',
        },
      }),
    ]);

    // Create Scent Profiles
    const scentProfiles = await Promise.all([
      db.scentProfile.upsert({
        where: { slug: 'woody' },
        update: {},
        create: {
          name: 'Woody',
          slug: 'woody',
          description: 'Warm, earthy notes of sandalwood, cedar, and oud',
        },
      }),
      db.scentProfile.upsert({
        where: { slug: 'floral' },
        update: {},
        create: {
          name: 'Floral',
          slug: 'floral',
          description: 'Romantic bouquets of rose, jasmine, and peony',
        },
      }),
      db.scentProfile.upsert({
        where: { slug: 'oriental' },
        update: {},
        create: {
          name: 'Oriental',
          slug: 'oriental',
          description: 'Rich, sensual notes of amber, vanilla, and spices',
        },
      }),
      db.scentProfile.upsert({
        where: { slug: 'fresh' },
        update: {},
        create: {
          name: 'Fresh',
          slug: 'fresh',
          description: 'Clean, invigorating notes of citrus and aquatic elements',
        },
      }),
      db.scentProfile.upsert({
        where: { slug: 'leather' },
        update: {},
        create: {
          name: 'Leather',
          slug: 'leather',
          description: 'Sophisticated, smoky notes of leather and tobacco',
        },
      }),
    ]);

    // Create Products with affordable prices (100k-300k IDR range)
    const products = [
      {
        name: 'Noir Absolu',
        slug: 'noir-absolu',
        description: 'An intoxicating journey into the depths of night. Black pepper and bergamot reveal a heart of Bulgarian rose and smoky incense.',
        longDescription: 'Noir Absolu is the epitome of masculine elegance and feminine power. This unisex masterpiece captures the essence of midnight encounters and secret desires.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[4].id, // Leather
        topNotes: 'Black Pepper, Bergamot, Cardamom',
        heartNotes: 'Bulgarian Rose, Incense, Geranium',
        baseNotes: 'Oud, Amber, Velvet Musk, Leather',
        basePrice: 285000,
        comparePrice: 350000,
        concentration: 'Eau de Parfum',
        gender: 'Unisex',
        launchYear: 2024,
        images: JSON.stringify(['/images/noir-absolu-1.jpg', '/images/noir-absolu-2.jpg']),
        mainImage: '/images/noir-absolu-main.jpg',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        sku: 'ADL-NA-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-NA-030', price: 185000, stock: 50 },
          { name: '50ml', size: 50, sku: 'ADL-NA-050', price: 285000, stock: 35 },
        ],
      },
      {
        name: 'Velvet Oud',
        slug: 'velvet-oud',
        description: 'A symphony of rare oud blended with precious rose absolute and warm sandalwood. Pure opulence in a bottle.',
        longDescription: 'Crafted for the true connoisseur, Velvet Oud showcases precious ingredients artfully blended in our atelier.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[0].id, // Woody
        topNotes: 'Saffron, Cinnamon, Pink Pepper',
        heartNotes: 'Oud, Rose Absolute, Jasmine',
        baseNotes: 'Sandalwood, Amber, Musk',
        basePrice: 299000,
        concentration: 'Extrait de Parfum',
        gender: 'Unisex',
        launchYear: 2023,
        images: JSON.stringify(['/images/velvet-oud-1.jpg', '/images/velvet-oud-2.jpg']),
        mainImage: '/images/velvet-oud-main.jpg',
        isFeatured: true,
        isBestSeller: true,
        sku: 'ADL-VO-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-VO-030', price: 199000, stock: 25 },
          { name: '50ml', size: 50, sku: 'ADL-VO-050', price: 299000, stock: 20 },
        ],
      },
      {
        name: 'Jardin Nocturne',
        slug: 'jardin-nocturne',
        description: 'A midnight stroll through a blooming garden. Jasmine sambac and tuberose dance under the moonlight.',
        longDescription: 'Jardin Nocturne captures the magic of an Indonesian night garden with flowers hand-picked at midnight.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[1].id, // Floral
        topNotes: 'Bergamot, Mandarin, Green Leaves',
        heartNotes: 'Jasmine Sambac, Tuberose, Ylang-Ylang',
        baseNotes: 'Vanilla, Tonka Bean, White Musk',
        basePrice: 225000,
        concentration: 'Eau de Parfum',
        gender: 'Women',
        launchYear: 2024,
        images: JSON.stringify(['/images/jardin-nocturne-1.jpg', '/images/jardin-nocturne-2.jpg']),
        mainImage: '/images/jardin-nocturne-main.jpg',
        isFeatured: true,
        isNewArrival: true,
        sku: 'ADL-JN-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-JN-030', price: 165000, stock: 40 },
          { name: '50ml', size: 50, sku: 'ADL-JN-050', price: 225000, stock: 30 },
        ],
      },
      {
        name: 'Citrus Imperiale',
        slug: 'citrus-imperiale',
        description: 'A sparkling tribute to the Mediterranean. Sicilian lemon and Calabrian bergamot elevated by rare iris.',
        longDescription: 'Citrus Imperiale proves that fresh fragrances can be complex and luxurious.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[3].id, // Fresh
        topNotes: 'Sicilian Lemon, Calabrian Bergamot, Neroli',
        heartNotes: 'Iris, Jasmine, Violet Leaf',
        baseNotes: 'Cedar, Vetiver, White Musk',
        basePrice: 195000,
        concentration: 'Eau de Parfum',
        gender: 'Unisex',
        launchYear: 2024,
        images: JSON.stringify(['/images/citrus-imperiale-1.jpg', '/images/citrus-imperiale-2.jpg']),
        mainImage: '/images/citrus-imperiale-main.jpg',
        isNewArrival: true,
        sku: 'ADL-CI-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-CI-030', price: 145000, stock: 45 },
          { name: '50ml', size: 50, sku: 'ADL-CI-050', price: 195000, stock: 35 },
        ],
      },
      {
        name: 'Amber Sultan',
        slug: 'amber-sultan',
        description: 'A journey through ancient spice markets. Rich amber, precious saffron, and exotic spices.',
        longDescription: 'Amber Sultan is inspired by the ancient spice routes connecting East and West.',
        categoryId: categories[1].id, // Limited Edition
        scentProfileId: scentProfiles[2].id, // Oriental
        topNotes: 'Saffron, Cinnamon, Clove',
        heartNotes: 'Rose, Jasmine, Orris',
        baseNotes: 'Amber, Vanilla, Benzoin, Labdanum',
        basePrice: 275000,
        comparePrice: 320000,
        concentration: 'Extrait de Parfum',
        gender: 'Unisex',
        launchYear: 2024,
        images: JSON.stringify(['/images/amber-sultan-1.jpg', '/images/amber-sultan-2.jpg']),
        mainImage: '/images/amber-sultan-main.jpg',
        isFeatured: true,
        isNewArrival: true,
        sku: 'ADL-AS-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-AS-030', price: 185000, stock: 20 },
          { name: '50ml', size: 50, sku: 'ADL-AS-050', price: 275000, stock: 15 },
        ],
      },
      {
        name: 'Bois Précieux',
        slug: 'bois-precieux',
        description: 'A celebration of precious woods. Rare sandalwood, creamy cedar, and smoldering vetiver.',
        longDescription: 'Bois Précieux is a meditation on the beauty of wood.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[0].id, // Woody
        topNotes: 'Bergamot, Pink Pepper, Elemi',
        heartNotes: 'Sandalwood, Cedar, Guaiac',
        baseNotes: 'Vetiver, Patchouli, Musk',
        basePrice: 245000,
        concentration: 'Eau de Parfum',
        gender: 'Men',
        launchYear: 2023,
        images: JSON.stringify(['/images/bois-precieux-1.jpg', '/images/bois-precieux-2.jpg']),
        mainImage: '/images/bois-precieux-main.jpg',
        isBestSeller: true,
        sku: 'ADL-BP-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-BP-030', price: 175000, stock: 30 },
          { name: '50ml', size: 50, sku: 'ADL-BP-050', price: 245000, stock: 25 },
        ],
      },
      {
        name: 'Rose Éternelle',
        slug: 'rose-eternelle',
        description: 'The queen of flowers in her most divine form. Centifolia rose enhanced by precious oud.',
        longDescription: 'Rose Éternelle contains the finest rose absolute, creating a rose experience like no other.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[1].id, // Floral
        topNotes: 'Bergamot, Pink Pepper, Raspberry',
        heartNotes: 'Centifolia Rose, Turkish Rose, Geranium',
        baseNotes: 'Oud, Patchouli, White Musk, Honey',
        basePrice: 265000,
        concentration: 'Extrait de Parfum',
        gender: 'Women',
        launchYear: 2023,
        images: JSON.stringify(['/images/rose-eternelle-1.jpg', '/images/rose-eternelle-2.jpg']),
        mainImage: '/images/rose-eternelle-main.jpg',
        isFeatured: true,
        isBestSeller: true,
        sku: 'ADL-RE-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-RE-030', price: 185000, stock: 25 },
          { name: '50ml', size: 50, sku: 'ADL-RE-050', price: 265000, stock: 20 },
        ],
      },
      {
        name: 'Fleur de Nuit',
        slug: 'fleur-de-nuit',
        description: 'The seductive power of night-blooming flowers. Tuberose, jasmine, and ylang-ylang.',
        longDescription: 'Fleur de Nuit is an ode to the mysterious flowers that reveal their beauty after dark.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[1].id, // Floral
        topNotes: 'Green Leaves, Bergamot, Pink Pepper',
        heartNotes: 'Tuberose, Jasmine Sambac, Ylang-Ylang',
        baseNotes: 'Sandalwood, Vanilla, Musk',
        basePrice: 215000,
        concentration: 'Eau de Parfum',
        gender: 'Women',
        launchYear: 2024,
        images: JSON.stringify(['/images/fleur-de-nuit-1.jpg', '/images/fleur-de-nuit-2.jpg']),
        mainImage: '/images/fleur-de-nuit-main.jpg',
        isNewArrival: true,
        sku: 'ADL-FN-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-FN-030', price: 155000, stock: 35 },
          { name: '50ml', size: 50, sku: 'ADL-FN-050', price: 215000, stock: 28 },
        ],
      },
      {
        name: 'Ocean Breeze',
        slug: 'ocean-breeze',
        description: 'A refreshing escape to the seaside. Sea salt, aquatic notes, and driftwood capture the essence of the ocean.',
        longDescription: 'Ocean Breeze brings the invigorating freshness of the coast to your daily ritual.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[3].id, // Fresh
        topNotes: 'Sea Salt, Bergamot, Aquatic Notes',
        heartNotes: 'Water Lily, Jasmine, Cyclamen',
        baseNotes: 'Driftwood, Ambergris, Musk',
        basePrice: 185000,
        concentration: 'Eau de Toilette',
        gender: 'Unisex',
        launchYear: 2024,
        images: JSON.stringify(['/images/ocean-breeze-1.jpg']),
        mainImage: '/images/ocean-breeze-main.jpg',
        isNewArrival: true,
        sku: 'ADL-OB-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-OB-030', price: 135000, stock: 50 },
          { name: '50ml', size: 50, sku: 'ADL-OB-050', price: 185000, stock: 40 },
        ],
      },
      {
        name: 'Spice Route',
        slug: 'spice-route',
        description: 'An aromatic journey through exotic lands. Cardamom, cinnamon, and precious woods create an unforgettable experience.',
        longDescription: 'Spice Route celebrates the ancient trade routes with a modern, sophisticated interpretation.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[2].id, // Oriental
        topNotes: 'Cardamom, Black Pepper, Nutmeg',
        heartNotes: 'Cinnamon, Clove, Geranium',
        baseNotes: 'Sandalwood, Patchouli, Vanilla',
        basePrice: 235000,
        concentration: 'Eau de Parfum',
        gender: 'Men',
        launchYear: 2024,
        images: JSON.stringify(['/images/spice-route-1.jpg']),
        mainImage: '/images/spice-route-main.jpg',
        isBestSeller: true,
        sku: 'ADL-SR-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-SR-030', price: 165000, stock: 35 },
          { name: '50ml', size: 50, sku: 'ADL-SR-050', price: 235000, stock: 25 },
        ],
      },
      {
        name: 'White Tea Serenity',
        slug: 'white-tea-serenity',
        description: 'A calming embrace of white tea leaves, delicate flowers, and soft musk. Perfect for everyday elegance.',
        longDescription: 'White Tea Serenity captures the peaceful moment of a quiet afternoon tea ritual.',
        categoryId: categories[0].id,
        scentProfileId: scentProfiles[3].id, // Fresh
        topNotes: 'White Tea, Bergamot, Mandarin',
        heartNotes: 'Jasmine, Freesia, Rose',
        baseNotes: 'White Musk, Cedar, Amber',
        basePrice: 175000,
        concentration: 'Eau de Toilette',
        gender: 'Unisex',
        launchYear: 2024,
        images: JSON.stringify(['/images/white-tea-1.jpg']),
        mainImage: '/images/white-tea-main.jpg',
        isNewArrival: true,
        sku: 'ADL-WT-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-WT-030', price: 125000, stock: 55 },
          { name: '50ml', size: 50, sku: 'ADL-WT-050', price: 175000, stock: 45 },
        ],
      },
      {
        name: 'Midnight Leather',
        slug: 'midnight-leather',
        description: 'Bold and sophisticated. Smoky leather, dark rum, and warm amber create an irresistible allure.',
        longDescription: 'Midnight Leather is for those who dare to stand out with confidence and style.',
        categoryId: categories[1].id, // Limited Edition
        scentProfileId: scentProfiles[4].id, // Leather
        topNotes: 'Black Pepper, Dark Rum, Saffron',
        heartNotes: 'Leather, Tobacco, Iris',
        baseNotes: 'Amber, Vanilla, Oud',
        basePrice: 295000,
        comparePrice: 350000,
        concentration: 'Extrait de Parfum',
        gender: 'Unisex',
        launchYear: 2024,
        images: JSON.stringify(['/images/midnight-leather-1.jpg']),
        mainImage: '/images/midnight-leather-main.jpg',
        isFeatured: true,
        isNewArrival: true,
        sku: 'ADL-ML-001',
        variants: [
          { name: '30ml', size: 30, sku: 'ADL-ML-030', price: 195000, stock: 18 },
          { name: '50ml', size: 50, sku: 'ADL-ML-050', price: 295000, stock: 12 },
        ],
      },
    ];

    for (const productData of products) {
      const { variants, ...productInfo } = productData;
      
      const existingProduct = await db.product.findUnique({
        where: { slug: productInfo.slug },
      });

      if (!existingProduct) {
        const product = await db.product.create({
          data: {
            ...productInfo,
            variants: {
              create: variants,
            },
          },
        });
        console.log(`Created product: ${product.name}`);
      }
    }

    // Create Site Settings
    await db.siteSetting.upsert({
      where: { key: 'siteName' },
      update: { value: 'Adalagi' },
      create: { key: 'siteName', value: 'Adalagi', type: 'string' },
    });

    await db.siteSetting.upsert({
      where: { key: 'siteDescription' },
      update: { value: 'Luxury Perfume House - Crafting Timeless Elegance' },
      create: { key: 'siteDescription', value: 'Luxury Perfume House - Crafting Timeless Elegance', type: 'string' },
    });

    // Create Banners (only if not exists)
    const existingBanners = await db.banner.count();
    if (existingBanners === 0) {
      await db.banner.createMany({
        data: [
          {
            title: 'Discover the Art of Perfumery',
            subtitle: 'Each fragrance tells a unique story',
            image: '/images/hero-banner-1.jpg',
            position: 'hero',
            order: 1,
          },
          {
            title: 'New Collection 2024',
            subtitle: 'Explore our latest creations',
            image: '/images/hero-banner-2.jpg',
            position: 'hero',
            order: 2,
          },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        categories: categories.length,
        scentProfiles: scentProfiles.length,
        products: products.length,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
