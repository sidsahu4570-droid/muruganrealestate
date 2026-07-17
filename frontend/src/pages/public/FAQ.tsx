import React, { useState } from 'react';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: 'How does off-market access work?', a: 'Murugan Real Estate maintains relationships with family trust funds, corporate boards, and premium builders. Listings marked off-market are not published on search engines or open listings feeds; they are handled via private transactional brochures directly with vetted buyers.' },
    { q: 'Can international investors buy properties?', a: 'Yes. Our advisory handles all cross-border legal compliance filings, asset validation certificates, local bank coordination, and trust setups to ensure a smooth transaction for international portfolios.' },
    { q: 'What is the standard loan down payment?', a: 'For premium luxury estates, standard financial requirements mandate a down payment starting at 20%. Depending on financing structures or family office backing, this can go up to 40%.' },
    { q: 'How do you vet properties for listing?', a: 'Murugan Real Estate listings must pass structural, design, and pricing assessments. We verify location appreciation rates, quality metrics, and clear title parameters before portfolio inclusion.' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20 space-y-12">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about off-market purchases, financing requirements, and international buyer compliance."
      />

      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Q&A</span>
        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white font-serif">
          Common Inquiries
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Frequently asked real estate, compliance, and asset management questions.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <Card key={idx} className="p-0 overflow-hidden border border-slate-200/50 dark:border-slate-800/80">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all font-serif"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-accent" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-800/40">
                  {faq.a}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
