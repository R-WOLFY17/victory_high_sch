import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import SectionHeader from '../ui/SectionHeader';
import { usePublicNews } from '../../hooks/usePublicData';

export default function NewsSection() {
  const latestNews = usePublicNews();
  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-950">
      <div className="container-custom">
        <SectionHeader
          badge="Latest News"
          title="What's Happening"
          highlight="at NVHS"
          subtitle="Stay updated with the latest news, achievements, and events from our vibrant school community."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {latestNews.slice(0, 3).map((news, i) => (
            <motion.article
              key={news.id}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="relative h-52 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 overflow-hidden flex items-center justify-center">
                {news.imageBase64 ? (
                  <img
                    src={news.imageBase64}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-5xl text-blue-300 dark:text-blue-700">📰</div>
                )}
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {news.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <FaCalendarAlt size={10} />
                  {new Date(news.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 font-poppins line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4">
                  {news.excerpt}
                </p>
                <Link
                  to={`/news/${news.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold group/link"
                >
                  Read More <FaArrowRight size={11} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <Link to="/news" className="btn-secondary inline-flex items-center gap-2 ripple">
            View All News & Events <FaArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
