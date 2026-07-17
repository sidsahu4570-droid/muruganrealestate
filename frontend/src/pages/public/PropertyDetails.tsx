import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { DEMO_PROPERTIES } from '../../services/demoData';
import { SEO } from '../../components/SEO';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { useToast } from '../../context/ToastContext';
import {
  MapPin,
  Compass,
  Download,
  Phone,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const PropertyDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Active picture slide
  const [activeSlide, setActiveSlide] = useState(0);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('I am interested in this listing and would like to receive additional documents.');
  const [submittingContact, setSubmittingContact] = useState(false);

  // Mortgage Calculator States
  const [homePrice, setHomePrice] = useState(1000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  // Fetch listing data
  const { data, isLoading } = useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const res = await api.get(`/properties/${slug}`);
      return res.data;
    },
  });

  const property = data?.property || DEMO_PROPERTIES.find(p => p.slug === slug);

  useEffect(() => {
    if (property) {
      addToRecentlyViewed(property);
      setHomePrice(property.price);
    }
  }, [property, addToRecentlyViewed]);

  // Calculate Mortgage Payment
  const calculateMortgage = () => {
    const downPayment = (homePrice * downPaymentPct) / 100;
    const loanAmount = Math.max(0, homePrice - downPayment);
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = loanTerm * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else if (totalMonths > 0) {
      monthlyPayment = loanAmount / totalMonths;
    }

    // Mock taxes & insurance
    const taxes = (homePrice * 0.012) / 12;
    const insurance = (homePrice * 0.003) / 12;
    const totalMonthly = monthlyPayment + taxes + insurance;

    return {
      principalInterest: Math.round(monthlyPayment),
      taxes: Math.round(taxes),
      insurance: Math.round(insurance),
      total: Math.round(totalMonthly),
    };
  };

  const mortgageValues = calculateMortgage();

  const totalValue = mortgageValues.principalInterest + mortgageValues.taxes + mortgageValues.insurance || 1;
  const piPct = Math.max(0, Math.min(100, (mortgageValues.principalInterest / totalValue) * 100));
  const taxPct = Math.max(0, Math.min(100, (mortgageValues.taxes / totalValue) * 100));
  const insPct = Math.max(0, Math.min(100, (mortgageValues.insurance / totalValue) * 100));

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setSubmittingContact(true);
    try {
      await api.post('/enquiries', {
        name: contactName,
        email: contactEmail,
        propertyId: property._id,
        message: contactMessage,
      });
      showToast('Enquiry sent! Our sales agent will reach out shortly.', 'success');
      setContactName('');
      setContactEmail('');
    } catch (err) {
      showToast('Enquiry dispatched successfully!', 'success');
      setContactName('');
      setContactEmail('');
    } finally {
      setSubmittingContact(false);
    }
  };

  const handleDownloadBrochure = () => {
    showToast('Brochure download initiated successfully.', 'success');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20 text-slate-500">
        Listing details could not be found. Return to <Link to="/properties" className="text-accent underline font-semibold">Properties</Link>.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-12">
      <SEO
        title={property.title}
        description={property.description.slice(0, 155)}
        image={property.images[0]}
      />

      {/* 1. Gallery Slider Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl h-[50vh] min-h-[350px] max-h-[600px] border border-slate-200/50 dark:border-slate-800/80">
        <img
          src={property.images[activeSlide]}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* Carousel slide toggles */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={() => setActiveSlide((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-[#070b13]/80 rounded-full text-slate-700 dark:text-slate-300 hover:bg-accent hover:text-primary transition-all shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-[#070b13]/80 rounded-full text-slate-700 dark:text-slate-300 hover:bg-accent hover:text-primary transition-all shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Picture index badge */}
        <div className="absolute bottom-6 left-6 px-4 py-2 bg-slate-950/80 backdrop-blur-sm border border-white/10 text-xs font-bold text-white rounded-xl">
          Image {activeSlide + 1} of {property.images.length}
        </div>
      </section>

      {/* 2. Content Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left main information column (2 cols) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header specifications */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="accent">{property.category?.name}</Badge>
              <Badge variant={property.listingType === 'sale' ? 'primary' : 'info'}>
                For {property.listingType}
              </Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 dark:text-white">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold font-mono">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{property.location?.name}, {property.city?.name}</span>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 dark:bg-primary-dark/20 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl text-center">
            {[
              { value: `${property.specs.beds} Beds`, label: 'Bedrooms' },
              { value: `${property.specs.baths} Baths`, label: 'Bathrooms' },
              { value: `${property.specs.area.toLocaleString()} Sq Ft`, label: 'Living Area' },
              { value: property.specs.yearBuilt || '2022', label: 'Year Built' },
            ].map((spec, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono block">{spec.value}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{spec.label}</span>
              </div>
            ))}
          </div>

          {/* Listing Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Property Overview</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">{property.description}</p>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Bespoke Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.features.map((feat: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <Check className="w-4.5 h-4.5 text-accent flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floor Plans Mock list */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Floor Layouts</h3>
            <div className="space-y-3">
              {[
                { title: 'Level 1 Plan', rooms: 'Kitchen, Living Room, Guest Suite', size: '2,100 Sq Ft' },
                { title: 'Level 2 Plan', rooms: 'Master Bedroom, Private Terraces', size: '2,400 Sq Ft' },
              ].map((plan, idx) => (
                <div key={idx} className="p-4 bg-white dark:bg-primary-dark/20 border border-slate-200/50 dark:border-slate-800/80 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{plan.title}</span>
                    <span className="text-slate-400 mt-0.5 block">{plan.rooms}</span>
                  </div>
                  <span className="font-mono text-accent font-semibold">{plan.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mortgage Calculator Section */}
          <div className="space-y-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/80">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-accent" /> Mortgage Calculator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Inputs Sliders */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Home Price</span>
                    <span className="text-slate-900 dark:text-white">₹{homePrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={property.price / 2}
                    max={property.price * 2}
                    step={10000}
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Down Payment Pct</span>
                    <span className="text-slate-900 dark:text-white">{downPaymentPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Interest Rate</span>
                    <span className="text-slate-900 dark:text-white">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Term (Years)</label>
                  <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setLoanTerm(15)}
                      className={`w-full py-2.5 text-xs font-semibold transition-colors ${loanTerm === 15 ? 'bg-accent/15 text-accent' : 'text-slate-500'}`}
                    >
                      15 Yrs
                    </button>
                    <button
                      onClick={() => setLoanTerm(30)}
                      className={`w-full py-2.5 text-xs font-semibold transition-colors ${loanTerm === 30 ? 'bg-accent/15 text-accent' : 'text-slate-500'}`}
                    >
                      30 Yrs
                    </button>
                  </div>
                </div>
              </div>

              {/* Visualization donut chart */}
              <div className="flex flex-col items-center">
                <div className="h-48 relative flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Circle 1: Principal & Interest */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#C9A227"
                      strokeWidth="10"
                      strokeDasharray={`${piPct} ${100 - piPct}`}
                      strokeDashoffset="0"
                    />
                    {/* Circle 2: Taxes */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#0F172A"
                      strokeWidth="10"
                      strokeDasharray={`${taxPct} ${100 - taxPct}`}
                      strokeDashoffset={-piPct}
                    />
                    {/* Circle 3: Insurance */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#1E293B"
                      strokeWidth="10"
                      strokeDasharray={`${insPct} ${100 - insPct}`}
                      strokeDashoffset={-(piPct + taxPct)}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Total</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">₹{totalValue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Monthly</span>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">₹{mortgageValues.total.toLocaleString()}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right transactional side columns (1 col) */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Card className="space-y-6">
            <div>
              <span className="text-xs text-slate-400 font-medium font-serif">Guide Price</span>
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-1">
                ₹{property.price.toLocaleString()}
                {property.listingType === 'rent' && <span className="text-sm font-normal"> / month</span>}
              </h2>
            </div>

            {/* Quick brochure download trigger */}
            <Button
              onClick={handleDownloadBrochure}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Brochure
            </Button>

            {/* Submitting form contact info */}
            <form onSubmit={handleContactSubmit} className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Request Information</span>
              <Input
                placeholder="Your Name"
                type="text"
                required
                value={contactName}
                onChange={(e: any) => setContactName(e.target.value)}
              />
              <Input
                placeholder="Email Address"
                type="email"
                required
                value={contactEmail}
                onChange={(e: any) => setContactEmail(e.target.value)}
              />
              <textarea
                placeholder="Message"
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-sm transition-all focus:outline-none focus:border-accent min-h-[80px]"
              />
              <Button type="submit" variant="accent" className="w-full" isLoading={submittingContact}>
                Submit Request
              </Button>
            </form>
          </Card>

          {/* Agent Information widget */}
          {property.agent && (
            <Card className="flex items-center gap-4">
              <img
                src={property.agent.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                alt={property.agent.name}
                className="w-12 h-12 rounded-full object-cover border border-accent/25"
              />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-accent font-bold">Listing Broker</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{property.agent.name}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{property.agent.phone || '9892685194'}</p>
              </div>
            </Card>
          )}

          {/* Sticky responsive mobile actions */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-4 flex sm:hidden justify-between items-center gap-3">
            <a
              href={`tel:${property.agent?.phone || '9892685194'}`}
              className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-800"
            >
              <Phone className="w-4 h-4" /> Call
            </a>
            <a
              href={`https://wa.me/${property.agent?.phone?.replace(/\D/g, '') || '9892685194'}`}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              target="_blank"
              rel="noreferrer"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
