'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { BrandPhilosophy } from '@/components/sections/brand-philosophy';
import { ScentCollections } from '@/components/sections/scent-collections';
import { NewArrivals } from '@/components/sections/new-arrivals';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { QuickViewModal } from '@/components/product/quick-view-modal';
import type { Product, Category, ScentProfile } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scentProfiles, setScentProfiles] = useState<ScentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Seed database first
        await fetch('/api/seed');
        
        // Fetch products
        const productsRes = await fetch('/api/products?limit=20');
        const productsData = await productsRes.json();
        if (productsData.success) {
          setProducts(productsData.data);
        }

        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        // Use mock scent profiles for now
        setScentProfiles([
          { id: '1', name: 'Woody', slug: 'woody', description: 'Warm, earthy notes' },
          { id: '2', name: 'Floral', slug: 'floral', description: 'Romantic bouquets' },
          { id: '3', name: 'Oriental', slug: 'oriental', description: 'Rich, sensual notes' },
          { id: '4', name: 'Fresh', slug: 'fresh', description: 'Clean, invigorating' },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setQuickViewProduct(null), 300);
  };

  const featuredProducts = products.filter(p => p.isFeatured);
  const newArrivals = products.filter(p => p.isNewArrival);
  const bestSellers = products.filter(p => p.isBestSeller);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header categories={categories} scentProfiles={scentProfiles} />
      
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSection />
          
          <FeaturedProducts 
            products={featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)} 
            isLoading={isLoading}
            onQuickView={handleQuickView}
          />
          
          <BrandPhilosophy />
          
          <ScentCollections 
            products={products} 
            scentProfiles={scentProfiles}
            isLoading={isLoading} 
          />
          
          <NewArrivals 
            products={newArrivals.length > 0 ? newArrivals : products.slice(4, 8)} 
            isLoading={isLoading}
            onQuickView={handleQuickView}
          />
          
          <Testimonials />
          
          <Newsletter />
        </motion.div>
      </main>
      
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </div>
  );
}
