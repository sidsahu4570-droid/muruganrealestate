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
import { PlusCircle, Edit2, Trash2, FileText } from 'lucide-react';

export const BlogsMock: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Selected item and modal controls
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('published');
  const [tags, setTags] = useState('');

  // Fetch blogs
  const { data, isLoading } = useQuery({
    queryKey: ['adminBlogs'],
    queryFn: async () => {
      const res = await api.get('/blogs?adminView=true');
      return res.data;
    },
  });

  const blogs = data?.blogs || [];

  // Mutate create
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/blogs', payload);
      return res.data;
    },
    onSuccess: () => {
      showToast('Article published successfully!', 'success');
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
    },
    onError: () => showToast('Failed to publish article.', 'error'),
  });

  // Mutate update
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await api.put(`/blogs/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      showToast('Article updated successfully!', 'success');
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
    },
    onError: () => showToast('Failed to update article.', 'error'),
  });

  // Mutate delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/blogs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      showToast('Article deleted successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
    },
    onError: () => showToast('Failed to delete article.', 'error'),
  });

  const handleOpenAddForm = () => {
    setIsEditMode(false);
    setSelectedBlog(null);
    setTitle('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80');
    setStatus('published');
    setTags('Finance, Investment');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (blog: any) => {
    setIsEditMode(true);
    setSelectedBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setCoverImage(blog.coverImage || '');
    setStatus(blog.status);
    setTags(blog.tags?.join(', ') || '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      content,
      coverImage,
      status,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (isEditMode && selectedBlog) {
      updateMutation.mutate({ id: selectedBlog._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Estates Journal Registry</h1>
          <p className="text-sm text-slate-500">Create articles, edit analysis papers, or manage drafts.</p>
        </div>
        <Button variant="accent" onClick={handleOpenAddForm} className="flex items-center gap-1 shadow-goldGlow">
          <PlusCircle className="w-4.5 h-4.5" /> Write Article
        </Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={['Cover Preview', 'Article Title', 'Publish Status', 'Date Created', 'Actions']}>
            {blogs.map((blog: any) => (
              <tr key={blog._id} className="hover:bg-slate-50/50 dark:hover:bg-primary-light/5 border-b border-slate-100 dark:border-slate-800/50 text-xs">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img src={blog.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=100&q=80'} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-serif font-bold text-slate-900 dark:text-white">
                  {blog.title}
                  <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{blog.tags?.join(', ')}</span>
                </td>
                <td className="p-4">
                  <Badge variant={blog.status === 'published' ? 'success' : 'warning'}>
                    {blog.status}
                  </Badge>
                </td>
                <td className="p-4 text-slate-500 font-mono">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenEditForm(blog)} className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-accent hover:border-accent/40" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (confirm('Delete this article permanently?')) deleteMutation.mutate(blog._id); }} className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-red-500 hover:border-red-500/30" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={isEditMode ? 'Edit Article' : 'Compose Article'} size="lg">
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <Input label="Article Title" type="text" required value={title} onChange={(e: any) => setTitle(e.target.value)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Cover Image URL" type="text" value={coverImage} onChange={(e: any) => setCoverImage(e.target.value)} />
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <Input label="Tags (comma-separated list)" type="text" placeholder="Finance, Investment, Market" value={tags} onChange={(e: any) => setTags(e.target.value)} />

          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <FileText className="w-4 h-4 text-accent" /> Article Content
            </label>
            <textarea value={content} required onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent min-h-[220px]" />
          </div>

          <Button type="submit" variant="accent" className="w-full" isLoading={createMutation.isPending || updateMutation.isPending}>
            {isEditMode ? 'Save Changes' : 'Publish Article'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
