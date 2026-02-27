'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/store';
import { toast } from 'sonner';
import type { Product, ProductVariant, Category, ScentProfile } from '@/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scentProfiles, setScentProfiles] = useState<ScentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        
        if (data.success) {
          setProduct(data.data);
          if (data.data.variants?.length > 0) {
            setSelectedVariant(data.data.variants[0]);
          }
        }

        // Fetch categories for header
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.data);
        }

        setScentProfiles([
          { id: '1', name: 'Woody', slug: 'woody', description: '' },
          { id: '2', name: 'Floral', slug: 'floral', description: '' },
          { id: '3', name: 'Oriental', slug: 'oriental', description: '' },
          { id: '4', name: 'Fresh', slug: 'fresh', description: '' },
        ]);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      toast.error('Please select a size');
      return;
    }

    if (selectedVariant.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addItem(product, selectedVariant, quantity);
    toast.success(`Added ${quantity}x ${product.name} (${selectedVariant.name}) to cart`);
  };

  const getPlaceholderImages = (name: string) => {
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return [
      `https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80&seed=${seed}`,
      `https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80&seed=${seed + 1}`,
      `https://images.unsplash.com/photo-1595341595379-cf1cd0ed7ad1?w=800&q=80&seed=${seed + 2}`,
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header categories={categories} scentProfiles={scentProfiles} />
        <main className="flex-1 pt-24 md:pt-28">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 py-12">
              <div className="aspect-square bg-gray-100 animate-pulse rounded-lg" />
              <div className="space-y-6">
                <div className="h-8 bg-gray-100 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                <div className="h-6 bg-gray-100 animate-pulse rounded w-1/4" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header categories={categories} scentProfiles={scentProfiles} />
        <main className="flex-1 pt-24 md:pt-28 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Product not found</h1>
            <Button onClick={() => window.location.href = '/catalog'}>
              Back to Collection
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const images = getPlaceholderImages(product.name);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header categories={categories} scentProfiles={scentProfiles} />
      
      <main className="flex-1 pt-24 md:pt-28">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 py-8 md:py-12">
            {/* Image Gallery */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNewArrival && (
                    <Badge className="bg-black text-white">New Arrival</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge className="bg-[#c49a3a] text-white">Best Seller</Badge>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Scent Profile */}
              {product.scentProfile && (
                <p className="text-[#c49a3a] text-sm tracking-[0.15em] uppercase">
                  {product.scentProfile.name}
                </p>
              )}

              {/* Name */}
              <h1 className="font-serif text-4xl md:text-5xl text-black">
                {product.name}
              </h1>

              {/* Concentration & Gender */}
              <p className="text-gray-500">
                {product.concentration} · {product.gender}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-medium">
                  {formatPrice(selectedVariant?.price || product.basePrice)}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>

              <Separator />

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-medium mb-4">Select Size</h3>
                <div className="flex gap-3">
                  {product.variants?.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock <= 0}
                      className={`px-6 py-3 border-2 rounded-lg transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-black bg-black text-white'
                          : variant.stock <= 0
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      <div className="text-sm font-medium">{variant.name}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {formatPrice(variant.price)}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedVariant && (
                  <p className="text-sm text-gray-500 mt-3">
                    {selectedVariant.stock > 0
                      ? `${selectedVariant.stock} items in stock`
                      : 'Out of stock'}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium mb-4">Quantity</h3>
                <div className="flex items-center border rounded-md w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-[#c49a3a] hover:bg-[#a67c2e] text-white"
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: Shield, text: 'Authenticity' },
                  { icon: RefreshCw, text: '30-Day Returns' },
                ].map((feature) => (
                  <div key={feature.text} className="text-center p-4 bg-gray-50 rounded-lg">
                    <feature.icon className="w-5 h-5 mx-auto mb-2 text-[#c49a3a]" />
                    <p className="text-xs text-gray-600">{feature.text}</p>
                  </div>
                ))}
              </div>

              {/* Scent Notes */}
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-4">Scent Notes</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-[#c49a3a] uppercase tracking-wider mb-2">Top</p>
                    <ul className="space-y-1">
                      {product.topNotes?.map((note, i) => (
                        <li key={i} className="text-sm text-gray-600">{note}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-[#c49a3a] uppercase tracking-wider mb-2">Heart</p>
                    <ul className="space-y-1">
                      {product.heartNotes?.map((note, i) => (
                        <li key={i} className="text-sm text-gray-600">{note}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-[#c49a3a] uppercase tracking-wider mb-2">Base</p>
                    <ul className="space-y-1">
                      {product.baseNotes?.map((note, i) => (
                        <li key={i} className="text-sm text-gray-600">{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <motion.div
            className="py-12 border-t"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-4"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-4"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-4"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-8">
                <div className="max-w-3xl">
                  <p className="text-gray-600 leading-relaxed">
                    {product.longDescription || product.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="details" className="pt-8">
                <div className="max-w-3xl grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Concentration</p>
                    <p className="font-medium">{product.concentration}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{product.gender}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Launch Year</p>
                    <p className="font-medium">{product.launchYear || '2024'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-8">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-5xl font-serif">4.9</div>
                    <div>
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#c49a3a] text-[#c49a3a]" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Based on 24 reviews</p>
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    {[
                      { name: 'Anisa R.', rating: 5, date: '2 weeks ago', content: 'Absolutely stunning fragrance. The longevity is incredible and I get compliments everywhere I go.' },
                      { name: 'Michael W.', rating: 5, date: '1 month ago', content: 'This has become my signature scent. The quality rivals luxury brands at twice the price.' },
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{review.name}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#c49a3a] text-[#c49a3a]" />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
