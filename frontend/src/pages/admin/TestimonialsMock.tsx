import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { Star, PlusCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export const TestimonialsMock: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Create review modal states
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  // Query reviews
  const { data, isLoading } = useQuery({
    queryKey: ['adminTestimonials'],
    queryFn: async () => {
      const res = await api.get('/testimonials?adminView=true');
      return res.data;
    },
  });

  const testimonials = data?.testimonials || [];

  // Mutate create review
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/testimonials', payload);
      return res.data;
    },
    onSuccess: () => {
      showToast('Offline review registered successfully!', 'success');
      setIsOpen(false);
      // Reset forms
      setClientName('');
      setClientRole('');
      setClientCompany('');
      setFeedback('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
    },
    onError: () => showToast('Failed to create review.', 'error'),
  });

  // Mutate update approval status
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await api.put(`/testimonials/${id}`, payload);
      return res.data;
    },
    onSuccess: (res) => {
      showToast(res.message || 'Review status updated successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
    },
    onError: () => showToast('Failed to update status.', 'error'),
  });

  // Mutate delete review
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/testimonials/${id}`);
      return res.data;
    },
    onSuccess: () => {
      showToast('Review deleted permanently.', 'success');
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
    },
    onError: () => showToast('Failed to delete review.', 'error'),
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !feedback) return;
    createMutation.mutate({
      clientName,
      clientRole,
      clientCompany,
      feedback,
      rating,
    });
  };

  const toggleApproval = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'pending' : 'published';
    updateMutation.mutate({ id, payload: { status: nextStatus } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Client Testimonials</h1>
          <p className="text-sm text-slate-500">Moderate submitted guest reviews, feature feedback cards, or add offline entries.</p>
        </div>
        <Button variant="accent" onClick={() => setIsOpen(true)} className="flex items-center gap-1 shadow-goldGlow">
          <PlusCircle className="w-4.5 h-4.5" /> Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={['Client details', 'Feedback message', 'Rating stars', 'Publishing', 'Actions']}>
            {testimonials.map((test: any) => (
              <tr key={test._id} className="hover:bg-slate-50/50 dark:hover:bg-primary-light/5 border-b border-slate-100 dark:border-slate-800/50 text-xs">
                <td className="p-4 font-bold text-slate-900 dark:text-white">
                  {test.clientName}
                  <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{test.clientRole} &bull; {test.clientCompany || 'Independent'}</span>
                </td>
                <td className="p-4 text-slate-500 max-w-xs truncate">{test.feedback}</td>
                <td className="p-4">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: test.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5" fill="currentColor" />
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={test.status === 'published' ? 'success' : 'warning'}>
                    {test.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleApproval(test._id, test.status)}
                      className={`p-2 border rounded-lg transition-colors ${
                        test.status === 'published'
                          ? 'border-red-200 dark:border-red-800 text-red-500 hover:bg-red-500/5'
                          : 'border-emerald-200 dark:border-emerald-800 text-emerald-500 hover:bg-emerald-500/5'
                      }`}
                      title={test.status === 'published' ? 'Reject/Unpublish' : 'Approve/Publish'}
                    >
                      {test.status === 'published' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this testimonial permanently?')) deleteMutation.mutate(test._id); }}
                      className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-red-500 hover:border-red-500/30"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Add Offline Testimonial Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Offline Testimonial" size="md">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <Input label="Client Name" type="text" required value={clientName} onChange={(e: any) => setClientName(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Role / Designation" type="text" placeholder="e.g. Director" value={clientRole} onChange={(e: any) => setClientRole(e.target.value)} />
            <Input label="Company" type="text" placeholder="e.g. Stirling Capital" value={clientCompany} onChange={(e: any) => setClientCompany(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Rating Stars</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Feedback Message</label>
            <textarea value={feedback} required onChange={(e) => setFeedback(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent min-h-[90px]" />
          </div>
          <Button type="submit" variant="accent" className="w-full" isLoading={createMutation.isPending}>
            Publish Testimonial
          </Button>
        </form>
      </Modal>
    </div>
  );
};
