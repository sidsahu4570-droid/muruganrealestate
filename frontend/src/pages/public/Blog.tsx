import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { Calendar, Tag, Search, ChevronRight } from 'lucide-react';

export const Blog: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', search, selectedTag],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedTag) params.append('tag', selectedTag);
      const res = await api.get(`/blogs?${params.toString()}`);
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-12">
      <SEO
        title="Bespoke Estates Journal"
        description="Browse Aurelia Real Estate reports, penthouse interior guides, and southern Florida beach markets analyses."
      />

      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Our Journal</span>
        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white">
          Aurelia Market Insights
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Expert analysis on high-net-worth real estate cycles, design inspirations, and luxury investments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <Spinner />
          ) : data?.blogs?.length === 0 ? (
            <div className="text-slate-500 text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              No articles found matching your query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data?.blogs?.map((blog: any) => (
                <Card key={blog._id} hoverEffect className="flex flex-col h-full overflow-hidden p-0">
                  <div className="h-56 relative overflow-hidden">
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white line-clamp-2 h-14 font-serif">{blog.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{blog.content}</p>
                    </div>
                    <Link to={`/blog/${blog.slug}`} className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                      Read Article <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-gray-100 flex items-center gap-1.5 font-serif">
              <Search className="w-4 h-4 text-accent" /> Search Journal
            </h4>
            <Input
              type="text"
              placeholder="e.g. Waterfront, Sky"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Card>

          <Card className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-gray-100 flex items-center gap-1.5 font-serif">
              <Tag className="w-4 h-4 text-accent" /> Filter by Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {['All', 'Finance', 'Investment', 'Design', 'Luxury', 'Market', 'Miami'].map((tag) => {
                const isActive = (tag === 'All' && !selectedTag) || (selectedTag === tag);
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === 'All' ? '' : tag)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all border ${
                      isActive
                        ? 'bg-accent/15 border-accent text-accent shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
