import React from 'react';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20 space-y-8">
      <SEO
        title="Terms of Service"
        description="Review licensing requirements, listing accuracies disclosures, and transaction terms at Murugan Real Estate."
      />
      <div>
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">Last Updated: July 16, 2026</p>
      </div>

      <Card className="text-xs text-slate-500 leading-relaxed space-y-4 font-sans">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white font-serif">1. Listing Accuracies</h3>
        <p>
          Murugan Real Estate curates luxury real estates. While we perform validation inspections, specifications such as square footage, boundary lines, and amenities locations must be independently verified by buyer inspections before escrow closure.
        </p>

        <h3 className="text-sm font-semibold text-slate-800 dark:text-white font-serif">2. Permitted Use</h3>
        <p>
          Listing brochures, blueprints, and media assets provided by our concierge are protected under commercial copyright. Redistribution or scraping of database listings without written authorization is prohibited.
        </p>

        <h3 className="text-sm font-semibold text-slate-800 dark:text-white font-serif">3. Advisory Disclaimers</h3>
        <p>
          Material listed on this platform is for advisory purposes. Murugan Real Estate is not a direct lender, tax planner, or securities adviser.
        </p>
      </Card>
    </div>
  );
};
