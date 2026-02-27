'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types';

interface NewArrivalsProps {
  products: Product[];
  isLoading: boolean;
  onQuickView?: (product: Product) => void;
}

export function NewArrivals({ products, isLoading, onQuickView }: NewArrivalsProps) {
  return (
    <section className="py-20 md:py-32 bg-[#faf9f7]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#c49a3a] text-sm tracking-[0.3em] uppercase mb-4 block">
              Just Landed
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-black">
              New Arrivals
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 md:mt-0"
          >
            <Link href="/catalog?newArrival=true">
              <Button
                variant="link"
                className="text-black hover:text-[#c49a3a] p-0 text-sm"
              >
                View All New Arrivals
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-white animate-pulse rounded-xl mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/4" />
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} onQuickView={onQuickView} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
