import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import AboutPreview from '../components/sections/AboutPreview';
import ValuesSection from '../components/sections/ValuesSection';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import NewsSection from '../components/sections/NewsSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import CTASection from '../components/sections/CTASection';
import { schoolInfo } from '../data/schoolData';
import { usePublicEvents } from '../hooks/usePublicData';

export default function Home() {
  const { upcoming: upcomingEvents } = usePublicEvents();
  return (
    <>
      <Helmet>
        <title>{schoolInfo.name} — Now or Never</title>
        <meta name="description" content={`${schoolInfo.name} is a community secondary school in Ssunga, Nyenga, Buikwe, Uganda — producing responsible, disciplined and self-motivated members of the community.`} />
        <meta property="og:title" content={schoolInfo.name} />
        <meta property="og:description" content="Now or Never — Victory is a journey of growth, learning and self-discovery." />
      </Helmet>

      <HeroSection />
      <StatsSection />
      <AboutPreview />
      <ValuesSection />
      <WhyChooseUs />

      {/* Upcoming Events */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Calendar</span>
              <h2 className="text-2xl md:text-3xl font-bold font-poppins text-slate-900 dark:text-white mt-1">Upcoming Events</h2>
            </div>
            <Link to="/news" className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
              View All Events <FaArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.slice(0, 3).map((event, i) => (
              <motion.div
                key={event.id}
                className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                  <span className="text-xl font-bold font-poppins leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-[10px] text-blue-200 uppercase">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    {event.category}
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="col-span-3 text-center py-8 text-slate-400 text-sm">
                No upcoming events scheduled. Check back soon.
              </div>
            )}
          </div>
        </div>
      </section>

      <NewsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
