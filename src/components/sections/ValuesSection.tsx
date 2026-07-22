import { motion } from 'framer-motion';
import { schoolValues } from '../../data/schoolData';
import SectionHeader from '../ui/SectionHeader';

export default function ValuesSection() {
  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-950">
      <div className="container-custom">
        <SectionHeader
          badge="Our Values"
          title="The Principles That"
          highlight="Define Us"
          subtitle="At Nyenga Victory High School, our values are not just words on a wall — they are the foundation of everything we do, every day."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {schoolValues.map((value, i) => (
            <motion.div
              key={value.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className={`relative h-full rounded-2xl bg-gradient-to-br ${value.color} p-6 overflow-hidden text-white shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2`}>
                {/* Decorative large emoji in background */}
                <div className="text-8xl absolute -bottom-4 -right-4 opacity-10 select-none leading-none">
                  {value.icon}
                </div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-bold text-lg font-poppins mb-3 leading-tight">{value.title}</h3>
                  <p className="text-white/85 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motto display */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl px-10 py-8 shadow-xl">
            <p className="text-blue-300 text-sm uppercase tracking-widest mb-3">Our School Motto</p>
            <p className="text-white text-3xl md:text-4xl font-extrabold font-poppins mb-3">
              "Now or Never"
            </p>
            <p className="text-yellow-400 text-sm italic max-w-md mx-auto">
              "Victory is not just a destination, but a journey of growth, learning and self-discovery."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
