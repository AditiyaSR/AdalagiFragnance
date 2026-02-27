'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Crown,
  Package,
  Heart,
  MapPin,
  LogOut,
  Edit,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import type { Category, ScentProfile } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories] = useState<Category[]>([]);
  const [scentProfiles] = useState<ScentProfile[]>([]);

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Register form
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Mock orders for demo
  const mockOrders = [
    {
      id: '1',
      orderNumber: 'ADL-2024-000123',
      status: 'DELIVERED',
      totalAmount: 485000,
      createdAt: '2024-01-15',
      items: [{ name: 'Noir Absolu', quantity: 1 }],
    },
    {
      id: '2',
      orderNumber: 'ADL-2024-000089',
      status: 'SHIPPED',
      totalAmount: 345000,
      createdAt: '2024-01-10',
      items: [{ name: 'Jardin Nocturne', quantity: 1 }],
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock successful login
    setUser({
      id: '1',
      email: loginForm.email,
      name: 'Adalagi Member',
      role: 'VIP',
      isVip: true,
    });

    toast.success('Welcome back!');
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setUser({
      id: '1',
      email: registerForm.email,
      name: registerForm.name,
      phone: registerForm.phone,
      role: 'CUSTOMER',
      isVip: false,
    });

    toast.success('Account created successfully!');
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header categories={categories} scentProfiles={scentProfiles} />
        
        <main className="flex-1 pt-24 md:pt-28 pb-16">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 md:p-12 text-white mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#c49a3a] flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif">Welcome, {user.name}</h1>
                  <p className="text-white/60">{user.email}</p>
                </div>
              </div>
              {user.isVip && (
                <div className="inline-flex items-center gap-2 bg-[#c49a3a]/20 border border-[#c49a3a] rounded-full px-4 py-2">
                  <Crown className="w-4 h-4 text-[#c49a3a]" />
                  <span className="text-[#c49a3a] text-sm font-medium">VIP Member</span>
                </div>
              )}
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <nav className="space-y-2">
                    {[
                      { icon: Package, label: 'My Orders', active: true },
                      { icon: Heart, label: 'Wishlist' },
                      { icon: MapPin, label: 'Addresses' },
                      { icon: User, label: 'Profile' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          item.active
                            ? 'bg-[#c49a3a]/10 text-[#c49a3a]'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <Separator className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Orders', value: '12', icon: Package },
                    { label: 'Wishlist', value: '5', icon: Heart },
                    { label: 'Points', value: '2,450', icon: Crown },
                    { label: 'Saved', value: 'Rp 350K', icon: MapPin },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm">
                      <stat.icon className="w-6 h-6 text-[#c49a3a] mb-2" />
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl">Recent Orders</h2>
                    <Button variant="link" className="text-[#c49a3a]">
                      View All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:border-[#c49a3a] transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">
                              {order.items.map(i => i.name).join(', ')}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className="font-medium">{formatPrice(order.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl">Profile Information</h2>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-500">Full Name</Label>
                      <p className="font-medium mt-1">{user.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Email</Label>
                      <p className="font-medium mt-1">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Phone</Label>
                      <p className="font-medium mt-1">{user.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Member Since</Label>
                      <p className="font-medium mt-1">January 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Login/Register Page
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header categories={categories} scentProfiles={scentProfiles} />
      
      <main className="flex-1 pt-24 md:pt-28 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-3xl md:text-4xl text-black mb-2">Welcome</h1>
            <p className="text-gray-500">Sign in to access your account</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border rounded-2xl p-8 shadow-lg"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-8 bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="login"
                  className="w-1/2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="w-1/2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-10 pr-10 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <Link href="#" className="text-[#c49a3a] hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#c49a3a] hover:bg-[#a67c2e] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                {/* Demo hint */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 text-center">
                    Demo: Enter any email and password to login
                  </p>
                </div>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative mt-1.5">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-phone">Phone Number</Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+62</span>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="812 3456 7890"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        className="pl-12 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="pl-10 pr-10 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300 mt-1" required />
                    <span className="text-gray-600">
                      I agree to the{' '}
                      <Link href="/terms" className="text-[#c49a3a] hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-[#c49a3a] hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#c49a3a] hover:bg-[#a67c2e] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* VIP Benefits */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm font-medium text-center mb-4">VIP Member Benefits</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: Crown, label: 'Exclusive Offers' },
                  { icon: Package, label: 'Free Shipping' },
                  { icon: Heart, label: 'Early Access' },
                ].map((benefit) => (
                  <div key={benefit.label}>
                    <benefit.icon className="w-5 h-5 text-[#c49a3a] mx-auto mb-1" />
                    <p className="text-xs text-gray-500">{benefit.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
