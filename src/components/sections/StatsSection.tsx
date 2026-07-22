import { motion } from 'framer-motion';
import { FaUserGraduate, FaChartLine, FaChalkboardTeacher, FaStar, FaUsers, FaAward } from 'react-icons/fa';
import { useCountUp } from '../../hooks/useCountUp';
import { statistics } from '../../data/schoolData';

const icons = [FaUserGraduate, FaChartLine, FaChalkboardTeacher, FaAward, FaStar, FaUsers];

function StatCard({ stat, index }: { stat: typeof statistics[0]; index: number }) {
  const { count, ref } = useCountUp(stat.number, 2500);
  const Icon = icons[index % icons.length];

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="glass-dark rounded-2xl p-6 text-center group-hover:bg-white/10 transition-all duration-300 border border-white/5 group-hover:border-white/20">
        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="text-white" size={22} />
        </div>
        <div className="text-4xl font-extrabold text-white font-poppins">
          {count.toLocaleString()}{stat.suffix}
        </div>
        <div className="text-blue-200 text-sm mt-1 font-medium">{stat.label}</div>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,58,138,0.3)_0%,_transparent_70%)]" />
      <div className="container-custom relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-3">
            Our Numbers Speak <span className="text-yellow-400">For Themselves</span>
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto">
            Decades of excellence reflected in every student, every result, every life transformed.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statistics.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
