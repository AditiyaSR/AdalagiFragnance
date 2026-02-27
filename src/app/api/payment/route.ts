import { NextRequest, NextResponse } from 'next/server';

// Mock Midtrans Payment Gateway Integration
// In production, replace with actual Midtrans/Xendit SDK calls

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  logo: string;
  description: string;
  banks?: string[];
}

interface PaymentRequest {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentType: string;
  paymentMethod?: string;
}

// Available payment methods for Indonesia
const paymentMethods: PaymentMethod[] = [
  {
    id: 'qris',
    type: 'QRIS',
    name: 'QRIS',
    logo: '/images/payment/qris.svg',
    description: 'Scan QR code with any e-wallet app',
  },
  {
    id: 'va',
    type: 'VIRTUAL_ACCOUNT',
    name: 'Virtual Account',
    logo: '/images/payment/va.svg',
    description: 'Bank transfer to virtual account',
    banks: ['BCA', 'Mandiri', 'BNI', 'BRI', 'Permata', 'CIMB Niaga'],
  },
  {
    id: 'gopay',
    type: 'E_WALLET',
    name: 'GoPay',
    logo: '/images/payment/gopay.svg',
    description: 'Pay with GoPay e-wallet',
  },
  {
    id: 'shopeepay',
    type: 'E_WALLET',
    name: 'ShopeePay',
    logo: '/images/payment/shopeepay.svg',
    description: 'Pay with ShopeePay e-wallet',
  },
  {
    id: 'ovo',
    type: 'E_WALLET',
    name: 'OVO',
    logo: '/images/payment/ovo.svg',
    description: 'Pay with OVO e-wallet',
  },
  {
    id: 'dana',
    type: 'E_WALLET',
    name: 'DANA',
    logo: '/images/payment/dana.svg',
    description: 'Pay with DANA e-wallet',
  },
  {
    id: 'cc',
    type: 'CREDIT_CARD',
    name: 'Credit Card',
    logo: '/images/payment/cc.svg',
    description: 'Visa, Mastercard, JCB',
  },
];

// GET /api/payment/methods - Get available payment methods
export async function GET() {
  return NextResponse.json({
    success: true,
    data: paymentMethods,
  });
}

// POST /api/payment - Create payment transaction
export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    const { orderId, amount, customerName, customerEmail, customerPhone, paymentType, paymentMethod } = body;

    // Generate mock transaction data
    const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    let paymentResponse: Record<string, unknown> = {
      transactionId,
      orderId,
      amount,
      status: 'PENDING',
      paymentType,
      createdAt: new Date().toISOString(),
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    switch (paymentType) {
      case 'QRIS':
        paymentResponse = {
          ...paymentResponse,
          qrisString: `00020101021126610014ID.LINKAJA.WWW011893600911002345678902021234567890303UMI51440014ID.CO.QRIS.WWW0215ID20212345678900303UMI5204541153033605802ID5913ADALAGI PERFUME6013JAKARTA SELATAN61051234062070703A0163049A7B`,
          qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ADALAGI-${orderId}`,
        };
        break;

      case 'VIRTUAL_ACCOUNT':
        const bankCode = paymentMethod || 'BCA';
        const vaNumber = generateVANumber(bankCode);
        paymentResponse = {
          ...paymentResponse,
          paymentMethod: bankCode,
          vaNumber,
          vaBank: bankCode,
          vaAccountName: 'PT ADALAGI PARFUM INDONESIA',
          instructions: [
            `Transfer ke nomor Virtual Account:`,
            `Bank: ${bankCode}`,
            `No. VA: ${vaNumber}`,
            `Nama: PT ADALAGI PARFUM INDONESIA`,
            `Jumlah: Rp ${amount.toLocaleString('id-ID')}`,
          ],
        };
        break;

      case 'E_WALLET':
        const walletType = paymentMethod || 'gopay';
        paymentResponse = {
          ...paymentResponse,
          paymentMethod: walletType,
          deepLink: getDeepLink(walletType, orderId, amount),
          qrString: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${walletType}-${orderId}`,
        };
        break;

      case 'CREDIT_CARD':
        paymentResponse = {
          ...paymentResponse,
          redirectUrl: `/payment/cc?order=${orderId}&token=${transactionId}`,
        };
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid payment type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

function generateVANumber(bank: string): string {
  const prefixes: Record<string, string> = {
    BCA: '8810',
    Mandiri: '8908',
    BNI: '8810',
    BRI: '8803',
    Permata: '8135',
    'CIMB Niaga': '8059',
  };
  
  const prefix = prefixes[bank] || '8810';
  const random = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  return `${prefix}${random}`;
}

function getDeepLink(wallet: string, orderId: string, amount: number): string {
  switch (wallet.toLowerCase()) {
    case 'gopay':
      return `gopay://pay?orderId=${orderId}&amount=${amount}`;
    case 'shopeepay':
      return `shopeepay://pay?orderId=${orderId}`;
    case 'ovo':
      return `ovo://pay?orderId=${orderId}&amount=${amount}`;
    case 'dana':
      return `dana://pay?orderId=${orderId}&amount=${amount}`;
    default:
      return '';
  }
}
