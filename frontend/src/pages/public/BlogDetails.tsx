import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { SEO } from '../../components/SEO';
import { Spinner } from '../../components/ui/Spinner';
import { Calendar, User, ChevronLeft } from 'lucide-react';

export const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return res.data;
    },
  });

  const blog = data?.blog;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20 text-slate-500">
        Article could not be found. Return to <Link to="/blog" className="text-accent underline">Journal</Link>.
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 lg:py-20 space-y-8">
      <SEO
        title={blog.title}
        description={blog.content.slice(0, 155)}
        image={blog.coverImage}
      />

      <div>
        <Link to="/blog" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Journal
        </Link>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight font-serif">
          {blog.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium font-mono">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {blog.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>By {blog.author.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-xl h-[400px] border border-slate-200/50 dark:border-slate-800/80">
        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm text-slate-500 leading-relaxed space-y-6">
        <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-accent first-letter:mr-2 first-letter:float-left">
          {blog.content}
        </p>
        <p>
          Aurelia Market Advisory publishes these updates to track trends in primary zones. Always consult with registered transactions representatives before bidding.
        </p>
      </div>
    </article>
  );
};
