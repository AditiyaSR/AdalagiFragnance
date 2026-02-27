'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Welcome to the Adalagi family!');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 md:py-32 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(196, 154, 58, 0.5) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Mail className="w-12 h-12 text-[#c49a3a] mx-auto mb-6" />
          
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
            Join the VIP Club
          </h2>
          
          <p className="text-white/60 max-w-md mx-auto mb-8">
            Subscribe to receive exclusive offers, early access to new releases, 
            and insider tips from our master perfumers.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#c49a3a]"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 bg-[#c49a3a] hover:bg-[#a67c2e] text-white px-6"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <p className="text-white/40 text-xs mt-4">
            By subscribing, you agree to receive marketing communications from us.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
