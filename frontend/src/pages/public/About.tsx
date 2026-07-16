import React from 'react';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import { Award, ShieldCheck, Users2, Landmark } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 lg:space-y-24 py-12 lg:py-20 px-6">
      <SEO
        title="About Our Agency"
        description="Learn about Aurelia Luxury Estates, our core principles, global agent networks, and award-winning transactions advisory history."
      />

      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Our Story</span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white">
          A Legacy of Bespoke Real Estate
        </h1>
        <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
          Since 1998, Aurelia has served as a trusted partner to elite investors, families, and developers in securing their high-value portfolios.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] border border-slate-200/50 dark:border-slate-800/80">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            alt="Estate House"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6 text-sm text-slate-500 leading-relaxed">
          <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Our Founding Principles</h3>
          <p>
            Aurelia was built on a single premise: real estate is not a transaction; it is an inheritance. We understand that luxury estates are physical expressions of security and heritage. That is why our agents combine financial modeling with absolute discretion.
          </p>
          <p>
            Whether acquiring a coastal villa in Miami, an Upper East Side duplex in Manhattan, or a commercial development hub in Silicon Valley, our clients receive white-glove advisory from initiation through title registration.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Core Values</span>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white font-serif">What Governs Our Decisions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Absolute Discretion', desc: 'Protecting transaction data and client profiles at all costs.', icon: <ShieldCheck className="w-6 h-6 text-accent" /> },
            { title: 'Bespoke Quality', desc: 'Vetting every listing to match our gold standard guidelines.', icon: <Award className="w-6 h-6 text-accent" /> },
            { title: 'Fiduciary Duty', desc: 'Guiding investment purchases with modeling analytics.', icon: <Landmark className="w-6 h-6 text-accent" /> },
            { title: 'Global Network', desc: 'Connecting domestic offices with international buyers.', icon: <Users2 className="w-6 h-6 text-accent" /> },
          ].map((val, idx) => (
            <Card key={idx} className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/25">
                {val.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{val.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
