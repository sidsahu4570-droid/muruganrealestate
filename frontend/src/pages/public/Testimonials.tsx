import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { Star, MessageSquare } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Testimonial submission form local states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  // Query reviews
  const { data, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const res = await api.get('/testimonials');
      return res.data;
    },
  });

  // Mutation to add review
  const { mutate, isPending } = useMutation({
    mutationFn: async (newReview: any) => {
      const res = await api.post('/testimonials', newReview);
      return res.data;
    },
    onSuccess: (res) => {
      showToast(res.message || 'Review submitted successfully!', 'success');
      // Reset form states
      setName('');
      setRole('');
      setCompany('');
      setFeedback('');
      setRating(5);
      // Refresh list
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to submit review';
      showToast(msg, 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !feedback) return;
    mutate({
      clientName: name,
      clientRole: role,
      clientCompany: company,
      feedback,
      rating,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-12">
      <SEO
        title="Client Testimonials"
        description="Read reviews and testimonials from family offices, developers, and corporate executives who have purchased properties through Aurelia."
      />

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Testimonials</span>
        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white">
          Trusted by Elite Investors
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Read transaction feedback from corporate executives, trusts, and home buyers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Side: Testimonials grid (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <Spinner />
          ) : data?.testimonials?.length === 0 ? (
            <div className="text-slate-500 text-center py-10">No reviews found. Be the first to write one!</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data?.testimonials?.map((test: any) => (
                <Card key={test._id} hoverEffect className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {Array.from({ length: test.rating }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 text-accent" fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed">
                      "{test.feedback}"
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <span className="text-xs font-bold text-slate-950 dark:text-gray-100 block">{test.clientName}</span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {test.clientRole} &bull; {test.clientCompany}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Form submit testimonial (1 col) */}
        <Card className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-gray-100 flex items-center gap-1.5">
              <MessageSquare className="w-4.5 h-4.5 text-accent" /> Share Your Experience
            </span>
            <p className="text-[10px] text-slate-400">Your review will immediately publish to this dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Your Name"
              type="text"
              placeholder="e.g. Victoria Stirling"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Role / Designation"
                type="text"
                placeholder="e.g. Founder"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <Input
                label="Company"
                type="text"
                placeholder="e.g. Stirling Ltd"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rating Stars</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-sm focus:outline-none focus:border-accent"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Feedback</label>
              <textarea
                placeholder="Write your transaction feedback here..."
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-sm focus:outline-none focus:border-accent min-h-[100px]"
              />
            </div>

            <Button type="submit" variant="accent" className="w-full mt-2" isLoading={isPending}>
              Submit Review
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
