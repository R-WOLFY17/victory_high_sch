import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars, FaTimes, FaMoon, FaSun,
  FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaYoutube,
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { schoolInfo } from '../../data/schoolData';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Student Life', path: '/student-life' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'News', path: '/news' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';
  const navBg = scrolled || !isHome
    ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg'
    : 'bg-transparent';
  const textColor = scrolled || !isHome
    ? 'text-slate-800 dark:text-white'
    : 'text-white';

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-blue-900 text-white text-sm py-2">
        <div className="container-custom flex justify-between items-center">
          <div className="flex gap-6">
            <a href={`tel:${schoolInfo.phone}`} className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
              <FaPhone size={11} /> {schoolInfo.phone}
            </a>
            <a href={`mailto:${schoolInfo.email}`} className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
              <FaEnvelope size={11} /> {schoolInfo.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition-colors"><FaFacebookF size={12} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition-colors"><FaInstagram size={12} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition-colors"><FaYoutube size={13} /></a>
            <Link to="/dashboard" className="border-l border-blue-700 pl-4 text-blue-200 hover:text-yellow-400 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className={`fixed top-0 lg:top-10 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300">
                <span className="text-white font-bold text-xl font-poppins">V</span>
              </div>
              <div>
                <div className={`font-bold text-base font-poppins leading-tight ${scrolled || !isHome ? 'text-blue-900 dark:text-white' : 'text-white'}`}>
                  Nyenga Victory
                </div>
                <div className={`text-xs font-medium ${scrolled || !isHome ? 'text-emerald-600' : 'text-emerald-300'}`}>
                  High School
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-yellow-500 bg-yellow-500/10'
                      : `${textColor} hover:text-yellow-400 hover:bg-white/10`
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${textColor} hover:bg-white/10`}
                aria-label="Toggle theme"
              >
                {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>
              <button
                className={`lg:hidden p-2 rounded-lg ${textColor} hover:bg-white/10`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
            >
              <div className="container-custom py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
