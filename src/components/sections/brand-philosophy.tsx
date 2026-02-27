'use client';

import { motion } from 'framer-motion';

export function BrandPhilosophy() {
  return (
    <section className="py-24 md:py-40 bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Side */}
          <motion.div
            className="relative aspect-[4/5] rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1000"
              alt="Adalagi Perfume Craftsmanship"
              className="w-full h-full object-cover"
            />
            {/* Floating Accent */}
            <motion.div
              className="absolute -bottom-6 -right-6 w-48 h-48 border border-[#c49a3a]/30"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-[#c49a3a] text-sm tracking-[0.3em] uppercase mb-6 block">
              Our Philosophy
            </span>
            
            <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-8">
              Crafting Emotions,
              <br />
              <span className="text-gradient-gold">One Drop at a Time</span>
            </h2>

            <div className="space-y-6 text-white/70 leading-relaxed">
              <p>
                At Adalagi, we believe that a fragrance is more than a scent—it is 
                an emotion, a memory, a signature. Each creation begins with a story, 
                inspired by the rich tapestry of Indonesian botanicals and the timeless 
                traditions of French perfumery.
              </p>
              <p>
                Our master perfumers travel the world sourcing the rarest ingredients: 
                oud from Assam, rose absolute from Grasse, sandalwood from Mysore. 
                These precious materials are then artfully blended in our Jakarta 
                atelier, where tradition meets innovation.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/10">
              {[
                { number: '50+', label: 'Unique Fragrances' },
                { number: '12', label: 'Countries Sourced' },
                { number: '4', label: 'Years of Excellence' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index }}
                >
                  <div className="font-serif text-3xl md:text-4xl text-[#c49a3a] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
