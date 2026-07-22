import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
import PageLoader from './components/ui/PageLoader';

const Home           = lazy(() => import('./pages/Home'));
const About          = lazy(() => import('./pages/About/About'));
const Academics      = lazy(() => import('./pages/Academics/Academics'));
const Admissions     = lazy(() => import('./pages/Admissions/Admissions'));
const StudentLife    = lazy(() => import('./pages/StudentLife/StudentLife'));
const Gallery        = lazy(() => import('./pages/Gallery/Gallery'));
const News           = lazy(() => import('./pages/News/News'));
const Contact        = lazy(() => import('./pages/Contact/Contact'));
const Downloads      = lazy(() => import('./pages/Downloads/Downloads'));
const AdminDashboard = lazy(() => import('./pages/Portals/AdminDashboard'));

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            {/* Admin dashboard — no navbar/footer */}
            <Route path="/dashboard" element={<AdminDashboard />} />

            {/* Main site routes */}
            <Route path="/"             element={<Layout><Home /></Layout>} />
            <Route path="/about"        element={<Layout><About /></Layout>} />
            <Route path="/academics"    element={<Layout><Academics /></Layout>} />
            <Route path="/admissions"   element={<Layout><Admissions /></Layout>} />
            <Route path="/student-life" element={<Layout><StudentLife /></Layout>} />
            <Route path="/gallery"      element={<Layout><Gallery /></Layout>} />
            <Route path="/news"         element={<Layout><News /></Layout>} />
            <Route path="/news/:slug"   element={<Layout><News /></Layout>} />
            <Route path="/contact"      element={<Layout><Contact /></Layout>} />
            <Route path="/downloads"    element={<Layout><Downloads /></Layout>} />

            {/* 404 */}
            <Route path="*" element={
              <Layout>
                <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 pt-20">
                  <div className="text-center max-w-md px-4">
                    <div className="text-8xl mb-6">🔍</div>
                    <h1 className="text-4xl font-bold font-poppins text-slate-900 dark:text-white mb-3">404</h1>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn-primary inline-block">← Back to Home</a>
                  </div>
                </div>
              </Layout>
            } />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AnimatePresence>
            {loading && <LoadingScreen key="loading" />}
          </AnimatePresence>
          {!loading && <AnimatedRoutes />}
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
