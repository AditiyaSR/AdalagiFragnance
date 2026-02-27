'use client';

import { useCartStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPlaceholderImage = (name: string) => {
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&q=80&seed=${seed}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="font-serif text-xl">Your Cart</h2>
                <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-6">Your cart is empty</p>
                <Link href="/catalog" onClick={closeCart}>
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4"
                      >
                        {/* Image */}
                        <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getPlaceholderImage(item.product.name)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm text-black truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.variant.name} · {item.product.concentration}
                          </p>
                          <p className="text-sm font-medium mt-2">
                            {formatPrice(item.variant.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="p-1.5 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="p-1.5 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-6 border-t space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-400">Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <Link href="/checkout" onClick={closeCart}>
                    <Button className="w-full h-12 bg-[#c49a3a] hover:bg-[#a67c2e] text-white">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Link href="/catalog" onClick={closeCart}>
                    <Button variant="outline" className="w-full h-12">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
