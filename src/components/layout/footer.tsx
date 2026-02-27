'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white">
      {/* Main Footer */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.h2
              className="font-serif text-3xl tracking-[0.2em] mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              ADALAGI
            </motion.h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Discover the art of perfumery with Adalagi. Each fragrance is a masterpiece, 
              crafted with the finest ingredients from around the world.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#c49a3a] hover:text-[#c49a3a] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#c49a3a] hover:text-[#c49a3a] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#c49a3a] hover:text-[#c49a3a] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm tracking-[0.2em] uppercase mb-6">Collection</h3>
            <ul className="space-y-4">
              {[
                { href: '/catalog', label: 'All Fragrances' },
                { href: '/catalog?newArrival=true', label: 'New Arrivals' },
                { href: '/catalog?bestSeller=true', label: 'Best Sellers' },
                { href: '/catalog?category=signature', label: 'Signature Collection' },
                { href: '/catalog?category=limited-edition', label: 'Limited Edition' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#c49a3a] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm tracking-[0.2em] uppercase mb-6">Customer Care</h3>
            <ul className="space-y-4">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/shipping', label: 'Shipping Information' },
                { href: '/returns', label: 'Returns & Exchanges' },
                { href: '/faq', label: 'FAQ' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#c49a3a] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm tracking-[0.2em] uppercase mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start text-white/60 text-sm">
                <MapPin className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                <span>
                  Jl. Senopati No. 45<br />
                  Jakarta Selatan 12110<br />
                  Indonesia
                </span>
              </li>
              <li className="flex items-center text-white/60 text-sm">
                <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                <a href="tel:+62211234567" className="hover:text-[#c49a3a] transition-colors">
                  +62 21 1234 567
                </a>
              </li>
              <li className="flex items-center text-white/60 text-sm">
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                <a href="mailto:hello@adalagi.com" className="hover:text-[#c49a3a] transition-colors">
                  hello@adalagi.com
                </a>
              </li>
            </ul>

            {/* Operating Hours */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/40 text-xs">Operating Hours</p>
              <p className="text-white/60 text-sm mt-1">
                Mon - Sat: 10:00 - 20:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-white/40 text-xs">
              © {currentYear} Adalagi. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-white/40 hover:text-white text-xs transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/40 hover:text-white text-xs transition-colors">
                Terms of Service
              </Link>
            </div>
            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-white/40 text-xs">Payment:</span>
              <div className="flex items-center space-x-2">
                {['QRIS', 'VISA', 'MC'].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 bg-white/10 rounded text-white/60 text-xs"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
