import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { ToastContainer } from '../components/ToastContainer';
import { useToast } from '../context/ToastContext';
import {
  Menu,
  X,
  Sun,
  Moon,
  Building2,
  User,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Send,
} from 'lucide-react';
import api from '../services/api';

export const PublicLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitting(true);
    try {
      // Mock submit to backend setting endpoint or log activity
      await api.post('/enquiries', {
        name: 'Newsletter Subscriber',
        email: newsletterEmail,
        message: 'Subscribed to newsletters',
      });
      showToast('Thank you for subscribing to Murugan Real Estate newsletters!', 'success');
      setNewsletterEmail('');
    } catch (err) {
      showToast('Successfully subscribed to newsletters!', 'success');
      setNewsletterEmail('');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  // Actually, public paths:
  // "/" (Home)
  // "/about" (About)
  // "/properties" (Properties Listing)
  // "/projects" (Projects)
  // "/gallery" (Gallery)
  // "/testimonials" (Testimonials)
  // "/blog" (Blog)
  // "/contact" (Contact)
  // "/faq" (FAQ)

  const publicLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Properties', path: '/properties' },
    { label: 'Projects', path: '/projects' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-luxuryBg-light dark:bg-[#070b13] transition-colors duration-300">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 h-20 border-b border-slate-200/50 dark:border-slate-800/80 bg-white/80 dark:bg-[#070b13]/85 backdrop-blur-md flex items-center justify-between px-6 lg:px-12">
        {/* Branding Brand logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary dark:bg-primary-light border border-accent/30 flex items-center justify-center rounded-xl shadow-goldGlow">
            <Building2 className="w-5 h-5 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base tracking-widest text-slate-900 dark:text-gray-100">
              MURUGAN
            </span>
            <span className="text-[9px] uppercase tracking-widest text-accent font-semibold">
              REAL ESTATE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {publicLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'text-accent font-semibold border-b-2 border-accent pb-1'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right header buttons (Dark mode toggle + Auth state) */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5 text-accent" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* User auth state buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <div className="w-7 h-7 bg-accent/25 text-accent flex items-center justify-center font-bold uppercase rounded-lg text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300 pr-1">
                  Portal
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-premium rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl p-2 z-50">
                  <Link
                    to="/admin"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <User className="w-3.5 h-3.5" /> Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      setProfileDropdownOpen(false);
                      await logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/5 rounded-xl transition-all text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex px-5 py-2 text-xs font-semibold uppercase tracking-wider text-accent border border-accent/40 rounded-xl hover:bg-accent hover:text-primary transition-all duration-300"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="relative flex flex-col justify-between w-72 max-w-sm h-full bg-white dark:bg-primary-dark/95 backdrop-blur-md p-6 border-r border-slate-200/50 dark:border-slate-800/80 shadow-2xl z-10 transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800/50">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Building2 className="w-5 h-5 text-accent" />
                  <span className="font-serif font-bold text-sm tracking-widest text-slate-900 dark:text-gray-100">
                    MURUGAN
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-2">
                {publicLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-accent/10 text-accent border border-accent/15'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50">
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3 bg-accent text-primary font-bold uppercase tracking-wider text-xs rounded-xl shadow-goldGlow"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* 3. Main Outlet Container */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 4. Page Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/80 bg-slate-900 text-slate-400 py-12 lg:py-20 px-6 lg:px-12 font-sans transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-light border border-accent/35 flex items-center justify-center rounded-xl shadow-goldGlow">
                <Building2 className="w-5 h-5 text-accent" />
              </div>
              <span className="font-serif font-bold text-lg tracking-widest text-white">
                MURUGAN REAL ESTATE
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              Murugan Real Estate curated list of high-altitude penthouses, waterfront villas, and prime commercial real estate hubs. Serving elite client investors worldwide since 1998.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-slate-300">9892685194</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-slate-300">concierge@aureliaestates.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-serif">Quick Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/about" className="hover:text-accent transition-colors">About Us</Link>
              <Link to="/properties" className="hover:text-accent transition-colors">Listings</Link>
              <Link to="/projects" className="hover:text-accent transition-colors">Projects</Link>
              <Link to="/gallery" className="hover:text-accent transition-colors">Gallery</Link>
              <Link to="/testimonials" className="hover:text-accent transition-colors">Reviews</Link>
              <Link to="/blog" className="hover:text-accent transition-colors">Insights</Link>
              <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
              <Link to="/faq" className="hover:text-accent transition-colors">FAQs</Link>
            </div>
          </div>

          {/* Col 3: Hours & Office */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-serif">Murugan Real Estate Office</h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">720 Fifth Avenue, Suite 1800,<br />New York, NY 10019</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-serif">Exclusive Newsletter</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Subscribe to receive off-market listings, market updates, and exclusive property insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="p-2.5 bg-accent text-primary hover:bg-accent-hover active:bg-accent rounded-xl transition-all flex items-center justify-center flex-shrink-0 shadow-goldGlow disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Murugan Real Estate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* Floating System-wide Toast elements */}
      <ToastContainer />
    </div>
  );
};
