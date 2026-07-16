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
  PlusCircle,
  Copy,
  Edit2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

export const PropertiesMock: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Selected item and form modal states
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form Fields states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(100000);
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState('sale');
  const [status, setStatus] = useState('available');
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(2);
  const [area, setArea] = useState(1500);
  const [features, setFeatures] = useState('');
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);

  // Retrieve properties
  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['adminProperties'],
    queryFn: async () => {
      const res = await api.get('/properties?adminView=true&limit=50');
      return res.data;
    },
  });

  const properties = propertiesData?.properties || [];

  // Extract unique categories, cities, locations for form dropdowns
  const categories = Array.from(new Map(properties.map((p: any) => p.category ? [p.category._id, p.category] : null).filter(Boolean) as any).values()) as any[];
  const cities = Array.from(new Map(properties.map((p: any) => p.city ? [p.city._id, p.city] : null).filter(Boolean) as any).values()) as any[];
  const locations = Array.from(new Map(properties.map((p: any) => p.location ? [p.location._id, p.location] : null).filter(Boolean) as any).values()) as any[];

  // Mutate create property
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/properties', payload);
      return res.data;
    },
    onSuccess: () => {
      showToast('Property created successfully!', 'success');
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
    },
    onError: () => showToast('Failed to create property.', 'error'),
  });

  // Mutate update property
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await api.put(`/properties/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      showToast('Property updated successfully!', 'success');
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
    },
    onError: () => showToast('Failed to update property.', 'error'),
  });

  // Mutate delete property
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/properties/${id}`);
      return res.data;
    },
    onSuccess: () => {
      showToast('Property deleted successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
    },
    onError: () => showToast('Failed to delete property.', 'error'),
  });

  // Mutate duplicate property
  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/properties/${id}/duplicate`);
      return res.data;
    },
    onSuccess: () => {
      showToast('Property duplicated successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
    },
    onError: () => showToast('Failed to duplicate property.', 'error'),
  });

  const handleOpenAddForm = () => {
    setIsEditMode(false);
    setSelectedProperty(null);
    setTitle('');
    setPrice(100000);
    setDescription('');
    setListingType('sale');
    setStatus('available');
    setBeds(2);
    setBaths(2);
    setArea(1500);
    setFeatures('');
    setImagesList([]);
    // Assign defaults from extracted list
    setCategory(categories[0]?._id || '');
    setCity(cities[0]?._id || '');
    setLocation(locations[0]?._id || '');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prop: any) => {
    setIsEditMode(true);
    setSelectedProperty(prop);
    setTitle(prop.title);
    setPrice(prop.price);
    setDescription(prop.description);
    setListingType(prop.listingType);
    setStatus(prop.status);
    setBeds(prop.specs.beds || 2);
    setBaths(prop.specs.baths || 2);
    setArea(prop.specs.area || 1500);
    setFeatures(prop.features?.join(', ') || '');
    setImagesList(prop.images || []);
    setCategory(prop.category?._id || '');
    setCity(prop.city?._id || '');
    setLocation(prop.location?._id || '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      price,
      description,
      listingType,
      status,
      category,
      city,
      location,
      images: imagesList.length ? imagesList : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
      features: features.split(',').map((f) => f.trim()).filter(Boolean),
      specs: { beds, baths, area, yearBuilt: 2022 },
    };

    if (isEditMode && selectedProperty) {
      updateMutation.mutate({ id: selectedProperty._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const filesArray = Array.from(e.target.files);
    const formData = new FormData();
    filesArray.forEach((file) => formData.append('files', file));

    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImagesList((prev) => [...prev, ...res.data.urls]);
      showToast('Media uploaded to Cloudinary successfully!', 'success');
    } catch (err) {
      // Fallback preview placeholders if config settings are skipped
      showToast('Cloudinary bypassed. Creating random mock image placeholder.', 'info');
      setImagesList((prev) => [
        ...prev,
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesList((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Properties Registry</h1>
          <p className="text-sm text-slate-500">Edit features, upload plans, change listing statuses, or duplicate estates.</p>
        </div>
        <Button variant="accent" onClick={handleOpenAddForm} className="flex items-center gap-1 shadow-goldGlow">
          <PlusCircle className="w-4.5 h-4.5" /> Add Property
        </Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={['Preview', 'Property Title', 'Pricing', 'City / Category', 'Status', 'Actions']}>
            {properties.map((prop: any) => (
              <tr key={prop._id} className="hover:bg-slate-50/50 dark:hover:bg-primary-light/5 border-b border-slate-100 dark:border-slate-800/50 text-xs">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80'} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-serif font-bold text-slate-900 dark:text-white">
                  {prop.title}
                  <span className="text-[10px] text-slate-400 block font-normal mt-0.5 capitalize">For {prop.listingType} &bull; {prop.specs?.area} Sq Ft</span>
                </td>
                <td className="p-4 font-mono font-semibold text-accent">${prop.price.toLocaleString()}</td>
                <td className="p-4 text-slate-500 font-mono">
                  {prop.city?.name || 'New York'} / {prop.category?.name || 'Villa'}
                </td>
                <td className="p-4">
                  <Badge variant={prop.status === 'available' ? 'success' : prop.status === 'sold' ? 'danger' : 'warning'}>
                    {prop.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenEditForm(prop)} className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-accent hover:border-accent/40" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => duplicateMutation.mutate(prop._id)} className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-accent hover:border-accent/40" title="Duplicate">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (confirm('Delete this listing permanently?')) deleteMutation.mutate(prop._id); }} className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-red-500 hover:border-red-500/30" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Add / Edit Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={isEditMode ? 'Modify Listing' : 'Publish New Listing'} size="lg">
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Listing Title" type="text" required value={title} onChange={(e: any) => setTitle(e.target.value)} />
            <Input label="Pricing ($)" type="number" required value={price} onChange={(e: any) => setPrice(Number(e.target.value))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Listing Type</label>
              <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Property Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="upcoming">Upcoming</option>
                <option value="featured">Featured</option>
                <option value="premium">Premium</option>
                <option value="trending">Trending</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Location Zone</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent">
                {locations.map((l) => (
                  <option key={l._id} value={l._id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Bedrooms" type="number" value={beds} onChange={(e: any) => setBeds(Number(e.target.value))} />
            <Input label="Bathrooms" type="number" value={baths} onChange={(e: any) => setBaths(Number(e.target.value))} />
            <Input label="Area (Sq Ft)" type="number" value={area} onChange={(e: any) => setArea(Number(e.target.value))} />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Listing Description</label>
            <textarea value={description} required onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-xs focus:outline-none focus:border-accent min-h-[80px]" />
          </div>

          <Input label="Bespoke Features (comma-separated list)" type="text" placeholder="Wine Cellar, private lift" value={features} onChange={(e: any) => setFeatures(e.target.value)} />

          {/* Multiple Cloudinary Media uploads dropzone */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Media & Blueprints</label>

            {/* Images layout preview */}
            {imagesList.length > 0 && (
              <div className="flex flex-wrap gap-3 pb-2">
                {imagesList.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-accent transition-all cursor-pointer">
              <input type="file" multiple accept="image/*" onChange={handleMediaUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="w-6 h-6 text-slate-400 animate-bounce" />
              <span className="text-[11px] font-bold text-slate-500 mt-2 block">
                {uploading ? 'Streaming to Cloudinary...' : 'Drag & drop image files, or browse local folders'}
              </span>
            </div>
          </div>

          <Button type="submit" variant="accent" className="w-full" isLoading={createMutation.isPending || updateMutation.isPending}>
            {isEditMode ? 'Update Listing' : 'Publish Listing'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
