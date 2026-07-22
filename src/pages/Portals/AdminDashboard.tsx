import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FaUsers, FaCalendarAlt, FaDownload, FaNewspaper, FaImages,
  FaSignInAlt, FaChartBar, FaCog, FaTachometerAlt, FaBell,
  FaUserGraduate, FaClipboard,
} from 'react-icons/fa';

import { schoolInfo } from '../../data/schoolData';
import { usersDB } from '../../admin/db';

// Modules
import { ToastContainer } from '../../admin/Notification';
import { notify } from '../../admin/Notification';
import DashboardHome from '../../admin/DashboardHome';
import ManageNews from '../../admin/ManageNews';
import ManageGallery from '../../admin/ManageGallery';
import ManageDownloads from '../../admin/ManageDownloads';
import ManageAdmissions from '../../admin/ManageAdmissions';
import ManageStaff from '../../admin/ManageStaff';
import ManageStudents from '../../admin/ManageStudents';
import ManageEvents from '../../admin/ManageEvents';
import ManageUsers from '../../admin/ManageUsers';
import Analytics from '../../admin/Analytics';
import Settings from '../../admin/Settings';

// ─── Sidebar config ───────────────────────────────────────────────────────────
const sidebarItems = [
  { icon: FaTachometerAlt, label: 'Dashboard',          key: 'Dashboard' },
  { icon: FaNewspaper,     label: 'Manage News',        key: 'News' },
  { icon: FaImages,        label: 'Manage Gallery',     key: 'Gallery' },
  { icon: FaDownload,      label: 'Manage Downloads',   key: 'Downloads' },
  { icon: FaClipboard,     label: 'Manage Admissions',  key: 'Admissions' },
  { icon: FaUsers,         label: 'Manage Staff',       key: 'Staff' },
  { icon: FaUserGraduate,  label: 'Manage Students',    key: 'Students' },
  { icon: FaCalendarAlt,   label: 'Manage Events',      key: 'Events' },
  { icon: FaUsers,         label: 'Manage Users',       key: 'Users' },
  { icon: FaChartBar,      label: 'Analytics',          key: 'Analytics' },
  { icon: FaCog,           label: 'Settings',           key: 'Settings' },
];

// ─── Login form ───────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('Email and password are required'); return; }
    setLoading(true);
    // Simulate slight delay
    setTimeout(() => {
      const user = usersDB.authenticate(email.trim(), password);
      setLoading(false);
      if (user) {
        notify.success(`Welcome back, ${user.name}`);
        onLogin(user.name);
      } else {
        setError('Invalid credentials or account inactive. Default: admin / admin123');
      }
    }, 400);
  }

  return (
    <>
      <Helmet><title>Admin — {schoolInfo.name}</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
        <motion.div
          className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaTachometerAlt className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-white">
              Admin Dashboard
            </h2>
            <p className="text-slate-500 text-sm mt-1">Authorised personnel only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email or Username"
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
            />
            {error && (
              <p className="text-red-600 dark:text-red-400 text-xs text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base ripple disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaSignInAlt /> {loading ? 'Signing in…' : 'Admin Sign In'}
            </button>
            <p className="text-center text-xs text-slate-500">
              Default login: <strong>admin</strong> / <strong>admin123</strong>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [loggedIn, setLoggedIn]         = useState(false);
  const [adminName, setAdminName]       = useState('Admin');
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen]   = useState(true);

  // Quick-action state: which section to open + whether to trigger "create" mode
  const [newsCreate, setNewsCreate]     = useState(false);
  const [galleryUpload, setGalleryUpload] = useState(false);
  const [eventsCreate, setEventsCreate] = useState(false);
  const [dlCreate, setDlCreate]         = useState(false);

  if (!loggedIn) {
    return (
      <>
        <ToastContainer />
        <LoginScreen onLogin={name => { setAdminName(name); setLoggedIn(true); }} />
      </>
    );
  }

  // Navigate and optionally trigger a create action
  function navigate(section: string) {
    setActiveSection(section);
    setNewsCreate(false);
    setGalleryUpload(false);
    setEventsCreate(false);
    setDlCreate(false);
  }

  function handleQuickAction(action: string) {
    switch (action) {
      case 'News':
        setNewsCreate(true);
        setActiveSection('News');
        break;
      case 'Gallery':
        setGalleryUpload(true);
        setActiveSection('Gallery');
        break;
      case 'Events':
        setEventsCreate(true);
        setActiveSection('Events');
        break;
      case 'Downloads':
        setDlCreate(true);
        setActiveSection('Downloads');
        break;
    }
  }

  return (
    <>
      <Helmet><title>Admin Dashboard — {schoolInfo.name}</title></Helmet>
      <ToastContainer />

      <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950">
        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} transition-all duration-300 bg-slate-900 text-white flex flex-col flex-shrink-0`}>
          <div className="p-4 flex items-center gap-3 border-b border-slate-700">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">V</div>
            {sidebarOpen && <span className="font-bold text-sm font-poppins">NVHS Admin</span>}
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            {sidebarItems.map(item => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  activeSection === item.key
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon size={15} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700">
            <button
              onClick={() => { setLoggedIn(false); notify.info('Signed out'); }}
              className="w-full text-xs text-slate-400 hover:text-white transition-colors text-left"
            >
              {sidebarOpen ? '→ Sign Out' : '→'}
            </button>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(o => !o)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white text-lg"
              >
                ☰
              </button>
              <h1 className="font-semibold text-slate-900 dark:text-white">{activeSection}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <FaBell size={16} />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-300 hidden sm:block">{adminName}</span>
              <button
                onClick={() => { setLoggedIn(false); notify.info('Signed out'); }}
                className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
              <a href="/" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">← Site</a>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'Dashboard' && (
              <DashboardHome onNavigate={navigate} onQuickAction={handleQuickAction} />
            )}
            {activeSection === 'News' && (
              <ManageNews key={`news-${newsCreate}`} openCreate={newsCreate} />
            )}
            {activeSection === 'Gallery' && (
              <ManageGallery key={`gallery-${galleryUpload}`} openUpload={galleryUpload} />
            )}
            {activeSection === 'Downloads' && (
              <ManageDownloads key={`dl-${dlCreate}`} openCreate={dlCreate} />
            )}
            {activeSection === 'Admissions' && (
              <ManageAdmissions />
            )}
            {activeSection === 'Staff' && (
              <ManageStaff />
            )}
            {activeSection === 'Students' && (
              <ManageStudents />
            )}
            {activeSection === 'Events' && (
              <ManageEvents key={`events-${eventsCreate}`} openCreate={eventsCreate} />
            )}
            {activeSection === 'Users' && (
              <ManageUsers />
            )}
            {activeSection === 'Analytics' && (
              <Analytics />
            )}
            {activeSection === 'Settings' && (
              <Settings />
            )}
          </main>
        </div>
      </div>
    </>
  );
}
