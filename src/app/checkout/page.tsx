'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Wallet,
  Building2,
  QrCode,
  Truck,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { useCartStore, useCheckoutStore } from '@/store';
import { toast } from 'sonner';
import type { ShippingOption, Category, ScentProfile } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { shippingData, setShippingData, selectedCourier, setSelectedCourier, setPaymentMethod, reset } = useCheckoutStore();
  const [step, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scentProfiles, setScentProfiles] = useState<ScentProfile[]>([]);
  
  // Shipping form
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    provinceId: '',
    province: '',
    cityId: '',
    city: '',
    districtId: '',
    district: '',
    postalCode: '',
    fullAddress: '',
    notes: '',
  });

  // Location data
  const [provinces, setProvinces] = useState<Array<{ provinceId: string; province: string }>>([]);
  const [cities, setCities] = useState<Array<{ cityId: string; city: string; type: string }>>([]);
  const [districts, setDistricts] = useState<Array<{ districtId: string; district: string; postalCode: string }>>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  
  // Payment
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: string; type: string; name: string; logo: string; description: string; banks?: string[] }>>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [selectedPaymentBank, setSelectedPaymentBank] = useState('');
  
  // Order confirmation
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = getSubtotal();
  const shippingCost = selectedCourier?.cost || 0;
  const totalAmount = subtotal + shippingCost;

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) setCategories(catData.data);

      setScentProfiles([
        { id: '1', name: 'Woody', slug: 'woody', description: '' },
        { id: '2', name: 'Floral', slug: 'floral', description: '' },
      ]);

      // Fetch provinces
      const provRes = await fetch('/api/shipping?type=provinces');
      const provData = await provRes.json();
      if (provData.success) setProvinces(provData.data);

      // Fetch payment methods
      const payRes = await fetch('/api/payment/methods');
      const payData = await payRes.json();
      if (payData.success) setPaymentMethods(payData.data);
    };

    fetchInitialData();

    // Redirect if cart is empty
    if (items.length === 0 && step !== 'confirmation') {
      router.push('/catalog');
    }
  }, [items.length, router, step]);

  // Fetch cities when province changes
  useEffect(() => {
    if (formData.provinceId) {
      fetch(`/api/shipping?type=cities&provinceId=${formData.provinceId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setCities(data.data);
        });
      setFormData(prev => ({ ...prev, cityId: '', city: '', districtId: '', district: '' }));
    }
  }, [formData.provinceId]);

  // Fetch districts when city changes
  useEffect(() => {
    if (formData.cityId) {
      fetch(`/api/shipping?type=districts&cityId=${formData.cityId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setDistricts(data.data);
        });
      setFormData(prev => ({ ...prev, districtId: '', district: '' }));
    }
  }, [formData.cityId]);

  // Calculate shipping when district changes
  useEffect(() => {
    if (formData.districtId && items.length > 0) {
      const weight = items.reduce((total, item) => total + (item.quantity * 500), 0); // 500g per item
      
      fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provinceId: formData.provinceId,
          cityId: formData.cityId,
          weight,
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setShippingOptions(data.data);
        });
    }
  }, [formData.districtId, items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleProvinceChange = (provinceId: string) => {
    const province = provinces.find(p => p.provinceId === provinceId);
    setFormData(prev => ({
      ...prev,
      provinceId,
      province: province?.province || '',
    }));
  };

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.cityId === cityId);
    setFormData(prev => ({
      ...prev,
      cityId,
      city: city ? `${city.type} ${city.city}` : '',
    }));
  };

  const handleDistrictChange = (districtId: string) => {
    const district = districts.find(d => d.districtId === districtId);
    setFormData(prev => ({
      ...prev,
      districtId,
      district: district?.district || '',
      postalCode: district?.postalCode || '',
    }));
  };

  const handleShippingSubmit = () => {
    if (!formData.recipientName || !formData.phone || !formData.fullAddress || !formData.districtId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setShippingData(formData);
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (!selectedCourier || !selectedPaymentType) {
      toast.error('Please select shipping and payment method');
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.product.name,
            variantName: item.variant.name,
            quantity: item.quantity,
            unitPrice: item.variant.price,
          })),
          shippingAddress: shippingData || formData,
          courier: selectedCourier.courier,
          courierService: selectedCourier.service,
          shippingCost: selectedCourier.cost,
          subtotal,
        }),
      });

      const orderData = await orderRes.json();

      if (orderData.success) {
        // Create payment
        const paymentRes = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.data.id,
            amount: totalAmount,
            customerName: formData.recipientName,
            customerEmail: 'customer@example.com',
            customerPhone: formData.phone,
            paymentType: selectedPaymentType,
            paymentMethod: selectedPaymentBank,
          }),
        });

        const paymentData = await paymentRes.json();

        if (paymentData.success) {
          setOrderNumber(orderData.data.orderNumber);
          setCurrentStep('confirmation');
          clearCart();
          reset();
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholderImage = (name: string) => {
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&q=80&seed=${seed}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header categories={categories} scentProfiles={scentProfiles} />
      
      <main className="flex-1 pt-24 md:pt-28 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 md:mb-12">
            {['cart', 'shipping', 'payment', 'confirmation'].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  ['cart', 'shipping', 'payment', 'confirmation'].indexOf(step) >= index
                    ? 'bg-[#c49a3a] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 md:w-24 h-0.5 ${
                    ['cart', 'shipping', 'payment', 'confirmation'].indexOf(step) > index
                      ? 'bg-[#c49a3a]'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-6 md:p-8 shadow-sm"
                >
                  <h2 className="font-serif text-2xl mb-6">Shipping Information</h2>

                  <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="recipientName">Recipient Name *</Label>
                        <Input
                          id="recipientName"
                          value={formData.recipientName}
                          onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="mt-1.5"
                          placeholder="08xxxxxxxxxx"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Province *</Label>
                        <Select value={formData.provinceId} onValueChange={handleProvinceChange}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.map(prov => (
                              <SelectItem key={prov.provinceId} value={prov.provinceId}>
                                {prov.province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>City *</Label>
                        <Select value={formData.cityId} onValueChange={handleCityChange} disabled={!formData.provinceId}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map(city => (
                              <SelectItem key={city.cityId} value={city.cityId}>
                                {city.type} {city.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>District (Kecamatan) *</Label>
                        <Select value={formData.districtId} onValueChange={handleDistrictChange} disabled={!formData.cityId}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map(dist => (
                              <SelectItem key={dist.districtId} value={dist.districtId}>
                                {dist.district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          readOnly
                          className="mt-1.5 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fullAddress">Full Address *</Label>
                      <Input
                        id="fullAddress"
                        value={formData.fullAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
                        className="mt-1.5"
                        placeholder="Street name, house number, RT/RW, etc."
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        className="mt-1.5"
                        placeholder="Delivery instructions, etc."
                      />
                    </div>
                  </div>

                  {/* Shipping Options */}
                  {shippingOptions.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-medium mb-4">Select Shipping Method</h3>
                      <RadioGroup
                        value={selectedCourier?.courierCode + '-' + selectedCourier?.serviceType}
                        onValueChange={(value) => {
                          const [courierCode, serviceType] = value.split('-');
                          const option = shippingOptions.find(
                            o => o.courierCode === courierCode && o.serviceType === serviceType
                          );
                          if (option) setSelectedCourier(option);
                        }}
                      >
                        <div className="space-y-3">
                          {shippingOptions.map((option) => (
                            <Label
                              key={`${option.courierCode}-${option.serviceType}`}
                              htmlFor={`${option.courierCode}-${option.serviceType}`}
                              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-[#c49a3a] transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <RadioGroupItem
                                  value={`${option.courierCode}-${option.serviceType}`}
                                  id={`${option.courierCode}-${option.serviceType}`}
                                />
                                <div>
                                  <p className="font-medium">{option.service}</p>
                                  <p className="text-sm text-gray-500">{option.estimatedDays} days</p>
                                </div>
                              </div>
                              <span className="font-medium">{formatPrice(option.cost)}</span>
                            </Label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Link href="/catalog">
                      <Button variant="outline">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                    <Button
                      onClick={handleShippingSubmit}
                      className="bg-[#c49a3a] hover:bg-[#a67c2e]"
                    >
                      Continue to Payment
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-6 md:p-8 shadow-sm"
                >
                  <h2 className="font-serif text-2xl mb-6">Payment Method</h2>

                  {/* Payment Type Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { type: 'QRIS', icon: QrCode, label: 'QRIS' },
                      { type: 'VIRTUAL_ACCOUNT', icon: Building2, label: 'Virtual Account' },
                      { type: 'E_WALLET', icon: Wallet, label: 'E-Wallet' },
                      { type: 'CREDIT_CARD', icon: CreditCard, label: 'Credit Card' },
                    ].map((method) => (
                      <button
                        key={method.type}
                        onClick={() => {
                          setSelectedPaymentType(method.type);
                          setSelectedPaymentBank('');
                        }}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                          selectedPaymentType === method.type
                            ? 'border-[#c49a3a] bg-[#c49a3a]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <method.icon className={`w-6 h-6 ${
                          selectedPaymentType === method.type ? 'text-[#c49a3a]' : 'text-gray-400'
                        }`} />
                        <span className="text-sm font-medium">{method.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Bank Selection for VA */}
                  {selectedPaymentType === 'VIRTUAL_ACCOUNT' && (
                    <div className="mb-8">
                      <h3 className="font-medium mb-4">Select Bank</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['BCA', 'Mandiri', 'BNI', 'BRI', 'Permata', 'CIMB Niaga'].map((bank) => (
                          <button
                            key={bank}
                            onClick={() => setSelectedPaymentBank(bank)}
                            className={`p-4 border-2 rounded-lg text-center transition-colors ${
                              selectedPaymentBank === bank
                                ? 'border-[#c49a3a] bg-[#c49a3a]/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium">{bank}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* E-Wallet Selection */}
                  {selectedPaymentType === 'E_WALLET' && (
                    <div className="mb-8">
                      <h3 className="font-medium mb-4">Select E-Wallet</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['GoPay', 'ShopeePay', 'OVO', 'DANA'].map((wallet) => (
                          <button
                            key={wallet}
                            onClick={() => setSelectedPaymentBank(wallet.toLowerCase())}
                            className={`p-4 border-2 rounded-lg text-center transition-colors ${
                              selectedPaymentBank === wallet.toLowerCase()
                                ? 'border-[#c49a3a] bg-[#c49a3a]/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium">{wallet}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shipping Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-8">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-[#c49a3a] mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedCourier?.service}</p>
                        <p className="text-sm text-gray-500">
                          To: {formData.recipientName} · {formData.city}
                        </p>
                        <p className="text-sm text-gray-500">
                          Est. delivery: {selectedCourier?.estimatedDays} days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep('shipping')}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back to Shipping
                    </Button>
                    <Button
                      onClick={handlePaymentSubmit}
                      disabled={isLoading || !selectedPaymentType || (selectedPaymentType === 'VIRTUAL_ACCOUNT' && !selectedPaymentBank)}
                      className="bg-[#c49a3a] hover:bg-[#a67c2e]"
                    >
                      {isLoading ? 'Processing...' : 'Place Order'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'confirmation' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-6 md:p-8 shadow-sm text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h2 className="font-serif text-3xl mb-2">Order Confirmed!</h2>
                  <p className="text-gray-500 mb-6">
                    Thank you for your order. We&apos;ll send you a confirmation email shortly.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-8">
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-2xl font-serif">{orderNumber}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/catalog">
                      <Button variant="outline">Continue Shopping</Button>
                    </Link>
                    <Link href="/">
                      <Button className="bg-[#c49a3a] hover:bg-[#a67c2e]">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-28">
                <h3 className="font-serif text-lg mb-4">Order Summary</h3>
                
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3">
                      <img
                        src={getPlaceholderImage(item.product.name)}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500">{item.variant.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.variant.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3 py-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span>{shippingCost > 0 ? formatPrice(shippingCost) : '-'}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-medium text-lg pt-4">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-500">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
