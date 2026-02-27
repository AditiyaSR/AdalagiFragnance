'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ShoppingBag, Heart } from 'lucide-react';
import { useCartStore, useUIStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Category, ScentProfile } from '@/types';

interface HeaderProps {
  categories: Category[];
  scentProfiles: ScentProfile[];
}

export function Header({ categories, scentProfiles }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { openCart, getTotalItems } = useCartStore();
  const { setSearchQuery: setGlobalSearchQuery } = useUIStore();
  
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setGlobalSearchQuery(searchQuery);
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navLinks = [
    { href: '/catalog', label: 'Collection' },
    { href: '/catalog?scentProfile=woody', label: 'Woody' },
    { href: '/catalog?scentProfile=floral', label: 'Floral' },
    { href: '/catalog?scentProfile=oriental', label: 'Oriental' },
    { href: '/catalog?newArrival=true', label: 'New Arrivals' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2"
          >
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-black' : 'text-white'}`} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.h1
              className={`font-serif text-2xl md:text-3xl tracking-[0.2em] transition-colors duration-300 ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              ADALAGI
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:text-[#c49a3a] ${
                  isScrolled ? 'text-black' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <button className={`p-2 transition-colors ${
                  isScrolled ? 'text-black hover:text-[#c49a3a]' : 'text-white hover:text-[#c49a3a]'
                }`}>
                  <Search className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="top" className="h-[200px] bg-black/95 border-none">
                <SheetHeader>
                  <SheetTitle className="text-white sr-only">Search</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-12">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search fragrances..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-14 bg-transparent border-white/20 text-white text-lg placeholder:text-white/40 focus:border-[#c49a3a]"
                    />
                    <button
                      type="submit"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`hidden md:block p-2 transition-colors ${
                isScrolled ? 'text-black hover:text-[#c49a3a]' : 'text-white hover:text-[#c49a3a]'
              }`}
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className={`hidden md:block p-2 transition-colors ${
                isScrolled ? 'text-black hover:text-[#c49a3a]' : 'text-white hover:text-[#c49a3a]'
              }`}
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className={`relative p-2 transition-colors ${
                isScrolled ? 'text-black hover:text-[#c49a3a]' : 'text-white hover:text-[#c49a3a]'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#c49a3a] text-white text-xs flex items-center justify-center rounded-full"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 h-20">
                <h1 className="font-serif text-2xl tracking-[0.2em] text-white">
                  ADALAGI
                </h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 px-6 py-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-4 text-2xl text-white font-light tracking-wider border-b border-white/10"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="px-6 py-8 border-t border-white/10">
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center text-white/60 hover:text-white py-3"
                >
                  <User className="w-5 h-5 mr-3" />
                  Account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center text-white/60 hover:text-white py-3"
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Wishlist
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
