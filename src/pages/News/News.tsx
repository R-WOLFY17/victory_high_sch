import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import { schoolInfo } from '../../data/schoolData';
import { usePublicNews, usePublicEvents } from '../../hooks/usePublicData';
import { FaCalendarAlt, FaTag, FaArrowRight, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const CATEGORIES = ['All', 'News', 'Events', 'Achievements', 'Sports', 'Arts', 'Community', 'Academic', 'General'];

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All');
  const news = usePublicNews();
  const { upcoming: upcomingEvents } = usePublicEvents();

  const filtered = activeCategory === 'All'
    ? news
    : news.filter(n => n.category === activeCategory);

  // Only show categories that have articles
  const usedCategories = CATEGORIES.filter(c =>
    c === 'All' || news.some(n => n.category === c)
  );

  return (
    <>
      <Helmet>
        <title>News & Events — {schoolInfo.name}</title>
        <meta name="description" content="Latest news, events, achievements, and announcements from Nyenga Victory High School." />
      </Helmet>

      <PageHero
        title="News & Events"
        subtitle="Stay connected with the latest from our school community."
        breadcrumbs={[{ label: 'News & Events' }]}
      />

      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* ── Main news feed ───────────────────────────────────── */}
            <div className="lg:col-span-2">
              <SectionHeader badge="Latest" title="School" highlight="News" centered={false} />

              {/* Category filter */}
              <div className="flex flex-wrap gap-2 mb-8">
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
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <div className="text-5xl mb-4">📰</div>
                  <p>No articles in this category yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filtered.map((article, i) => (
                    <motion.article
                      key={article.id}
                      className="flex gap-5 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      {/* Thumbnail */}
                      <div className="w-32 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 relative flex items-center justify-center">
                        {article.imageBase64 ? (
                          <img
                            src={article.imageBase64}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="text-2xl text-blue-400">📰</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <FaCalendarAlt size={9} />
                            {article.date
                              ? new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                              : ''}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                            <FaTag size={9} /> {article.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white font-poppins mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-2">
                          {article.excerpt}
                        </p>
                        <Link
                          to={`/news/${article.slug}`}
                          className="text-sm font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Read More <FaArrowRight size={10} />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>

            {/* ── Sidebar ──────────────────────────────────────────── */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div id="events" className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 dark:text-white font-poppins text-lg mb-5">
                  Upcoming Events
                </h3>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No upcoming events</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 5).map(event => (
                      <div key={event.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                          <span className="text-lg font-bold leading-none font-poppins">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="text-[9px] text-blue-200 uppercase">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{event.title}</p>
                          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            {event.category}
                          </span>
                          {event.time && (
                            <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                              <FaClock size={9} /> {event.time}
                            </p>
                          )}
                          {event.location && (
                            <p className="text-slate-400 text-xs flex items-center gap-1">
                              <FaMapMarkerAlt size={9} /> {event.location}
                            </p>
                          )}
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 dark:text-white font-poppins text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {usedCategories.filter(c => c !== 'All').map(cat => {
                    const count = news.filter(n => n.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{cat}</span>
                        <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
