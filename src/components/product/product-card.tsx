'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCartStore } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Product, ProductVariant } from '@/types';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [isLiked, setIsLiked] = useState(false);
  const { addItem, openCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedVariant || selectedVariant.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addItem(product, selectedVariant);
    toast.success(`Added ${product.name} to cart`, {
      action: {
        label: 'View Cart',
        onClick: openCart,
      },
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const getPlaceholderImage = (name: string) => {
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80&seed=${seed}`;
  };

  const discount = product.comparePrice 
    ? Math.round((1 - product.basePrice / product.comparePrice) * 100)
    : 0;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4">
          <motion.img
            src={getPlaceholderImage(product.name)}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          
          {/* Overlay Gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Quick Actions - Bottom */}
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <Button
              onClick={handleAddToCart}
              className="w-full bg-white text-black hover:bg-[#c49a3a] hover:text-white text-xs tracking-wider uppercase font-medium shadow-lg"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </motion.div>

          {/* Badges - Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span className="px-2.5 py-1 bg-black text-white text-[10px] tracking-wider uppercase rounded-full">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2.5 py-1 bg-[#c49a3a] text-white text-[10px] tracking-wider uppercase rounded-full">
                Best Seller
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] tracking-wider uppercase rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Actions - Top Right */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={toggleLike}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-black hover:bg-white hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleQuickView}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          {/* Scent Profile */}
          {product.scentProfile && (
            <p className="text-[10px] text-[#c49a3a] tracking-[0.15em] uppercase font-medium">
              {product.scentProfile.name}
            </p>
          )}
          
          {/* Name */}
          <h3 className="font-serif text-lg text-black group-hover:text-[#c49a3a] transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#c49a3a] text-[#c49a3a]" />
              ))}
            </div>
            <span className="text-xs text-gray-400">(24)</span>
          </div>
          
          {/* Concentration */}
          <p className="text-xs text-gray-500">
            {product.concentration} · {product.gender}
          </p>
          
          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-semibold text-black">
              {formatPrice(selectedVariant?.price || product.basePrice)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Size Variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex gap-2 pt-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={`px-3 py-1 text-xs border rounded-md transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {variant.size}ml
                </button>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
