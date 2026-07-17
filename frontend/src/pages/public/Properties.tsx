import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { Modal } from '../../components/ui/Modal';
import { DEMO_PROPERTIES } from '../../services/demoData';
import {
  Grid,
  List,
  SlidersHorizontal,
  Heart,
  Scale,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Properties: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // View state: grid vs list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Compare modal open state
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Context integrations
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { compareItems, addToCompare, removeFromCompare, isInCompare, clearCompare } = useCompare();

  // Retrieve search filters from URL
  const search = searchParams.get('search') || '';
  const city = searchParams.get('city') || '';
  const category = searchParams.get('category') || '';
  const listingType = searchParams.get('listingType') || '';
  const beds = searchParams.get('beds') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'date-desc';
  const page = searchParams.get('page') || '1';

  // Fetch properties query
  const { data, isLoading } = useQuery({
    queryKey: ['properties', searchParams.toString()],
    queryFn: async () => {
      const res = await api.get(`/properties?${searchParams.toString()}`);
      return res.data;
    },
  });

  // Client-side filtering/sorting/pagination fallback for DEMO_PROPERTIES
  let propertiesList = data?.properties || [];
  let totalCount = data?.total || 0;

  if (propertiesList.length === 0 && !isLoading) {
    let filtered = [...DEMO_PROPERTIES];
    if (search) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    }
    if (city) {
      filtered = filtered.filter(p => p.city.name.toLowerCase() === city.toLowerCase() || p.city.name.toLowerCase().replace(' ', '-') === city.toLowerCase());
    }
    if (category) {
      filtered = filtered.filter(p => p.category.name.toLowerCase() === category.toLowerCase() || p.category.name.toLowerCase().replace(' ', '-') === category.toLowerCase());
    }
    if (listingType) {
      filtered = filtered.filter(p => p.listingType === listingType);
    }
    if (beds) {
      filtered = filtered.filter(p => p.specs.beds >= parseInt(beds));
    }
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
    }
    // Sorting
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    // Pagination (limit = 6)
    const limit = 6;
    const pageNum = parseInt(page) || 1;
    totalCount = filtered.length;
    propertiesList = filtered.slice((pageNum - 1) * limit, pageNum * limit);
  }

  const totalPages = Math.ceil(totalCount / 6);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset page on filter
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-8 relative">
      <SEO
        title="Browse Luxury Portfolios"
        description="Filter and search Manhattan duplex penthouses, Sunset Strip rentals, and beachfront estates by beds, price, and city."
      />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Properties Search</h1>
        <p className="text-sm text-slate-500">Discover premium architectural structures matching your criteria.</p>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel (Left column on desktop, stacked on mobile) */}
        <div className="lg:col-span-1 glass-premium rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/80 space-y-6 h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-855/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-gray-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-accent" /> Filters
            </span>
            <button onClick={handleClearFilters} className="text-[10px] text-accent hover:underline font-semibold">
              Clear All
            </button>
          </div>

          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Keyword</label>
            <Input
              type="text"
              placeholder="e.g. Penthouse, Dock"
              value={search}
              onChange={(e) => updateFilters('search', e.target.value)}
            />
          </div>

          {/* Destination City */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City</label>
            <select
              value={city}
              onChange={(e) => updateFilters('city', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-sm focus:outline-none focus:border-accent"
            >
              <option value="">All Cities</option>
              <option value="new-york">New York</option>
              <option value="los-angeles">Los Angeles</option>
              <option value="miami">Miami</option>
            </select>
          </div>

          {/* Portfolio Category */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
            <select
              value={category}
              onChange={(e) => updateFilters('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-sm focus:outline-none focus:border-accent"
            >
              <option value="">All Categories</option>
              <option value="luxury-villa">Luxury Villa</option>
              <option value="penthouse-suite">Penthouse Suite</option>
              <option value="modern-apartment">Modern Apartment</option>
            </select>
          </div>

          {/* Listing Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Listing Type</label>
            <select
              value={listingType}
              onChange={(e) => updateFilters('listingType', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-sm focus:outline-none focus:border-accent"
            >
              <option value="">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Minimum Bedrooms</label>
            <select
              value={beds}
              onChange={(e) => updateFilters('beds', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-sm focus:outline-none focus:border-accent"
            >
              <option value="">Any</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>
          </div>

          {/* Pricing Range */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateFilters('minPrice', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateFilters('maxPrice', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Listings Display (Right 3 columns on desktop) */}
        <div className="lg:col-span-3 space-y-6">
          {/* List Toolbar (view toggle + sorting) */}
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
            <span className="text-xs text-slate-500 font-medium">
              Showing {propertiesList.length} of {totalCount} Luxury Listings
            </span>

            <div className="flex items-center gap-4">
              {/* Sort Selector */}
              <select
                value={sort}
                onChange={(e) => updateFilters('sort', e.target.value)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b13] text-xs font-semibold focus:outline-none focus:border-accent"
              >
                <option value="date-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {/* View Mode buttons */}
              <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-accent/15 text-accent' : 'text-slate-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-accent/15 text-accent' : 'text-slate-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Properties Content */}
          {isLoading ? (
            <Spinner />
          ) : propertiesList.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No properties matching your criteria are currently active.</div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col gap-6'}>
              {propertiesList.map((prop: any) => {
                const wishlisted = isInWishlist(prop._id);
                const compared = isInCompare(prop._id);

                return (
                  <Card
                    key={prop._id}
                    hoverEffect
                    className={`p-0 overflow-hidden flex ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row h-72'}`}
                  >
                    {/* Property Image Cover */}
                    <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-64' : 'w-full md:w-96 h-full flex-shrink-0'}`}>
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant={prop.listingType === 'sale' ? 'accent' : 'info'}>
                          For {prop.listingType}
                        </Badge>
                      </div>

                      {/* Floating actions (Wishlist and Compare triggers) */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(prop._id);
                          }}
                          className={`p-2.5 rounded-full backdrop-blur-md shadow-md border border-white/20 transition-all ${
                            wishlisted ? 'bg-accent text-white border-accent' : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-red-500'
                          }`}
                          title="Wishlist"
                        >
                          <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (compared) {
                              removeFromCompare(prop._id);
                            } else {
                              addToCompare(prop);
                            }
                          }}
                          className={`p-2.5 rounded-full backdrop-blur-md shadow-md border border-white/20 transition-all ${
                            compared ? 'bg-accent text-white border-accent' : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-accent'
                          }`}
                          title="Compare"
                        >
                          <Scale className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Details block */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-accent tracking-wider font-mono">
                          {prop.category?.name} &bull; {prop.city?.name}
                        </span>
                        <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white truncate">
                          {prop.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {prop.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex gap-4 text-xs font-semibold text-slate-500 font-mono">
                          <span>{prop.specs.beds} Beds</span>
                          <span>{prop.specs.baths} Baths</span>
                          <span>{prop.specs.area.toLocaleString()} Sq Ft</span>
                        </div>
                        <Link
                          to={`/properties/${prop.slug}`}
                          className="px-4 py-2 bg-primary dark:bg-primary-light text-white text-xs font-bold rounded-xl hover:bg-accent hover:text-primary transition-all duration-300 shadow-md"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === '1'}
                onClick={() => updateFilters('page', String(Number(page) - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-slate-500 font-semibold font-mono">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={Number(page) >= totalPages}
                onClick={() => updateFilters('page', String(Number(page) + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Compare Panel (Slides from bottom if comparison items are chosen) */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#070b13]/95 backdrop-blur-md border-t border-accent/25 p-4 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto rounded-t-3xl">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-xs font-semibold text-slate-800 dark:text-gray-200">
              Comparing {compareItems.length} of 3 Properties
            </span>
          </div>

          <div className="flex items-center gap-3">
            {compareItems.map((item) => (
              <div key={item._id} className="relative flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-primary-dark">
                <img src={item.images[0]} alt={item.title} className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 max-w-[80px] truncate">{item.title}</span>
                <button
                  onClick={() => removeFromCompare(item._id)}
                  className="p-0.5 text-red-500 hover:bg-red-500/10 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={clearCompare}>
              Clear
            </Button>
            <Button size="sm" variant="accent" onClick={() => setCompareModalOpen(true)}>
              Compare Side-by-Side
            </Button>
          </div>
        </div>
      )}

      {/* 5. Compare Side-by-Side Modal */}
      <Modal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} title="Property Comparison" size="lg">
        <div className="grid grid-cols-4 gap-4 text-center divide-x divide-slate-100 dark:divide-slate-800">
          {/* Row Headers */}
          <div className="text-left space-y-8 pr-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            <div>Listing Image</div>
            <div className="pt-24">Title</div>
            <div className="pt-10">Pricing</div>
            <div className="pt-8">Category</div>
            <div className="pt-8">City</div>
            <div className="pt-8">Bedrooms</div>
            <div className="pt-8">Bathrooms</div>
            <div className="pt-8">Square Footage</div>
          </div>

          {/* Comparison Cards */}
          {compareItems.map((item) => (
            <div key={item._id} className="pl-4 space-y-8 text-sm">
              <div className="h-28 rounded-xl overflow-hidden relative">
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="font-serif font-bold text-slate-900 dark:text-white line-clamp-2 h-10">{item.title}</div>
              <div className="text-accent font-bold">₹{item.price.toLocaleString()}</div>
              <div className="text-slate-600 dark:text-slate-300">{item.category?.name}</div>
              <div className="text-slate-600 dark:text-slate-300">{item.city?.name}</div>
              <div className="font-semibold">{item.specs.beds}</div>
              <div className="font-semibold">{item.specs.baths}</div>
              <div className="font-semibold">{item.specs.area.toLocaleString()} Sq Ft</div>
            </div>
          ))}

          {/* Dummy placeholders for empty spots */}
          {Array.from({ length: 3 - compareItems.length }).map((_, idx) => (
            <div key={idx} className="pl-4 flex flex-col items-center justify-center text-slate-400 text-xs italic">
              Empty Slot
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
