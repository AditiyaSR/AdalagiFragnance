'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Product, ScentProfile } from '@/types';

interface ScentCollectionsProps {
  products: Product[];
  scentProfiles: ScentProfile[];
  isLoading: boolean;
}

const scentCategories = [
  {
    name: 'Woody',
    slug: 'woody',
    description: 'Warm, earthy notes of sandalwood, cedar, and oud',
    image: 'https://images.unsplash.com/photo-1595341595379-cf1cd0ed7ad1?q=80&w=600',
  },
  {
    name: 'Floral',
    slug: 'floral',
    description: 'Romantic bouquets of rose, jasmine, and peony',
    image: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=600',
  },
  {
    name: 'Oriental',
    slug: 'oriental',
    description: 'Rich, sensual notes of amber, vanilla, and spices',
    image: 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=600',
  },
  {
    name: 'Fresh',
    slug: 'fresh',
    description: 'Clean, invigorating notes of citrus and aquatic elements',
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600',
  },
];

export function ScentCollections({ products, scentProfiles, isLoading }: ScentCollectionsProps) {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#c49a3a] text-sm tracking-[0.3em] uppercase mb-4 block">
            Explore by Scent
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-black mb-4">
            Scent Collections
          </h2>
          <div className="w-24 h-px bg-[#c49a3a] mx-auto" />
        </motion.div>

        {/* Scent Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scentCategories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link href={`/catalog?scentProfile=${category.slug}`}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-[#c49a3a] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* Arrow */}
                    <motion.div
                      className="mt-4 flex items-center text-white/50 text-sm"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="mr-2">Explore</span>
                      <span>→</span>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
