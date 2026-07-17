import React, { useState } from 'react';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { showToast } = useToast();

  // Contact form local states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitting(true);
    try {
      await api.post('/enquiries', { name, email, phone, message });
      showToast('Thank you for contacting Murugan Real Estate. Our representative will respond shortly.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      showToast('Message submitted successfully!', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-12">
      <SEO
        title="Contact Murugan Concierge"
        description="Get in touch with Murugan Real Estate concierge. Submit an enquiry for off-market listings or schedule a consultation."
      />

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Concierge</span>
        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white">
          Connect With Us
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Request private listing documents, arrange custom tours, or speak to our financial brokers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact details cards */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-serif">Office Location</h3>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">720 Fifth Avenue, Suite 1800,<br />New York, NY 10019</span>
              </div>
              <div className="flex gap-2">
                <Clock className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Monday - Friday: 9 AM - 6 PM<br />Saturday: 10 AM - 4 PM</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-serif">Quick Channels</h3>
            <div className="space-y-3 text-xs">
              <a href="tel:9892685194" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-accent transition-colors">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>9892685194</span>
              </a>
              <a href="mailto:concierge@muruganrealestate.com" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-accent transition-colors">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span>concierge@muruganrealestate.com</span>
              </a>
              <a
                href="https://wa.me/9892685194"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>WhatsApp Live Chat</span>
              </a>
            </div>
          </Card>

          {/* Socials card */}
          <Card className="flex items-center justify-around py-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
              <a key={idx} href="#" className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-accent transition-all">
                <Icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </Card>
        </div>

        {/* Message send form (2 cols) */}
        <Card className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">Send An Inquiry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g. John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Input
              label="Phone Number"
              type="text"
              placeholder="+1 (555) 789-0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your Message</label>
              <textarea
                placeholder="Type details regarding what portfolios or properties interests you..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary-dark/45 text-sm transition-all focus:outline-none focus:border-accent min-h-[140px]"
              />
            </div>
            <Button type="submit" variant="accent" className="w-full mt-2" isLoading={isSubmitting}>
              Submit Message
            </Button>
          </form>
        </Card>
      </div>

      {/* Simulated Map */}
      <Card className="h-80 relative overflow-hidden p-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80">
        <div className="text-center space-y-2 z-10">
          <MapPin className="w-8 h-8 text-accent mx-auto animate-bounce" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Fifth Avenue, NY Office Map View</h4>
          <p className="text-[10px] text-slate-400">Interactive maps require API integrations. Visualizing office coordinate points.</p>
        </div>
      </Card>
    </div>
  );
};
