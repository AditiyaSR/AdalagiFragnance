'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Anisa Rahma',
    role: 'Fashion Designer',
    location: 'Jakarta',
    content: 'Noir Absolu has become my signature scent. The complexity and longevity are unmatched. I receive compliments every time I wear it.',
    rating: 5,
    product: 'Noir Absolu',
  },
  {
    id: 2,
    name: 'Michael Wijaya',
    role: 'Business Executive',
    location: 'Surabaya',
    content: 'Finally, a luxury perfume brand from Indonesia that rivals international houses. The quality of ingredients is exceptional.',
    rating: 5,
    product: 'Velvet Oud',
  },
  {
    id: 3,
    name: 'Sarah Putri',
    role: 'Beauty Influencer',
    location: 'Bali',
    content: 'Jardin Nocturne is pure magic. The jasmine and tuberose blend creates the most romantic scent I have ever experienced.',
    rating: 5,
    product: 'Jardin Nocturne',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-[#fafafa]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#c49a3a] text-sm tracking-[0.3em] uppercase mb-4 block">
            What Our Clients Say
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-black mb-4">
            Testimonials
          </h2>
          <div className="w-24 h-px bg-[#c49a3a] mx-auto" />
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-8 rounded-lg shadow-sm relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-[#c49a3a]/20 absolute top-6 right-6" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? 'fill-[#c49a3a] text-[#c49a3a]' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Product */}
              <p className="text-sm text-[#c49a3a] mb-4">
                — {testimonial.product}
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <p className="font-medium text-black">{testimonial.name}</p>
                <p className="text-sm text-gray-500">
                  {testimonial.role} · {testimonial.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
