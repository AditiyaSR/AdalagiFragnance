'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Save,
  X,
  Upload,
  Star,
  ToggleLeft,
  ToggleRight,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import type { Product, Order, Category, ScentProfile, Banner } from '@/types';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTwitter: string;
  heroTitle: string;
  heroSubtitle: string;
  freeShippingMin: string;
  heroBanner1Title: string;
  heroBanner1Subtitle: string;
  heroBanner2Title: string;
  heroBanner2Subtitle: string;
  brandStoryTitle: string;
  brandStoryContent: string;
  brandStat1Value: string;
  brandStat1Label: string;
  brandStat2Value: string;
  brandStat2Label: string;
  brandStat3Value: string;
  brandStat3Label: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Adalagi',
  siteDescription: 'Luxury Perfume House',
  siteEmail: 'hello@adalagi.com',
  sitePhone: '+62 21 1234 567',
  siteAddress: 'Jl. Senopati No. 45, Jakarta Selatan',
  socialInstagram: 'https://instagram.com/adalagi',
  socialFacebook: 'https://facebook.com/adalagi',
  socialTwitter: 'https://twitter.com/adalagi',
  heroTitle: 'The Art of Timeless Elegance',
  heroSubtitle: 'Discover our collection of rare and exquisite fragrances',
  freeShippingMin: '500000',
  heroBanner1Title: 'Discover the Art of Perfumery',
  heroBanner1Subtitle: 'Each fragrance tells a unique story',
  heroBanner2Title: 'New Collection 2024',
  heroBanner2Subtitle: 'Explore our latest creations',
  brandStoryTitle: 'Crafting Emotions, One Drop at a Time',
  brandStoryContent: 'At Adalagi, we believe that a fragrance is more than a scent...',
  brandStat1Value: '50+',
  brandStat1Label: 'Unique Fragrances',
  brandStat2Value: '12',
  brandStat2Label: 'Countries Sourced',
  brandStat3Value: '4',
  brandStat3Label: 'Years of Excellence',
  newsletterTitle: 'Join the VIP Club',
  newsletterSubtitle: 'Subscribe to receive exclusive offers',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scentProfiles, setScentProfiles] = useState<ScentProfile[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialogs
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  // Product form
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    comparePrice: '',
    sku: '',
    concentration: 'Eau de Parfum',
    gender: 'Unisex',
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categoryId: '',
    scentProfileId: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
  });

  // Banner form
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    position: 'hero',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch products
      const productsRes = await fetch('/api/products?limit=100');
      const productsData = await productsRes.json();
      if (productsData.success) setProducts(productsData.data);

      // Fetch categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) setCategories(catData.data);

      // Fetch orders
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      if (ordersData.success) setOrders(ordersData.data);

      // Fetch banners
      const bannersRes = await fetch('/api/admin/banners');
      const bannersData = await bannersRes.json();
      if (bannersData.success) setBanners(bannersData.data);

      // Fetch settings
      const settingsRes = await fetch('/api/admin/settings');
      const settingsData = await settingsRes.json();
      if (settingsData.success) setSettings({ ...defaultSettings, ...settingsData.data });

      // Mock scent profiles
      setScentProfiles([
        { id: '1', name: 'Woody', slug: 'woody', description: '' },
        { id: '2', name: 'Floral', slug: 'floral', description: '' },
        { id: '3', name: 'Oriental', slug: 'oriental', description: '' },
        { id: '4', name: 'Fresh', slug: 'fresh', description: '' },
        { id: '5', name: 'Leather', slug: 'leather', description: '' },
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber }),
      });
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleSaveProduct = async () => {
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          basePrice: parseFloat(productForm.basePrice),
          comparePrice: productForm.comparePrice ? parseFloat(productForm.comparePrice) : null,
        }),
      });

      toast.success(editingProduct ? 'Product updated' : 'Product created');
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        basePrice: '',
        comparePrice: '',
        sku: '',
        concentration: 'Eau de Parfum',
        gender: 'Unisex',
        isActive: true,
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: false,
        categoryId: '',
        scentProfileId: '',
        topNotes: '',
        heartNotes: '',
        baseNotes: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleSaveBanner = async () => {
    try {
      const method = editingBanner ? 'PUT' : 'POST';
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerForm),
      });

      toast.success(editingBanner ? 'Banner updated' : 'Banner created');
      setIsBannerDialogOpen(false);
      setEditingBanner(null);
      setBannerForm({
        title: '',
        subtitle: '',
        image: '',
        link: '',
        position: 'hero',
        isActive: true,
        order: 0,
      });
      fetchData();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('Failed to save banner');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      toast.success('Banner deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice.toString(),
      comparePrice: product.comparePrice?.toString() || '',
      sku: product.sku,
      concentration: product.concentration,
      gender: product.gender,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      categoryId: product.categoryId || '',
      scentProfileId: product.scentProfileId || '',
      topNotes: product.topNotes?.join(', ') || '',
      heartNotes: product.heartNotes?.join(', ') || '',
      baseNotes: product.baseNotes?.join(', ') || '',
    });
    setIsProductDialogOpen(true);
  };

  const openEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '',
      position: banner.position,
      isActive: banner.isActive,
      order: banner.order,
    });
    setIsBannerDialogOpen(true);
  };

  // Calculate stats
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const processingOrders = orders.filter(o => o.status === 'PROCESSING').length;
  const totalProducts = products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-serif text-2xl tracking-wider">ADALAGI</h1>
            <span className="text-white/50">|</span>
            <span className="text-sm tracking-wider">Admin Dashboard</span>
          </div>
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'orders', icon: ShoppingBag, label: 'Orders' },
              { id: 'products', icon: Package, label: 'Products' },
              { id: 'banners', icon: ImageIcon, label: 'Banners' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === item.id
                    ? 'bg-[#c49a3a]/10 text-[#c49a3a]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="font-serif text-2xl mb-8">Dashboard Overview</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { icon: ShoppingBag, label: 'Total Revenue', value: formatPrice(totalRevenue), color: 'text-green-600', bg: 'bg-green-50' },
                    { icon: Package, label: 'Pending Orders', value: pendingOrders.toString(), color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { icon: Edit, label: 'Processing', value: processingOrders.toString(), color: 'text-blue-600', bg: 'bg-blue-50' },
                    { icon: Package, label: 'Total Products', value: totalProducts.toString(), color: 'text-purple-600', bg: 'bg-purple-50' },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                          <p className="text-2xl font-semibold">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-lg">Recent Orders</h3>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                      View All
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.slice(0, 5).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{order.recipientName}</TableCell>
                          <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl">Order Management</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            <div>
                              <p>{order.recipientName}</p>
                              <p className="text-sm text-gray-500">{order.courier || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                          <TableCell>
                            <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl">Product Management</h2>
                  <Button
                    className="bg-[#c49a3a] hover:bg-[#a67c2e]"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        description: '',
                        basePrice: '',
                        comparePrice: '',
                        sku: '',
                        concentration: 'Eau de Parfum',
                        gender: 'Unisex',
                        isActive: true,
                        isFeatured: false,
                        isNewArrival: false,
                        isBestSeller: false,
                        categoryId: '',
                        scentProfileId: '',
                        topNotes: '',
                        heartNotes: '',
                        baseNotes: '',
                      });
                      setIsProductDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.concentration}</p>
                            </div>
                          </TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>
                            <div>
                              <p>{formatPrice(product.basePrice)}</p>
                              {product.comparePrice && (
                                <p className="text-sm text-gray-400 line-through">
                                  {formatPrice(product.comparePrice)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {product.variants?.map((v) => (
                                <span key={v.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {v.name}: {v.stock}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              {product.isFeatured && <Badge variant="outline">Featured</Badge>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => openEditProduct(product)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}

            {/* Banners Tab */}
            {activeTab === 'banners' && (
              <motion.div
                key="banners"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl">Banner Management</h2>
                  <Button
                    className="bg-[#c49a3a] hover:bg-[#a67c2e]"
                    onClick={() => {
                      setEditingBanner(null);
                      setBannerForm({
                        title: '',
                        subtitle: '',
                        image: '',
                        link: '',
                        position: 'hero',
                        isActive: true,
                        order: 0,
                      });
                      setIsBannerDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Banner
                  </Button>
                </div>

                <div className="grid gap-4">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4"
                    >
                      <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {banner.image ? (
                          <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{banner.title}</h3>
                        <p className="text-sm text-gray-500">{banner.subtitle}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{banner.position}</Badge>
                          <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditBanner(banner)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl">Site Settings</h2>
                  <Button className="bg-[#c49a3a] hover:bg-[#a67c2e]" onClick={handleSaveSettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>

                <div className="space-y-8">
                  {/* General Settings */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-medium text-lg mb-6">General Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Site Name</Label>
                        <Input
                          value={settings.siteName}
                          onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Site Description</Label>
                        <Input
                          value={settings.siteDescription}
                          onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={settings.siteEmail}
                          onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={settings.sitePhone}
                          onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Address</Label>
                        <Input
                          value={settings.siteAddress}
                          onChange={(e) => setSettings({ ...settings, siteAddress: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Settings */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-medium text-lg mb-6">Hero Section</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Hero Title</Label>
                        <Input
                          value={settings.heroTitle}
                          onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Hero Subtitle</Label>
                        <Input
                          value={settings.heroSubtitle}
                          onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Brand Story Settings */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-medium text-lg mb-6">Brand Story Section</h3>
                    <div className="space-y-6">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={settings.brandStoryTitle}
                          onChange={(e) => setSettings({ ...settings, brandStoryTitle: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={settings.brandStoryContent}
                          onChange={(e) => setSettings({ ...settings, brandStoryContent: e.target.value })}
                          className="mt-1.5"
                          rows={4}
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <Label>Stat 1 Value</Label>
                          <Input
                            value={settings.brandStat1Value}
                            onChange={(e) => setSettings({ ...settings, brandStat1Value: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label>Stat 1 Label</Label>
                          <Input
                            value={settings.brandStat1Label}
                            onChange={(e) => setSettings({ ...settings, brandStat1Label: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <Label>Stat 2 Value</Label>
                          <Input
                            value={settings.brandStat2Value}
                            onChange={(e) => setSettings({ ...settings, brandStat2Value: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label>Stat 2 Label</Label>
                          <Input
                            value={settings.brandStat2Label}
                            onChange={(e) => setSettings({ ...settings, brandStat2Label: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <Label>Stat 3 Value</Label>
                          <Input
                            value={settings.brandStat3Value}
                            onChange={(e) => setSettings({ ...settings, brandStat3Value: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label>Stat 3 Label</Label>
                          <Input
                            value={settings.brandStat3Label}
                            onChange={(e) => setSettings({ ...settings, brandStat3Label: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Settings */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-medium text-lg mb-6">Social Media</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label>Instagram URL</Label>
                        <Input
                          value={settings.socialInstagram}
                          onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Facebook URL</Label>
                        <Input
                          value={settings.socialFacebook}
                          onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Twitter URL</Label>
                        <Input
                          value={settings.socialTwitter}
                          onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Newsletter Settings */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-medium text-lg mb-6">Newsletter</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Newsletter Title</Label>
                        <Input
                          value={settings.newsletterTitle}
                          onChange={(e) => setSettings({ ...settings, newsletterTitle: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Newsletter Subtitle</Label>
                        <Input
                          value={settings.newsletterSubtitle}
                          onChange={(e) => setSettings({ ...settings, newsletterSubtitle: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>SKU</Label>
                <Input
                  value={productForm.sku}
                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="mt-1.5"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Base Price (IDR)</Label>
                <Input
                  type="number"
                  value={productForm.basePrice}
                  onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Compare Price (IDR)</Label>
                <Input
                  type="number"
                  value={productForm.comparePrice}
                  onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Concentration</Label>
                <Select
                  value={productForm.concentration}
                  onValueChange={(v) => setProductForm({ ...productForm, concentration: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parfum">Parfum</SelectItem>
                    <SelectItem value="Extrait de Parfum">Extrait de Parfum</SelectItem>
                    <SelectItem value="Eau de Parfum">Eau de Parfum</SelectItem>
                    <SelectItem value="Eau de Toilette">Eau de Toilette</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  value={productForm.gender}
                  onValueChange={(v) => setProductForm({ ...productForm, gender: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unisex">Unisex</SelectItem>
                    <SelectItem value="Men">Men</SelectItem>
                    <SelectItem value="Women">Women</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={productForm.categoryId}
                  onValueChange={(v) => setProductForm({ ...productForm, categoryId: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scent Profile</Label>
                <Select
                  value={productForm.scentProfileId}
                  onValueChange={(v) => setProductForm({ ...productForm, scentProfileId: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select scent" />
                  </SelectTrigger>
                  <SelectContent>
                    {scentProfiles.map((sp) => (
                      <SelectItem key={sp.id} value={sp.id}>
                        {sp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Top Notes (comma-separated)</Label>
                <Input
                  value={productForm.topNotes}
                  onChange={(e) => setProductForm({ ...productForm, topNotes: e.target.value })}
                  className="mt-1.5"
                  placeholder="Bergamot, Lemon, Pepper"
                />
              </div>
              <div>
                <Label>Heart Notes (comma-separated)</Label>
                <Input
                  value={productForm.heartNotes}
                  onChange={(e) => setProductForm({ ...productForm, heartNotes: e.target.value })}
                  className="mt-1.5"
                  placeholder="Rose, Jasmine, Oud"
                />
              </div>
              <div>
                <Label>Base Notes (comma-separated)</Label>
                <Input
                  value={productForm.baseNotes}
                  onChange={(e) => setProductForm({ ...productForm, baseNotes: e.target.value })}
                  className="mt-1.5"
                  placeholder="Sandalwood, Amber, Musk"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={productForm.isActive}
                  onCheckedChange={(v) => setProductForm({ ...productForm, isActive: !!v })}
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={productForm.isFeatured}
                  onCheckedChange={(v) => setProductForm({ ...productForm, isFeatured: !!v })}
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={productForm.isNewArrival}
                  onCheckedChange={(v) => setProductForm({ ...productForm, isNewArrival: !!v })}
                />
                <span className="text-sm">New Arrival</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={productForm.isBestSeller}
                  onCheckedChange={(v) => setProductForm({ ...productForm, isBestSeller: !!v })}
                />
                <span className="text-sm">Best Seller</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#c49a3a] hover:bg-[#a67c2e]" onClick={handleSaveProduct}>
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Banner Dialog */}
      <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Title</Label>
              <Input
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={bannerForm.subtitle}
                onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={bannerForm.image}
                onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                className="mt-1.5"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Link</Label>
              <Input
                value={bannerForm.link}
                onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                className="mt-1.5"
                placeholder="/catalog"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Position</Label>
                <Select
                  value={bannerForm.position}
                  onValueChange={(v) => setBannerForm({ ...bannerForm, position: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="middle">Middle</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={bannerForm.order}
                  onChange={(e) => setBannerForm({ ...bannerForm, order: parseInt(e.target.value) || 0 })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={bannerForm.isActive}
                onCheckedChange={(v) => setBannerForm({ ...bannerForm, isActive: !!v })}
              />
              <span className="text-sm">Active</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBannerDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#c49a3a] hover:bg-[#a67c2e]" onClick={handleSaveBanner}>
              {editingBanner ? 'Update Banner' : 'Create Banner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">{formatPrice(selectedOrder.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.recipientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <Badge variant={selectedOrder.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedOrder.status === status ? 'default' : 'outline'}
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
