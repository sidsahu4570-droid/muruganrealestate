import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { SEO } from '../../components/SEO';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import {
  Search,
  MapPin,
  Home as HomeIcon,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Award,
  Globe2,
  Calendar,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Search filter local states
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('sale');

  // Queries for featured properties
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: async () => {
      const res = await api.get('/properties?limit=3');
      return res.data;
    },
  });

  // Queries for latest blogs
  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ['latestBlogs'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data;
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (category) params.append('category', category);
    if (type) params.append('listingType', type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      <SEO
        title="Luxury Real Estate Portfolio"
        description="Aurelia curates the standard of premium living. Browse our waterfront estates, metropolis penthouses, and luxury villas."
      />

      {/* 1. Immersive Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Penthouse"
            className="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_8s_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b13] via-slate-900/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto px-6 text-center z-10 space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-accent block">
            Defining High-Altitude Prestige
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold leading-tight tracking-tight">
            The Standard of <br />
            <span className="text-accent italic font-normal">Luxury Living</span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Aurelia Luxury Estates curates high-net-worth real estate listings, waterfront villas, and bespoke penthouse investments globally.
          </p>

          {/* Advanced Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-3xl mx-auto mt-10 glass-premium rounded-2xl md:rounded-full p-4 border border-white/20 dark:border-white/5 flex flex-col md:flex-row gap-3 shadow-2xl items-center"
          >
            {/* City Selection */}
            <div className="flex items-center gap-2.5 px-4 py-2 w-full border-b md:border-b-0 md:border-r border-white/10">
              <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none"
              >
                <option value="" className="bg-[#070b13]">All Cities</option>
                <option value="new-york" className="bg-[#070b13]">New York</option>
                <option value="los-angeles" className="bg-[#070b13]">Los Angeles</option>
                <option value="miami" className="bg-[#070b13]">Miami</option>
              </select>
            </div>

            {/* Category Selection */}
            <div className="flex items-center gap-2.5 px-4 py-2 w-full border-b md:border-b-0 md:border-r border-white/10">
              <HomeIcon className="w-5 h-5 text-accent flex-shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none"
              >
                <option value="" className="bg-[#070b13]">All Categories</option>
                <option value="luxury-villa" className="bg-[#070b13]">Luxury Villa</option>
                <option value="penthouse-suite" className="bg-[#070b13]">Penthouse Suite</option>
                <option value="modern-apartment" className="bg-[#070b13]">Modern Apartment</option>
              </select>
            </div>

            {/* Rent/Buy Selection */}
            <div className="flex items-center gap-2.5 px-4 py-2 w-full">
              <DollarSign className="w-5 h-5 text-accent flex-shrink-0" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none"
              >
                <option value="sale" className="bg-[#070b13]">For Sale</option>
                <option value="rent" className="bg-[#070b13]">For Rent</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              className="w-full md:w-auto px-8 py-3 rounded-xl md:rounded-full flex items-center gap-2 text-primary font-bold shadow-goldGlow flex-shrink-0"
            >
              <Search className="w-4 h-4" /> Search
            </Button>
          </form>
        </div>
      </section>

      {/* 2. Featured Properties */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">Exquisite Listings</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">
              Featured Properties
            </h2>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {propertiesLoading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {propertiesData?.properties?.map((prop: any) => (
              <Card key={prop._id} hoverEffect className="flex flex-col h-full overflow-hidden p-0">
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary/80 backdrop-blur-sm border border-accent/20 rounded-full text-[10px] uppercase font-bold text-accent">
                    For {prop.listingType}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                      {prop.category?.name || 'Luxury Estate'}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white truncate">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      ${prop.price.toLocaleString()}
                      {prop.listingType === 'rent' && <span className="text-xs font-normal"> / mo</span>}
                    </span>
                    <Link
                      to={`/properties/${prop.slug}`}
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 3. Luxury Statistics */}
      <section className="bg-slate-900 dark:bg-primary-dark border-y border-accent/15 py-12 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '$45B+', label: 'Total Volume Sold' },
            { value: '1,200+', label: 'Luxury Transactions' },
            { value: '150+', label: 'Global Agents' },
            { value: '25+', label: 'Years of Excellence' },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="text-3xl lg:text-5xl font-serif font-bold text-accent">{stat.value}</h3>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Exemplary Standard</span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">
            Unrivaled Expertise. <br />
            Unmatched Execution.
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            At Aurelia, we do not merely close deals. We curate environments. Our brokers offer decades of bespoke transaction expertise to ensure absolute discretion and asset matching.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {[
              { title: 'Off-Market Access', desc: 'Secure high-end listings away from public boards.', icon: <ShieldCheck className="w-6 h-6 text-accent" /> },
              { title: 'Bespoke Advisory', desc: 'Tailored consulting for trust/family offices.', icon: <Award className="w-6 h-6 text-accent" /> },
              { title: 'Global Presence', desc: 'Network connections in premier metropolitan zones.', icon: <Globe2 className="w-6 h-6 text-accent" /> },
            ].map((feature, idx) => (
              <div key={idx} className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center mb-1">
                  {feature.icon}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{feature.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-2xl h-[450px]">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
            alt="Luxury Office"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 5. Cities Showcase */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Premier Destinations</span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">
            Properties by Cities
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: 'New York', slug: 'new-york', count: '48 Listings', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
            { name: 'Los Angeles', slug: 'los-angeles', count: '64 Listings', image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=800&q=80' },
            { name: 'Miami', slug: 'miami', count: '32 Listings', image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=800&q=80' },
          ].map((ct) => (
            <div
              key={ct.slug}
              onClick={() => navigate(`/properties?city=${ct.slug}`)}
              className="group relative rounded-2xl h-80 overflow-hidden cursor-pointer border border-slate-200/50 dark:border-slate-800/80 shadow-luxury"
            >
              <img
                src={ct.image}
                alt={ct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <h3 className="text-lg font-serif font-bold">{ct.name}</h3>
                <p className="text-[10px] text-accent uppercase font-bold tracking-widest">{ct.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Latest Blogs */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">Aurelia Journal</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">
              Latest Insights
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            View Journal <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {blogsLoading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogsData?.blogs?.slice(0, 3).map((blog: any) => (
              <Card key={blog._id} hoverEffect className="flex flex-col h-full overflow-hidden p-0">
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {blog.content}
                    </p>
                  </div>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    Read Article <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
