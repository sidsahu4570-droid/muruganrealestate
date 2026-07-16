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
import {
  Search,
  Calendar,
  MessageSquare,
  History,
  Plus,
} from 'lucide-react';

export const LeadsMock: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  // Selected lead detailed view modal
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Note and Reminder states
  const [newNote, setNewNote] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderNote, setReminderNote] = useState('');

  // Fetch leads list
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['adminLeads', search, status, assignedTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (assignedTo) params.append('assignedTo', assignedTo);
      const res = await api.get(`/leads?${params.toString()}`);
      return res.data;
    },
  });

  // Fetch sales executives for assignment dropdown
  const { data: execsData } = useQuery({
    queryKey: ['salesExecutives'],
    queryFn: async () => {
      const res = await api.get('/leads/executives');
      return res.data;
    },
  });

  const leads = leadsData?.leads || [];
  const executives = execsData?.executives || [];

  // Mutate update lead status or assignment
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await api.put(`/leads/${id}`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      showToast('Lead updated successfully!', 'success');
      setSelectedLead(data.lead);
      queryClient.invalidateQueries({ queryKey: ['adminLeads'] });
    },
  });

  // Mutate add CRM note
  const addNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const res = await api.post(`/leads/${id}/notes`, { note });
      return res.data;
    },
    onSuccess: (data) => {
      showToast('CRM log note added!', 'success');
      setNewNote('');
      setSelectedLead(data.lead);
      queryClient.invalidateQueries({ queryKey: ['adminLeads'] });
    },
  });

  // Mutate add reminder
  const addReminderMutation = useMutation({
    mutationFn: async ({ id, time, note }: { id: string; time: string; note: string }) => {
      const res = await api.post(`/leads/${id}/reminders`, { time, note });
      return res.data;
    },
    onSuccess: (data) => {
      showToast('Follow-up reminder scheduled!', 'success');
      setReminderTime('');
      setReminderNote('');
      setSelectedLead(data.lead);
      queryClient.invalidateQueries({ queryKey: ['adminLeads'] });
    },
  });

  const handleOpenDetails = (lead: any) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateLeadMutation.mutate({ id: leadId, payload: { status: newStatus } });
  };

  const handleAssignChange = (leadId: string, execId: string) => {
    updateLeadMutation.mutate({ id: leadId, payload: { assignedTo: execId || null } });
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote || !selectedLead) return;
    addNoteMutation.mutate({ id: selectedLead._id, note: newNote });
  };

  const handleAddReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTime || !reminderNote || !selectedLead) return;
    addReminderMutation.mutate({ id: selectedLead._id, time: reminderTime, note: reminderNote });
  };

  // Compile calendar events from all reminders in the current leads feed
  const activeReminders = leads.flatMap((l: any) =>
    (l.reminders || []).map((r: any) => ({
      ...r,
      leadName: l.name,
      leadId: l._id,
    }))
  ).filter((r: any) => !r.isCompleted);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">CRM Pipeline</h1>
          <p className="text-sm text-slate-500">Track, schedule, and assign sales executive agents to potential leads.</p>
        </div>
      </div>

      {/* Pipeline Toolbar and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative">
          <Input placeholder="Search lead profile..." type="text" value={search} onChange={(e: any) => setSearch(e.target.value)} />
          <Search className="absolute right-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
        </div>

        <div className="space-y-1">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="site_visit">Site Visit Scheduled</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="follow_up">Follow Up</option>
          </select>
        </div>

        <div className="space-y-1">
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
            <option value="">All Executives</option>
            {executives.map((ex: any) => (
              <option key={ex._id} value={ex._id}>{ex.name} ({ex.role})</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="w-full" onClick={() => { setSearch(''); setStatus(''); setAssignedTo(''); }}>
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Pipeline Table (3 cols) */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <Spinner />
          ) : (
            <Card className="p-0 overflow-hidden">
              <Table headers={['Lead Profile', 'Assigned Executive', 'Funnels Status', 'Date Created', 'Actions']}>
                {leads.map((lead: any) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-primary-light/5 border-b border-slate-100 dark:border-slate-800/50 text-xs">
                    <td className="p-4">
                      <span className="font-serif font-bold text-slate-900 dark:text-white block">{lead.name}</span>
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{lead.email} &bull; {lead.phone || 'No phone'}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {lead.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="p-4">
                      <Badge variant={lead.status === 'won' ? 'success' : lead.status === 'lost' ? 'danger' : 'info'}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                       <Button size="sm" variant="outline" onClick={() => handleOpenDetails(lead)}>
                        CRM Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </Table>
            </Card>
          )}
        </div>

        {/* Right Side: Follow-up Reminders Calendar list (1 col) */}
        <div className="space-y-4">
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-accent" /> Follow-up Calendar
            </h3>
            {activeReminders.length === 0 ? (
              <p className="text-[10px] text-slate-400">No scheduled client follow-ups scheduled.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activeReminders.map((rem: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-primary-dark/25 rounded-xl border border-slate-200/50 dark:border-slate-800/80 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-accent block font-mono">
                      {new Date(rem.time).toLocaleDateString()} at {new Date(rem.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{rem.leadName}</span>
                    <p className="text-[10px] text-slate-400 italic">"{rem.note}"</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* CRM Details modal (Reminders, assignments, notes logs) */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Lead CRM Console" size="lg">
        {selectedLead && (
          <div className="space-y-6 text-xs text-slate-500">
            {/* Quick header controls (status and exec) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-primary-dark/25 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Pipeline Status</label>
                <select value={selectedLead.status} onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="site_visit">Site Visit Scheduled</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="follow_up">Follow Up</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Assign Executive</label>
                <select value={selectedLead.assignedTo?._id || ''} onChange={(e) => handleAssignChange(selectedLead._id, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
                  <option value="">Unassigned</option>
                  {executives.map((ex: any) => (
                    <option key={ex._id} value={ex._id}>{ex.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Middle Section: Notes logs stream and schedule reminder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Note Stream */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-accent" /> CRM Comments Logs
                </h4>
                <div className="space-y-3 max-h-56 overflow-y-auto">
                  {selectedLead.notesList?.map((note: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white dark:bg-primary-dark/15 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-400">{note.author} &bull; {new Date(note.createdAt).toLocaleString()}</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{note.note}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                  <input type="text" placeholder="Add custom log note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-primary-dark border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-accent" />
                  <Button type="submit" variant="accent" size="sm">Add</Button>
                </form>
              </div>

              {/* Schedule follow-up reminder */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent" /> Schedule Reminder
                </h4>

                <form onSubmit={handleAddReminderSubmit} className="space-y-3">
                  <Input type="datetime-local" required value={reminderTime} onChange={(e: any) => setReminderTime(e.target.value)} />
                  <Input placeholder="Reminder description..." type="text" required value={reminderNote} onChange={(e: any) => setReminderNote(e.target.value)} />
                  <Button type="submit" variant="accent" className="w-full flex items-center justify-center gap-1">
                    <Plus className="w-4 h-4" /> Schedule Call
                  </Button>
                </form>
              </div>
            </div>

            {/* Bottom Timeline auditing */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-accent" /> Activity Timeline
              </h4>
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 ml-2 space-y-3 max-h-40 overflow-y-auto">
                {selectedLead.timeline?.map((act: any, idx: number) => (
                  <div key={idx} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-accent" />
                    <span className="text-[9px] font-mono text-slate-400">{new Date(act.createdAt).toLocaleString()}</span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">{act.action}</h5>
                    {act.details && <p className="text-[10px] text-slate-400 italic">"{act.details}"</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
