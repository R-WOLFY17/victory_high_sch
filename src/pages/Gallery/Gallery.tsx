import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import { schoolInfo } from '../../data/schoolData';
import { usePublicGallery } from '../../hooks/usePublicData';
import { FaTimes, FaChevronLeft, FaChevronRight, FaSearchPlus, FaImages } from 'react-icons/fa';

export default function Gallery() {
  const images = usePublicGallery();
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  // Build category list dynamically from actual images
  const albumSet = new Set(images.map(i => i.album));
  const categories = ['All', ...Array.from(albumSet).sort()];

  const filtered = activeCategory === 'All'
    ? images
    : images.filter(img => img.album === activeCategory);

  const currentIndex = filtered.findIndex(img => img.id === lightboxId);
  const currentImage = currentIndex >= 0 ? filtered[currentIndex] : null;

  const prev = () => {
    if (filtered.length === 0) return;
    setLightboxId(filtered[(currentIndex - 1 + filtered.length) % filtered.length].id);
  };
  const next = () => {
    if (filtered.length === 0) return;
    setLightboxId(filtered[(currentIndex + 1) % filtered.length].id);
  };

  return (
    <>
      <Helmet>
        <title>Gallery — {schoolInfo.name}</title>
        <meta name="description" content="Browse photos of campus life, events, achievements, sports, and more at Nyenga Victory High School." />
      </Helmet>

      <PageHero
        title="Gallery"
        subtitle="A visual journey through life at Nyenga Victory High School."
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader
            badge="Photos"
            title="School"
            highlight="Gallery"
            subtitle="Explore moments from campus life, achievements, sports, events, and more."
          />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <FaImages size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No photos yet</p>
              <p className="text-sm mt-1">Upload images via the Admin Dashboard → Gallery</p>
            </div>
          )}

          {/* Masonry grid */}
          {filtered.length > 0 && (
            <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="break-inside-avoid rounded-xl overflow-hidden relative group cursor-pointer shadow-md"
                  onClick={() => setLightboxId(img.id)}
                >
                  <div
                    className={`w-full bg-gradient-to-br ${
                      ['from-blue-100 to-blue-200', 'from-emerald-100 to-emerald-200', 'from-yellow-100 to-yellow-200', 'from-purple-100 to-purple-200'][i % 4]
                    } dark:from-slate-700 dark:to-slate-800`}
                    style={{ aspectRatio: i % 3 === 0 ? '4/5' : '4/3' }}
                  >
                    <img
                      src={img.src}
                      alt={img.caption || img.album}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/40 transition-all duration-300 flex items-center justify-center">
                    <FaSearchPlus className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-medium line-clamp-1">{img.caption || img.album}</p>
                    <p className="text-white/70 text-[10px]">{img.album}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxId !== null && currentImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxId(null)}
          >
            <button onClick={() => setLightboxId(null)} className="absolute top-5 right-5 text-white hover:text-yellow-400 transition-colors z-10">
              <FaTimes size={24} />
            </button>
            <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white hover:text-yellow-400 transition-colors z-10">
              <FaChevronLeft size={28} />
            </button>
            <motion.div
              key={lightboxId}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={currentImage.src}
                alt={currentImage.caption || currentImage.album}
                className="max-h-[75vh] max-w-full object-contain rounded-xl"
              />
              <div className="text-center">
                <p className="text-white font-medium">{currentImage.caption || currentImage.album}</p>
                <p className="text-slate-400 text-sm">{currentImage.album}</p>
              </div>
            </motion.div>
            <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 text-white hover:text-yellow-400 transition-colors z-10">
              <FaChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
