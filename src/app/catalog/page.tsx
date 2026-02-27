'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/product/product-card';
import { QuickViewModal } from '@/components/product/quick-view-modal';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, Grid, List, X } from 'lucide-react';
import type { Product, Category, ScentProfile } from '@/types';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scentProfiles, setScentProfiles] = useState<ScentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScentProfile, setSelectedScentProfile] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  useEffect(() => {
    // Read URL params
    const category = searchParams.get('category');
    const scent = searchParams.get('scentProfile');
    const gender = searchParams.get('gender');
    const search = searchParams.get('search');
    const newArrival = searchParams.get('newArrival');
    const bestSeller = searchParams.get('bestSeller');

    if (category) setSelectedCategory(category);
    if (scent) setSelectedScentProfile(scent);
    if (gender) setSelectedGender(gender);
    if (search) setSearchQuery(search);

    const fetchData = async () => {
      try {
        // Build query params
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (scent) params.append('scentProfile', scent);
        if (gender) params.append('gender', gender);
        if (search) params.append('search', search);
        if (newArrival) params.append('newArrival', newArrival);
        if (bestSeller) params.append('bestSeller', bestSeller);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          setProducts(data.data);
        }

        // Fetch categories
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.data);
        }

        // Mock scent profiles
        setScentProfiles([
          { id: '1', name: 'Woody', slug: 'woody', description: '' },
          { id: '2', name: 'Floral', slug: 'floral', description: '' },
          { id: '3', name: 'Oriental', slug: 'oriental', description: '' },
          { id: '4', name: 'Fresh', slug: 'fresh', description: '' },
          { id: '5', name: 'Leather', slug: 'leather', description: '' },
        ]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Client-side filtering for price
  const filteredProducts = products.filter((product) => {
    const price = product.variants?.[0]?.price || product.basePrice;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.variants?.[0]?.price || a.basePrice;
    const priceB = b.variants?.[0]?.price || b.basePrice;
    
    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedScentProfile(null);
    setSelectedGender(null);
    setPriceRange([0, 500000]);
    setSearchQuery(null);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setQuickViewProduct(null), 300);
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h4 className="font-medium mb-4 text-sm tracking-wide">Category</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.slug}
                checked={selectedCategory === category.slug}
                onCheckedChange={() =>
                  setSelectedCategory(
                    selectedCategory === category.slug ? null : category.slug
                  )
                }
              />
              <Label htmlFor={category.slug} className="text-sm cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Scent Profiles */}
      <div>
        <h4 className="font-medium mb-4 text-sm tracking-wide">Scent Profile</h4>
        <div className="space-y-3">
          {scentProfiles.map((profile) => (
            <div key={profile.id} className="flex items-center space-x-3">
              <Checkbox
                id={profile.slug}
                checked={selectedScentProfile === profile.slug}
                onCheckedChange={() =>
                  setSelectedScentProfile(
                    selectedScentProfile === profile.slug ? null : profile.slug
                  )
                }
              />
              <Label htmlFor={profile.slug} className="text-sm cursor-pointer">
                {profile.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h4 className="font-medium mb-4 text-sm tracking-wide">For</h4>
        <div className="space-y-3">
          {['Unisex', 'Men', 'Women'].map((gender) => (
            <div key={gender} className="flex items-center space-x-3">
              <Checkbox
                id={gender}
                checked={selectedGender === gender}
                onCheckedChange={() =>
                  setSelectedGender(selectedGender === gender ? null : gender)
                }
              />
              <Label htmlFor={gender} className="text-sm cursor-pointer">
                {gender}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-4 text-sm tracking-wide">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={500000}
          min={0}
          step={25000}
          className="mt-6"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Rp {(priceRange[0] / 1000).toFixed(0)}K</span>
          <span>Rp {(priceRange[1] / 1000).toFixed(0)}K</span>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full rounded-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header categories={categories} scentProfiles={scentProfiles} />
      
      <main className="flex-1 pt-24 md:pt-28">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          {/* Page Header */}
          <motion.div
            className="py-8 md:py-12 border-b"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl text-black mb-2">
              Collection
            </h1>
            <p className="text-gray-500">
              {sortedProducts.length} fragrances found
            </p>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            className="flex items-center justify-between py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden rounded-full">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Active Filters */}
              {(selectedCategory || selectedScentProfile || selectedGender) && (
                <div className="hidden md:flex items-center gap-2">
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                      {categories.find(c => c.slug === selectedCategory)?.name}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedCategory(null)}
                      />
                    </span>
                  )}
                  {selectedScentProfile && (
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                      {scentProfiles.find(s => s.slug === selectedScentProfile)?.name}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedScentProfile(null)}
                      />
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 rounded-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden md:flex items-center border rounded-full">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-full ${viewMode === 'grid' ? 'bg-black text-white' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-full ${viewMode === 'list' ? 'bg-black text-white' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex gap-8 pb-16">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28">
                <FilterContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-xl mb-4" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-100 animate-pulse rounded w-1/4" />
                        <div className="h-5 bg-gray-100 animate-pulse rounded w-3/4" />
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">No products found matching your criteria.</p>
                  <Button variant="link" onClick={clearFilters} className="mt-4">
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} onQuickView={handleQuickView} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
