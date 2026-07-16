import React, { useState } from 'react';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    { title: 'Manhattan Penthouse View', category: 'penthouse', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
    { title: 'Beverly Hills Canyon Pool', category: 'villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
    { title: 'Waterfront Sunset Yacht Slip', category: 'villa', url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80' },
    { title: 'Contemporary Master Suite', category: 'interiors', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80' },
    { title: 'Tribeca High Loft Kitchen', category: 'interiors', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80' },
  ];

  const filtered = activeCategory === 'all' ? images : images.filter((img) => img.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-12">
      <SEO
        title="Luxury Estates Gallery"
        description="Browse high-resolution photographs of Beverly Hills canyon pools, Manhattan skylines, and bespoke master suites."
      />

      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Visual Portfolio</span>
        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white">
          Aurelia Image Gallery
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Step inside our curated collection of architectural designs, luxury pool decks, and bespoke interiors.
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {['all', 'villa', 'penthouse', 'interiors'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              activeCategory === cat
                ? 'bg-accent border-accent text-primary shadow-goldGlow'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((img, idx) => (
          <Card
            key={idx}
            onClick={() => setSelectedImage(img.url)}
            hoverEffect
            className="p-0 overflow-hidden relative cursor-pointer group h-80"
          >
            <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span className="text-white text-sm font-serif font-semibold">{img.title}</span>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="Gallery Preview">
        {selectedImage && (
          <div className="rounded-xl overflow-hidden max-h-[70vh]">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />
          </div>
        )}
      </Modal>
    </div>
  );
};
