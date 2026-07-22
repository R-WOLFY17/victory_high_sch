import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import { schoolInfo } from '../../data/schoolData';
import { usePublicDownloads } from '../../hooks/usePublicData';
import { downloadsDB } from '../../admin/db';
import { FaDownload, FaFilePdf, FaFileWord, FaFileArchive, FaFileAlt } from 'react-icons/fa';

const ALL_CATEGORIES = ['All', 'Admissions', 'Academic', 'General', 'Past Papers', 'Circulars', 'Other'];

function FileIcon({ type }: { type: string }) {
  if (type.includes('pdf'))  return <FaFilePdf className="text-red-500"  size={20} />;
  if (type.includes('word') || type.includes('doc')) return <FaFileWord className="text-blue-500" size={20} />;
  if (type.includes('zip'))  return <FaFileArchive className="text-yellow-500" size={20} />;
  return <FaFileAlt className="text-slate-500" size={20} />;
}

export default function Downloads() {
  const downloads = usePublicDownloads();
  const [activeCategory, setActiveCategory] = useState('All');

  // Only show categories that have items
  const usedCategories = ALL_CATEGORIES.filter(c =>
    c === 'All' || downloads.some(d => d.category === c)
  );

  const filtered = activeCategory === 'All'
    ? downloads
    : downloads.filter(d => d.category === activeCategory);

  function handleDownload(item: typeof downloads[0]) {
    // Increment download counter for admin-uploaded files
    if (item.fileBase64 && item.fileBase64.startsWith('data:')) {
      downloadsDB.incrementDownload(item.id);
      const link = document.createElement('a');
      link.href = item.fileBase64;
      link.download = item.fileName || item.title;
      link.click();
    } else {
      // Static / URL-based file — open in new tab
      window.open(item.fileBase64, '_blank');
    }
  }

  return (
    <>
      <Helmet>
        <title>Downloads — {schoolInfo.name}</title>
        <meta name="description" content="Download admission forms, prospectus, school rules, past papers, and more from Nyenga Victory High School." />
      </Helmet>

      <PageHero
        title="Downloads"
        subtitle="Access and download official school documents, forms, and resources."
        breadcrumbs={[{ label: 'Downloads' }]}
      />

      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader
            badge="Resources"
            title="School"
            highlight="Documents"
            subtitle="Download the forms and documents you need below."
          />

          {/* Category tabs */}
          {usedCategories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {usedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                  <span className="ml-1.5 text-xs opacity-70">
                    ({downloads.filter(d => cat === 'All' || d.category === cat).length})
                  </span>
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FaFileAlt size={40} className="mx-auto mb-4 opacity-40" />
              <p>No documents in this category yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                    <FileIcon type={doc.fileType} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{doc.title}</p>
                    {doc.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">{doc.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{doc.category}</span>
                      {doc.fileSize && <span className="text-xs text-slate-400">{doc.fileSize}</span>}
                      {doc.downloads > 0 && (
                        <span className="text-xs text-slate-400 flex items-center gap-0.5">
                          <FaDownload size={8} /> {doc.downloads}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0"
                    aria-label={`Download ${doc.title}`}
                  >
                    <FaDownload size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
