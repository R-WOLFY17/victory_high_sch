import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { schoolVision, schoolMission } from '../../data/schoolData';

const highlights = [
  'UCE & UACE examinations excellence',
  'Qualified and dedicated teaching staff',
  'Modern facilities and laboratories',
  'Rich co-curricular programme',
  'Safe, nurturing boarding environment',
  'Values-centred holistic education',
];

export default function AboutPreview() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Images */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                  <img
                    src="/images/campus/campus1.jpg"
                    alt="School campus"
                    className="w-full h-full object-cover"
                    onError={e => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = 'none';
                      t.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-blue-400 text-center p-4">
                    <div className="text-4xl mb-2">🏫</div>
                    <div className="text-sm">Campus Photo</div>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden h-40 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center">
                  <img
                    src="/images/campus/classroom.jpg"
                    alt="Classroom"
                    className="w-full h-full object-cover"
                    onError={e => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = 'none';
                      t.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-emerald-400 text-center p-4">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-sm">Classroom</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <div className="rounded-2xl overflow-hidden h-40 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 flex items-center justify-center">
                  <img
                    src="/images/campus/lab.jpg"
                    alt="Laboratory"
                    className="w-full h-full object-cover"
                    onError={e => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = 'none';
                      t.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-yellow-500 text-center p-4">
                    <div className="text-3xl mb-2">🔬</div>
                    <div className="text-sm">Laboratory</div>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center">
                  <img
                    src="/images/campus/library.jpg"
                    alt="Library"
                    className="w-full h-full object-cover"
                    onError={e => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = 'none';
                      t.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-purple-400 text-center p-4">
                    <div className="text-3xl mb-2">📖</div>
                    <div className="text-sm">Library</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 flex items-center gap-3"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white font-bold font-poppins text-sm text-center leading-tight px-1">
                Now or Never
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Community</div>
                <div className="text-emerald-600 text-xs font-semibold">Ssunga, Buikwe</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold tracking-wide uppercase mb-5">
              About Our School
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins text-slate-900 dark:text-white leading-tight mb-5">
              A School Built for <span className="text-gradient">Victory</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Nyenga Victory High School is a community school located in Ssunga, Nyenga, Uganda — 
              proudly welcoming students of all religious backgrounds. We are built on the belief 
              that hard work, teamwork, integrity and servant hood are the foundations of true success. 
              Our motto says it all: <strong className="text-blue-700 dark:text-blue-400">"Now or Never."</strong>
            </p>

            {/* Vision/Mission tabs */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 mb-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 border-b-2 border-blue-600 pb-2">
                  <h3 className="font-bold text-blue-700 dark:text-blue-400 text-sm">Our Vision</h3>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">{schoolVision}</p>
              <div className="mt-4">
                <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mb-2">Our Mission</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">{schoolMission}</p>
              </div>
            </div>

            {/* Highlights */}
            <ul className="grid grid-cols-2 gap-2 mb-7">
              {highlights.map(h => (
                <li key={h} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={13} />
                  {h}
                </li>
              ))}
            </ul>

            <Link to="/about" className="btn-primary flex items-center gap-2 w-fit ripple">
              Learn More About Us <FaArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
