import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Trash2, Send } from 'lucide-react';

export const EnquiriesMock: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Selected enquiry and reply modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // Fetch enquiries
  const { data, isLoading } = useQuery({
    queryKey: ['adminEnquiries'],
    queryFn: async () => {
      const res = await api.get('/enquiries');
      return res.data;
    },
  });

  const enquiries = data?.enquiries || [];

  // Mutate reply
  const replyMutation = useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      const res = await api.post(`/enquiries/${id}/reply`, { message });
      return res.data;
    },
    onSuccess: (res) => {
      showToast(res.message || 'Reply sent successfully!', 'success');
      setReplyMessage('');
      setIsReplyOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminEnquiries'] });
    },
    onError: () => showToast('Failed to submit reply.', 'error'),
  });

  // Mutate delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/enquiries/${id}`);
      return res.data;
    },
    onSuccess: () => {
      showToast('Enquiry deleted successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['adminEnquiries'] });
    },
    onError: () => showToast('Failed to delete enquiry.', 'error'),
  });

  const handleOpenReply = (enq: any) => {
    setSelectedEnquiry(enq);
    setIsReplyOpen(true);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage || !selectedEnquiry) return;
    replyMutation.mutate({ id: selectedEnquiry._id, message: replyMessage });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Customer Enquiries</h1>
          <p className="text-sm text-slate-500">Respond to customer form messages and send auto SMTP replies.</p>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={['Customer Name', 'Message Preview', 'Property Link', 'Status Indicator', 'Actions']}>
            {enquiries.map((enq: any) => (
              <tr key={enq._id} className="hover:bg-slate-50/50 dark:hover:bg-primary-light/5 border-b border-slate-100 dark:border-slate-800/50 text-xs">
                <td className="p-4 font-bold text-slate-900 dark:text-white">
                  {enq.name}
                  <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{enq.email} &bull; {enq.phone || 'No phone'}</span>
                </td>
                <td className="p-4 text-slate-500 max-w-xs truncate">{enq.message}</td>
                <td className="p-4 font-serif font-bold text-slate-700 dark:text-slate-300">
                  {enq.property?.title || 'General Advisory'}
                </td>
                <td className="p-4">
                  <Badge variant={enq.status === 'replied' ? 'success' : enq.status === 'resolved' ? 'primary' : 'warning'}>
                    {enq.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenReply(enq)} className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> View Inbox
                    </Button>
                    <button onClick={() => { if (confirm('Delete this entry permanently?')) deleteMutation.mutate(enq._id); }} className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-red-500 hover:border-red-500/30" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Reply Modal */}
      <Modal isOpen={isReplyOpen} onClose={() => setIsReplyOpen(false)} title="Enquiry Response Terminal" size="md">
        {selectedEnquiry && (
          <div className="space-y-5 text-xs text-slate-500">
            {/* Customer original message */}
            <div className="p-4 bg-slate-50 dark:bg-primary-dark/25 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block font-mono">Original Message:</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">"{selectedEnquiry.message}"</p>
            </div>

            {/* Replies history */}
            {selectedEnquiry.replies?.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 block font-mono">Past Responses:</span>
                {selectedEnquiry.replies.map((rep: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white dark:bg-primary-dark/15 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-accent">{rep.senderName} &bull; {new Date(rep.createdAt).toLocaleString()}</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">"{rep.message}"</p>
                  </div>
                ))}
              </div>
            )}

            {/* Send Reply message */}
            <form onSubmit={handleReplySubmit} className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 block font-mono">Write Email Reply:</label>
              <textarea placeholder="Type response message..." required value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent min-h-[120px]" />
              <Button type="submit" variant="accent" className="w-full flex items-center justify-center gap-1 shadow-goldGlow" isLoading={replyMutation.isPending}>
                <Send className="w-4 h-4" /> Dispatch Reply Email
              </Button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};
