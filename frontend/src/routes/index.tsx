import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from './guards';

import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { Home } from '../pages/public/Home';
import { About } from '../pages/public/About';
import { Properties } from '../pages/public/Properties';
import { PropertyDetails } from '../pages/public/PropertyDetails';
import { Projects } from '../pages/public/Projects';
import { Gallery } from '../pages/public/Gallery';
import { Testimonials } from '../pages/public/Testimonials';
import { Blog } from '../pages/public/Blog';
import { BlogDetails } from '../pages/public/BlogDetails';
import { Contact } from '../pages/public/Contact';
import { FAQ } from '../pages/public/FAQ';
import { PrivacyPolicy } from '../pages/public/PrivacyPolicy';
import { Terms } from '../pages/public/Terms';
import { NotFound } from '../pages/public/NotFound';

// Guest Pages
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// Protected Pages
import { DashboardOverview } from '../pages/admin/DashboardOverview';
import { PropertiesMock } from '../pages/admin/PropertiesMock';
import { LeadsMock } from '../pages/admin/LeadsMock';
import { EnquiriesMock } from '../pages/admin/EnquiriesMock';
import { BlogsMock } from '../pages/admin/BlogsMock';
import { TestimonialsMock } from '../pages/admin/TestimonialsMock';
import { ChangePassword } from '../pages/admin/ChangePassword';
import { SettingsMock } from '../pages/admin/SettingsMock';

// Fallback Pages
import { Unauthorized } from '../pages/Unauthorized';

export const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-luxuryBg-light dark:bg-luxuryBg-dark">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetails />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Guest Routes */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardOverview />} />
            <Route path="/admin/properties" element={<PropertiesMock />} />
            <Route path="/admin/leads" element={<LeadsMock />} />
            <Route path="/admin/enquiries" element={<EnquiriesMock />} />
            <Route path="/admin/blogs" element={<BlogsMock />} />
            <Route path="/admin/testimonials" element={<TestimonialsMock />} />
            <Route path="/admin/change-password" element={<ChangePassword />} />
            <Route path="/admin/settings" element={<SettingsMock />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Suspense>
  );
};
