// Adalagi E-commerce Types

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  categoryId?: string;
  category?: Category;
  scentProfileId?: string;
  scentProfile?: ScentProfile;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  basePrice: number;
  comparePrice?: number;
  concentration: string;
  gender: 'Unisex' | 'Men' | 'Women';
  launchYear?: number;
  images: string[];
  mainImage: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  sku: string;
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  size: number;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ScentProfile {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  content?: string;
  isVerified: boolean;
  createdAt: string;
  user?: {
    name: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'CUSTOMER' | 'VIP' | 'ADMIN' | 'SUPER_ADMIN';
  isVip: boolean;
  image?: string;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  province: string;
  provinceId: string;
  city: string;
  cityId: string;
  district: string;
  districtId: string;
  postalCode: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  
  // Shipping Address
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  fullAddress: string;
  
  // Pricing
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  
  // Shipping
  courier?: string;
  courierService?: string;
  trackingNumber?: string;
  
  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  
  items: OrderItem[];
  payments?: Payment[];
  
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'FAILED' 
  | 'EXPIRED' 
  | 'REFUNDED';

export interface Payment {
  id: string;
  orderId: string;
  gateway: 'MIDTRANS' | 'XENDIT' | 'DOKU' | 'MANUAL';
  gatewayOrderId?: string;
  gatewayTransId?: string;
  paymentType: PaymentType;
  paymentMethod?: string;
  amount: number;
  status: PaymentStatus;
  vaNumber?: string;
  vaBank?: string;
  vaExpiresAt?: string;
  qrisString?: string;
  qrisExpiresAt?: string;
  ewalletDeepLink?: string;
  paidAt?: string;
  expiredAt?: string;
}

export type PaymentType = 
  | 'QRIS' 
  | 'VIRTUAL_ACCOUNT' 
  | 'E_WALLET' 
  | 'CREDIT_CARD' 
  | 'BANK_TRANSFER' 
  | 'CASH_ON_DELIVERY';

export interface ShippingOption {
  courier: string;
  service: string;
  serviceType: string;
  cost: number;
  estimatedDays: string;
  description: string;
}

export interface IndonesianLocation {
  provinceId: string;
  province: string;
  cityId: string;
  city: string;
  type: string; // 'Kabupaten' or 'Kota'
  districtId: string;
  district: string;
  postalCode: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Checkout Flow Types
export interface CheckoutData {
  recipientName: string;
  phone: string;
  province: string;
  provinceId: string;
  city: string;
  cityId: string;
  district: string;
  districtId: string;
  postalCode: string;
  fullAddress: string;
  courier: string;
  courierService: string;
  shippingCost: number;
  notes?: string;
  discountCode?: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentType;
  name: string;
  logo: string;
  description: string;
  banks?: string[];
}
