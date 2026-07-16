import React from 'react';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import { MapPin } from 'lucide-react';

export const Projects: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-12">
      <SEO
        title="Premium Developments"
        description="Browse Aurelia residential compounds, luxury societies, and commercial penthouses developments projects."
      />

      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Developments</span>
        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white">
          Aurelia Elite Societies
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Bespoke high-altitude residential compounds and skyscraper towers built to define modern architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: 'Aurelia Residences',
            location: 'Beverly Hills Ridge, CA',
            desc: 'A gated society of 12 luxury modern villas featuring infinite private canyons pools, structural marble columns, and dedicated concierge teams.',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          },
          {
            title: 'The Royal Sands Penthouse Tower',
            location: 'Ocean Drive Corridor, Miami',
            desc: 'A 42-story oceanfront skyscraper displaying double-height glass panels, structural yacht slips, private beach cabanas, and indoor helipad access.',
            image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
          },
        ].map((proj, idx) => (
          <Card key={idx} hoverEffect className="p-0 overflow-hidden flex flex-col h-full">
            <div className="h-64 relative overflow-hidden">
              <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-accent font-semibold font-mono">
                  <MapPin className="w-4 h-4" />
                  <span>{proj.location}</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white font-serif">{proj.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{proj.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
