'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
  onQuickView?: (product: Product) => void;
}

export function FeaturedProducts({ products, isLoading, onQuickView }: FeaturedProductsProps) {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#c49a3a] text-sm tracking-[0.3em] uppercase mb-4 block">
            Curated Selection
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-black mb-4">
            Featured Fragrances
          </h2>
          <div className="w-24 h-px bg-[#c49a3a] mx-auto mb-6" />
          <p className="text-gray-600 max-w-xl mx-auto">
            Our master perfumers have crafted these exceptional fragrances using 
            the rarest ingredients from around the world.
          </p>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-xl mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-1/4" />
                  <div className="h-5 bg-gray-100 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product, index) => (
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

        {/* View All Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/catalog">
            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white px-8 py-6 text-sm tracking-[0.1em] uppercase rounded-full"
            >
              View All Collection
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
