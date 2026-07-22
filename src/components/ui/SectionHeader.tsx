import { motion } from 'framer-motion';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  badge, title, highlight, subtitle, centered = true, light = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`mb-14 ${centered ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {badge && (
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 
          ${light ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`}>
          {badge}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold font-poppins leading-tight mb-4
        ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
        {title}{' '}
        {highlight && (
          <span className={light ? 'text-yellow-400' : 'text-gradient'}>{highlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl ${centered ? 'mx-auto' : ''} leading-relaxed
          ${light ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-5 ${centered ? 'flex justify-center' : ''}`}>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full" />
      </div>
    </motion.div>
  );
}
