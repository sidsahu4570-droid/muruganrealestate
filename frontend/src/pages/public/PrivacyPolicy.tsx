import React from 'react';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20 space-y-8">
      <SEO
        title="Privacy Policy"
        description="Learn how Aurelia Luxury Estates protects client transaction metadata and private financial files."
      />
      <div>
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">Last Updated: July 16, 2026</p>
      </div>

      <Card className="text-xs text-slate-500 leading-relaxed space-y-4 font-sans">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white font-serif">1. Information We Collect</h3>
        <p>
          Aurelia curates premium real estate transactions. In organizing purchase/rent advisory, we collect names, emails, contact numbers, and optional assets files to perform security checks and model portfolios.
        </p>

        <h3 className="text-sm font-semibold text-slate-800 dark:text-white font-serif">2. Confidentiality</h3>
        <p>
          We do not sell, exchange, or lease client details. Off-market transaction data is restricted strictly to qualified escrow entities and closing agents in compliance with state regulations.
        </p>

        <h3 className="text-sm font-semibold text-slate-800 dark:text-white font-serif">3. Security Systems</h3>
        <p>
          Aurelia employs TLS encryption, password hashing, and tokenized APIs to safeguard credential keys and prevent database security intrusions.
        </p>
      </Card>
    </div>
  );
};
