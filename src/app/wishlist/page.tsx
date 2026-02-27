'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store';
import { toast } from 'sonner';
import type { Product, Category, ScentProfile } from '@/types';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scentProfiles, setScentProfiles] = useState<ScentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products and randomly select some for wishlist demo
        const res = await fetch('/api/products?limit=20');
        const data = await res.json();
        
        if (data.success) {
          // For demo, show 4 products as wishlist
          setWishlistItems(data.data.slice(0, 4));
        }

        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.data);
        }

        setScentProfiles([
          { id: '1', name: 'Woody', slug: 'woody', description: '' },
          { id: '2', name: 'Floral', slug: 'floral', description: '' },
        ]);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      if (item.variants && item.variants.length > 0) {
        addItem(item, item.variants[0]);
      }
    });
    toast.success('All items added to cart');
    openCart();
  };

  const handleRemoveItem = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    toast.success('Item removed from wishlist');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header categories={categories} scentProfiles={scentProfiles} />
      
      <main className="flex-1 pt-24 md:pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-[#c49a3a]" />
              <h1 className="font-serif text-3xl md:text-4xl text-black">My Wishlist</h1>
            </div>
            <p className="text-gray-500">
              {wishlistItems.length} items saved for later
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white animate-pulse rounded-lg" />
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Heart className="w-20 h-20 text-gray-200 mx-auto mb-6" />
              <h2 className="text-2xl font-serif text-black mb-4">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Save items you love by clicking the heart icon on any product
              </p>
              <Link href="/catalog">
                <Button className="bg-[#c49a3a] hover:bg-[#a67c2e] text-white">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Collection
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Actions */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-gray-500">
                  Share your wishlist with friends
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleAddAllToCart}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistItems.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <ProductCard product={product} />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(product.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-20"
              >
                <h2 className="font-serif text-2xl text-black mb-8">You May Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-48 bg-white rounded-lg animate-pulse" />
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
