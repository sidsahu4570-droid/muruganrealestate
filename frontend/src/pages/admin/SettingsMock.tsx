import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { Settings, Globe, Mail, ShieldAlert } from 'lucide-react';

export const SettingsMock: React.FC = () => {
  const { showToast } = useToast();

  // Tab state
  const [activeTab, setActiveTab] = useState<'general' | 'smtp' | 'socials'>('general');

  // Fields states
  const [siteName, setSiteName] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [favicon, setFavicon] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [googleAnalytics, setGoogleAnalytics] = useState('');
  const [googleTagManager, setGoogleTagManager] = useState('');

  // Socials
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // SMTP Settings
  const [host, setHost] = useState('');
  const [port, setPort] = useState(2525);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [from, setFrom] = useState('');

  // Fetch settings
  const { data, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      return res.data;
    },
  });

  const settings = data?.settings;

  useEffect(() => {
    setSiteName(settings?.siteName || 'Murugan Real Estate');
    setSiteLogo(settings?.siteLogo || '');
    setFavicon(settings?.favicon || '');
    setContactEmail(settings?.contactEmail || 'concierge@muruganrealestate.com');
    setContactPhone(settings?.contactPhone || '9892685194');
    setWhatsappNumber(settings?.whatsappNumber || '9892685194');
    setGoogleAnalytics(settings?.googleAnalytics || '');
    setGoogleTagManager(settings?.googleTagManager || '');

    setFacebook(settings?.socialLinks?.facebook || 'https://facebook.com/muruganrealestate');
    setTwitter(settings?.socialLinks?.twitter || 'https://twitter.com/muruganrealestate');
    setInstagram(settings?.socialLinks?.instagram || 'https://instagram.com/muruganrealestate');
    setLinkedin(settings?.socialLinks?.linkedin || 'https://linkedin.com/company/muruganrealestate');

    setHost(settings?.emailSettings?.host || '');
    setPort(settings?.emailSettings?.port || 2525);
    setUser(settings?.emailSettings?.user || '');
    setPass(settings?.emailSettings?.pass || '');
    setFrom(settings?.emailSettings?.from || 'noreply@muruganrealestate.com');
  }, [settings]);

  // Mutation to update settings
  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.put('/settings', payload);
      return res.data;
    },
    onSuccess: () => {
      showToast('Global settings updated successfully!', 'success');
    },
    onError: () => showToast('Failed to save settings configurations.', 'error'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      siteName,
      siteLogo,
      favicon,
      contactEmail,
      contactPhone,
      whatsappNumber,
      googleAnalytics,
      googleTagManager,
      socialLinks: { facebook, twitter, instagram, linkedin },
      emailSettings: { host, port, user, pass, from },
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Settings Management</h1>
          <p className="text-sm text-slate-500">Configure global metadata tags, search script tracking, logo assets, and SMTP profiles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Tabs (1 col) */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'general', label: 'Company Profile', icon: <Settings className="w-4 h-4" /> },
            { id: 'smtp', label: 'SMTP Configurations', icon: <Mail className="w-4 h-4" /> },
            { id: 'socials', label: 'Social links & Tags', icon: <Globe className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                activeTab === tab.id
                  ? 'bg-accent/15 border-accent text-accent shadow-sm'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Form Panel (3 cols) */}
        <Card className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Site Name" type="text" required value={siteName} onChange={(e: any) => setSiteName(e.target.value)} />
                  <Input label="Corporate Contact Email" type="email" value={contactEmail} onChange={(e: any) => setContactEmail(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Office Phone" type="text" value={contactPhone} onChange={(e: any) => setContactPhone(e.target.value)} />
                  <Input label="WhatsApp Line" type="text" placeholder="9892685194" value={whatsappNumber} onChange={(e: any) => setWhatsappNumber(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Site Logo URL" type="text" value={siteLogo} onChange={(e: any) => setSiteLogo(e.target.value)} />
                  <Input label="Favicon Assets URL" type="text" value={favicon} onChange={(e: any) => setFavicon(e.target.value)} />
                </div>
              </div>
            )}

            {/* SMTP Tab */}
            {activeTab === 'smtp' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white">Mail Server (SMTP)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Host Name" type="text" placeholder="smtp.mailtrap.io" value={host} onChange={(e: any) => setHost(e.target.value)} />
                  <Input label="Port Number" type="number" value={port} onChange={(e: any) => setPort(Number(e.target.value))} />
                  <Input label="Sender Email Address" type="text" placeholder="noreply@muruganrealestate.com" value={from} onChange={(e: any) => setFrom(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="User Name" type="text" value={user} onChange={(e: any) => setUser(e.target.value)} />
                  <Input label="Authentication Pass" type="password" value={pass} onChange={(e: any) => setPass(e.target.value)} />
                </div>
              </div>
            )}

            {/* Socials Tab */}
            {activeTab === 'socials' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Facebook Address" type="text" value={facebook} onChange={(e: any) => setFacebook(e.target.value)} />
                  <Input label="Twitter handle" type="text" value={twitter} onChange={(e: any) => setTwitter(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Instagram Profile" type="text" value={instagram} onChange={(e: any) => setInstagram(e.target.value)} />
                  <Input label="LinkedIn Company" type="text" value={linkedin} onChange={(e: any) => setLinkedin(e.target.value)} />
                </div>

                <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-800">Analytics script integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Google Analytics Tag ID" type="text" placeholder="G-XXXXXXXX" value={googleAnalytics} onChange={(e: any) => setGoogleAnalytics(e.target.value)} />
                  <Input label="GTM Tag Manager Code" type="text" placeholder="GTM-XXXXXXX" value={googleTagManager} onChange={(e: any) => setGoogleTagManager(e.target.value)} />
                </div>
              </div>
            )}

            <Button type="submit" variant="accent" className="w-full mt-4 flex items-center justify-center gap-1.5 shadow-goldGlow" isLoading={updateMutation.isPending}>
              <ShieldAlert className="w-4 h-4" /> Save Settings Configuration
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
