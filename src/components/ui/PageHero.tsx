import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface Crumb { label: string; path?: string; }

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: Crumb[];
  bgImage?: string;
}

export default function PageHero({ title, subtitle, breadcrumbs, bgImage }: PageHeroProps) {
  return (
    <section
      className="relative pt-36 pb-20 overflow-hidden"
      style={{
        background: bgImage
          ? `linear-gradient(135deg, rgba(15,23,42,0.88), rgba(30,58,138,0.75)), url(${bgImage}) center/cover`
          : 'linear-gradient(135deg, #0F172A, #1E3A8A, #059669)',
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <FaHome size={12} /> Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <FaChevronRight size={10} className="text-blue-400" />
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-white transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-poppins leading-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-blue-200 text-lg max-w-xl leading-relaxed">{subtitle}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
