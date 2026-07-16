import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { ToastContainer } from '../components/ToastContainer';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  LogOut,
  Lock,
  Building2,
  LayoutDashboard,
  Home,
  Mail,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';


export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar collapse states
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Dropdowns open states
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock Notifications for design aesthetics
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Lead Captured', message: 'John Smith registered from website', time: '5 mins ago', read: false },
    { id: '2', title: 'Property Enquiry', message: 'Inquiry on Aurelia Penthouse Suite', time: '1 hour ago', read: false },
    { id: '3', title: 'System Notification', message: 'DB backup completed successfully', time: '1 day ago', read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/login');
  };

  // Compute Breadcrumbs from pathname
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    const label = value.charAt(0).toUpperCase() + value.slice(1);
    return { to, label, isLast };
  });

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Properties', path: '/admin/properties', icon: <Home className="w-5 h-5" /> },
    { label: 'Leads', path: '/admin/leads', icon: <Users className="w-5 h-5" /> },
    { label: 'Enquiries', path: '/admin/enquiries', icon: <Mail className="w-5 h-5" /> },
    { label: 'Blogs', path: '/admin/blogs', icon: <FileText className="w-5 h-5" /> },
    { label: 'Testimonials', path: '/admin/testimonials', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Change Password', path: '/admin/change-password', icon: <Lock className="w-5 h-5" /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-luxuryBg-light dark:bg-[#070b13] transition-colors duration-300">
      {/* 1. Backdrop Overlay for Mobile Sidebar Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen border-r border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-primary-dark/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary dark:bg-primary-light border border-accent/30 flex items-center justify-center rounded-xl shadow-goldGlow flex-shrink-0">
                <Building2 className="w-5 h-5 text-accent" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-sm tracking-widest text-slate-900 dark:text-gray-100">
                    AURELIA
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-accent font-semibold">
                    ADMIN PLATFORM
                  </span>
                </div>
              )}
            </div>

            {/* Mobile close button / Desktop collapse icon toggle */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-accent/10 border border-accent/20 text-accent font-semibold shadow-goldGlow'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary-light/30 hover:text-slate-900 dark:hover:text-white border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-accent' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors'}>
                    {link.icon}
                  </span>
                  {!isCollapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Collapse Toggle + User Info block) */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/80">
          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-full py-2.5 mb-3 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {!isCollapsed && user && (
            <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-primary-dark/25 rounded-xl border border-slate-100 dark:border-slate-800/40">
              <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent uppercase text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate capitalize font-mono">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 3. Main Dashboard Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-[#070b13]/60 backdrop-blur-md flex items-center justify-between px-6">
          {/* Mobile hamburger menu toggle & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Link to="/admin" className="hover:text-slate-600 dark:hover:text-slate-200">
                Admin
              </Link>
              {breadcrumbs.map((crumb) => (
                <React.Fragment key={crumb.to}>
                  <span>/</span>
                  <Link
                    to={crumb.to}
                    className={crumb.isLast ? 'text-accent font-semibold' : 'hover:text-slate-600 dark:hover:text-slate-200'}
                  >
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Header Navigation Options */}
          <div className="flex items-center gap-3">
            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme mode"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-accent" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notification Drawer Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-[9px] font-bold text-white flex items-center justify-center rounded-full ring-2 ring-white dark:ring-[#070b13]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-premium rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/50 mb-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-gray-100">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-accent hover:underline flex items-center gap-1 font-semibold"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-xl text-left transition-colors border ${
                          notif.read
                            ? 'bg-transparent border-transparent'
                            : 'bg-accent/5 border-accent/10'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                          <span className="text-[9px] text-slate-400 font-mono">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 bg-accent/20 border border-accent/30 text-accent flex items-center justify-center font-bold uppercase rounded-lg text-xs">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-premium rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/50 mb-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-gray-100 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/admin/change-password"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" /> Change Password
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/5 rounded-xl transition-all text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* 4. Dashboard Body Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative overflow-y-auto">
          {/* Ambient light/shadow effects */}
          <div className="absolute top-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

          {/* Renders subpages */}
          <Outlet />
        </main>
      </div>

      {/* Floating System-wide Toast elements */}
      <ToastContainer />
    </div>
  );
};
