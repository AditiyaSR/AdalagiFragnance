'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image/Video Placeholder */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2072')`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Tagline */}
          <motion.p
            className="text-[#c49a3a] text-sm md:text-base tracking-[0.3em] uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Luxury Perfume House
          </motion.p>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-tight mb-8">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              The Art of
            </motion.span>
            <motion.span
              className="block text-gradient-gold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Timeless Elegance
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Discover our collection of rare and exquisite fragrances, 
            crafted with the world&apos;s most precious ingredients.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <Link href="/catalog">
              <Button
                size="lg"
                className="bg-[#c49a3a] hover:bg-[#a67c2e] text-white px-8 py-6 text-sm tracking-[0.1em] uppercase btn-luxury"
              >
                Explore Collection
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-sm tracking-[0.1em] uppercase"
            >
              <Play className="mr-2 w-4 h-4" />
              Watch Story
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center text-white/40"
          >
            <span className="text-xs tracking-[0.2em] uppercase mb-2">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-[#c49a3a]/30 to-transparent" />
      <div className="absolute top-1/3 right-8 w-px h-48 bg-gradient-to-b from-transparent via-[#c49a3a]/30 to-transparent" />
    </section>
  );
}
