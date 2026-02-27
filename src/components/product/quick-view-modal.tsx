'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Minus, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store';
import { toast } from 'sonner';
import type { Product, ProductVariant } from '@/types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a size');
      return;
    }
    addItem(product, selectedVariant, quantity);
    toast.success(`Added ${quantity}x ${product.name} to cart`);
    onClose();
  };

  const getPlaceholderImage = (name: string) => {
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80&seed=${seed}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-20 lg:inset-32 bg-white rounded-2xl z-50 overflow-hidden shadow-2xl"
          >
            <div className="h-full overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 h-full">
                {/* Image Side */}
                <div className="relative bg-gray-100 min-h-[300px] md:min-h-full">
                  <img
                    src={getPlaceholderImage(product.name)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNewArrival && (
                      <Badge className="bg-black text-white">New</Badge>
                    )}
                    {product.isBestSeller && (
                      <Badge className="bg-[#c49a3a] text-white">Best Seller</Badge>
                    )}
                    {product.comparePrice && (
                      <Badge className="bg-red-600 text-white">Sale</Badge>
                    )}
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-6 md:p-10 flex flex-col">
                  {/* Scent Profile */}
                  {product.scentProfile && (
                    <p className="text-[#c49a3a] text-sm tracking-[0.15em] uppercase mb-2">
                      {product.scentProfile.name}
                    </p>
                  )}

                  {/* Name */}
                  <h2 className="font-serif text-3xl md:text-4xl text-black mb-2">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#c49a3a] text-[#c49a3a]" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(24 reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-2xl font-medium">
                      {formatPrice(selectedVariant?.price || product.basePrice)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  <Separator className="mb-6" />

                  {/* Size Selection */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Select Size</h3>
                    <div className="flex gap-3">
                      {product.variants?.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={variant.stock <= 0}
                          className={`px-5 py-2.5 border-2 rounded-lg transition-all text-sm ${
                            selectedVariant?.id === variant.id
                              ? 'border-black bg-black text-white'
                              : variant.stock <= 0
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                              : 'border-gray-200 hover:border-black'
                          }`}
                        >
                          {variant.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Quantity</h3>
                    <div className="flex items-center border rounded-lg w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2.5 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-5 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2.5 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 h-12 bg-[#c49a3a] hover:bg-[#a67c2e] text-white"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* View Full Details */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="text-center text-sm text-[#c49a3a] hover:underline mt-4"
                    onClick={onClose}
                  >
                    View Full Details →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import Link from 'next/link';
