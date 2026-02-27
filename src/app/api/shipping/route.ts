import { NextRequest, NextResponse } from 'next/server';

// Mock Indonesian shipping calculation (simulating RajaOngkir API)
// In production, replace with actual RajaOngkir API calls

interface ShippingCost {
  courier: string;
  courierCode: string;
  service: string;
  serviceType: string;
  cost: number;
  estimatedDays: string;
  description: string;
}

// Mock courier rates (per kg, base rates)
const courierRates: Record<string, { name: string; services: Record<string, { baseCost: number; perKg: number; days: string }> }> = {
  jne: {
    name: 'JNE',
    services: {
      REG: { baseCost: 9000, perKg: 4000, days: '3-5' },
      YES: { baseCost: 22000, perKg: 6000, days: '1-2' },
      OKE: { baseCost: 7000, perKg: 3500, days: '5-7' },
    },
  },
  sicepat: {
    name: 'SiCepat',
    services: {
      REG: { baseCost: 8000, perKg: 3500, days: '2-4' },
      BEST: { baseCost: 18000, perKg: 5500, days: '1-2' },
      HALU: { baseCost: 25000, perKg: 7000, days: '1' },
    },
  },
  jnt: {
    name: 'J&T Express',
    services: {
      EZ: { baseCost: 8500, perKg: 4000, days: '2-4' },
    },
  },
  paxel: {
    name: 'Paxel',
    services: {
      SAME_DAY: { baseCost: 35000, perKg: 8000, days: 'Same Day' },
      NEXT_DAY: { baseCost: 20000, perKg: 6000, days: '1' },
    },
  },
  anteraja: {
    name: 'AnterAja',
    services: {
      REG: { baseCost: 7500, perKg: 3500, days: '3-5' },
      NEXT_DAY: { baseCost: 16000, perKg: 5000, days: '1' },
    },
  },
};

// Distance multipliers by province (simulated zones)
const provinceZones: Record<string, number> = {
  'DKI Jakarta': 1.0,
  'Jawa Barat': 1.0,
  'Banten': 1.0,
  'Jawa Tengah': 1.1,
  'DI Yogyakarta': 1.1,
  'Jawa Timur': 1.2,
  'Bali': 1.3,
  'Sumatera Utara': 1.5,
  'Sumatera Selatan': 1.5,
  'Kalimantan Timur': 1.6,
  'Sulawesi Selatan': 1.7,
  'Papua': 2.0,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provinceId, cityId, weight = 1000 } = body;

    if (!provinceId || !cityId) {
      return NextResponse.json(
        { success: false, error: 'Province and city are required' },
        { status: 400 }
      );
    }

    // Get zone multiplier (default to 1.5 if not found)
    const zoneMultiplier = 1.2; // Default multiplier for demo

    // Calculate shipping options
    const shippingOptions: ShippingCost[] = [];

    for (const [courierCode, courier] of Object.entries(courierRates)) {
      for (const [serviceType, rates] of Object.entries(courier.services)) {
        const weightKg = Math.max(1, Math.ceil(weight / 1000));
        const cost = Math.round((rates.baseCost + (weightKg - 1) * rates.perKg) * zoneMultiplier);

        shippingOptions.push({
          courier: courier.name,
          courierCode,
          service: `${courier.name} ${serviceType}`,
          serviceType,
          cost,
          estimatedDays: rates.days,
          description: getServiceDescription(courierCode, serviceType),
        });
      }
    }

    // Sort by cost
    shippingOptions.sort((a, b) => a.cost - b.cost);

    return NextResponse.json({
      success: true,
      data: shippingOptions,
    });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate shipping' },
      { status: 500 }
    );
  }
}

function getServiceDescription(courier: string, service: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    jne: {
      REG: 'Regular delivery, economical choice',
      YES: 'Express delivery, guaranteed next day',
      OKE: 'Economy delivery, longest delivery time',
    },
    sicepat: {
      REG: 'Regular delivery with tracking',
      BEST: 'Express delivery, fast and reliable',
      HALU: 'Super express, same city priority',
    },
    jnt: {
      EZ: 'Express delivery nationwide',
    },
    paxel: {
      SAME_DAY: 'Same day delivery within city',
      NEXT_DAY: 'Next day guaranteed delivery',
    },
    anteraja: {
      REG: 'Affordable regular delivery',
      NEXT_DAY: 'Next day express delivery',
    },
  };

  return descriptions[courier]?.[service] || 'Standard delivery service';
}

// GET /api/shipping/provinces - Get all provinces
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'provinces') {
    return NextResponse.json({
      success: true,
      data: getProvinces(),
    });
  }

  if (type === 'cities') {
    const provinceId = searchParams.get('provinceId');
    return NextResponse.json({
      success: true,
      data: getCities(provinceId || ''),
    });
  }

  if (type === 'districts') {
    const cityId = searchParams.get('cityId');
    return NextResponse.json({
      success: true,
      data: getDistricts(cityId || ''),
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Invalid request type',
  }, { status: 400 });
}

// Mock location data
function getProvinces() {
  return [
    { provinceId: '1', province: 'DKI Jakarta' },
    { provinceId: '2', province: 'Jawa Barat' },
    { provinceId: '3', province: 'Banten' },
    { provinceId: '4', province: 'Jawa Tengah' },
    { provinceId: '5', province: 'DI Yogyakarta' },
    { provinceId: '6', province: 'Jawa Timur' },
    { provinceId: '7', province: 'Bali' },
    { provinceId: '8', province: 'Sumatera Utara' },
    { provinceId: '9', province: 'Sumatera Barat' },
    { provinceId: '10', province: 'Kalimantan Timur' },
  ];
}

function getCities(provinceId: string) {
  const citiesByProvince: Record<string, Array<{ cityId: string; city: string; type: string }>> = {
    '1': [
      { cityId: '101', city: 'Jakarta Pusat', type: 'Kota' },
      { cityId: '102', city: 'Jakarta Utara', type: 'Kota' },
      { cityId: '103', city: 'Jakarta Barat', type: 'Kota' },
      { cityId: '104', city: 'Jakarta Selatan', type: 'Kota' },
      { cityId: '105', city: 'Jakarta Timur', type: 'Kota' },
    ],
    '2': [
      { cityId: '201', city: 'Kota Bogor', type: 'Kota' },
      { cityId: '202', city: 'Kota Depok', type: 'Kota' },
      { cityId: '203', city: 'Kota Bandung', type: 'Kota' },
      { cityId: '204', city: 'Kota Cimahi', type: 'Kota' },
      { cityId: '205', city: 'Kota Bekasi', type: 'Kota' },
      { cityId: '206', city: 'Kabupaten Bogor', type: 'Kabupaten' },
      { cityId: '207', city: 'Kabupaten Bandung', type: 'Kabupaten' },
    ],
    '3': [
      { cityId: '301', city: 'Kota Tangerang', type: 'Kota' },
      { cityId: '302', city: 'Kota Tangerang Selatan', type: 'Kota' },
      { cityId: '303', city: 'Kota Serang', type: 'Kota' },
      { cityId: '304', city: 'Kabupaten Tangerang', type: 'Kabupaten' },
    ],
    '4': [
      { cityId: '401', city: 'Kota Semarang', type: 'Kota' },
      { cityId: '402', city: 'Kota Surakarta', type: 'Kota' },
      { cityId: '403', city: 'Kabupaten Semarang', type: 'Kabupaten' },
    ],
    '5': [
      { cityId: '501', city: 'Kota Yogyakarta', type: 'Kota' },
      { cityId: '502', city: 'Kabupaten Sleman', type: 'Kabupaten' },
      { cityId: '503', city: 'Kabupaten Bantul', type: 'Kabupaten' },
    ],
    '6': [
      { cityId: '601', city: 'Kota Surabaya', type: 'Kota' },
      { cityId: '602', city: 'Kota Malang', type: 'Kota' },
      { cityId: '603', city: 'Kabupaten Sidoarjo', type: 'Kabupaten' },
    ],
  };

  return citiesByProvince[provinceId] || [];
}

function getDistricts(cityId: string) {
  const districtsByCity: Record<string, Array<{ districtId: string; district: string; postalCode: string }>> = {
    '104': [ // Jakarta Selatan
      { districtId: '10401', district: 'Kebayoran Baru', postalCode: '12180' },
      { districtId: '10402', district: 'Kebayoran Lama', postalCode: '12210' },
      { districtId: '10403', district: 'Pasar Minggu', postalCode: '12780' },
      { districtId: '10404', district: 'Cilandak', postalCode: '12430' },
      { districtId: '10405', district: 'Pancoran', postalCode: '12780' },
    ],
    '105': [ // Jakarta Timur
      { districtId: '10501', district: 'Cakung', postalCode: '13910' },
      { districtId: '10502', district: 'Cipayung', postalCode: '13880' },
      { districtId: '10503', district: 'Ciracas', postalCode: '13740' },
      { districtId: '10504', district: 'Jatinegara', postalCode: '13310' },
    ],
    '201': [ // Kota Bogor
      { districtId: '20101', district: 'Bogor Barat', postalCode: '16115' },
      { districtId: '20102', district: 'Bogor Timur', postalCode: '16121' },
      { districtId: '20103', district: 'Bogor Utara', postalCode: '16123' },
      { districtId: '20104', district: 'Bogor Selatan', postalCode: '16133' },
    ],
    '203': [ // Kota Bandung
      { districtId: '20301', district: 'Bandung Wetan', postalCode: '40115' },
      { districtId: '20302', district: 'Coblong', postalCode: '40132' },
      { districtId: '20303', district: 'Cihamplas', postalCode: '40132' },
    ],
    '205': [ // Kota Bekasi
      { districtId: '20501', district: 'Bekasi Barat', postalCode: '17148' },
      { districtId: '20502', district: 'Bekasi Timur', postalCode: '17111' },
      { districtId: '20503', district: 'Bekasi Utara', postalCode: '17123' },
    ],
    '301': [ // Kota Tangerang
      { districtId: '30101', district: 'Tangerang', postalCode: '15111' },
      { districtId: '30102', district: 'Ciledug', postalCode: '15153' },
      { districtId: '30103', district: 'Karang Tengah', postalCode: '15157' },
    ],
    '302': [ // Tangerang Selatan
      { districtId: '30201', district: 'Serpong', postalCode: '15310' },
      { districtId: '30202', district: 'BSD', postalCode: '15345' },
      { districtId: '30203', district: 'Pamulang', postalCode: '15417' },
      { districtId: '30204', district: 'Ciputat', postalCode: '15411' },
    ],
    '501': [ // Yogyakarta
      { districtId: '50101', district: 'Gondokusuman', postalCode: '55221' },
      { districtId: '50102', district: 'Danurejan', postalCode: '55211' },
      { districtId: '50103', district: 'Gedongtengen', postalCode: '55271' },
    ],
    '601': [ // Surabaya
      { districtId: '60101', district: 'Gubeng', postalCode: '60281' },
      { districtId: '60102', district: 'Tegalsari', postalCode: '60262' },
      { districtId: '60103', district: 'Wonokromo', postalCode: '60231' },
    ],
  };

  return districtsByCity[cityId] || [
    { districtId: `${cityId}01`, district: 'Pusat', postalCode: '10000' },
    { districtId: `${cityId}02`, district: 'Utara', postalCode: '11000' },
    { districtId: `${cityId}03`, district: 'Selatan', postalCode: '12000' },
  ];
}
