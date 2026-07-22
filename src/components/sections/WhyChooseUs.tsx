import { motion } from 'framer-motion';
import {
  FaFlask, FaBook, FaTrophy, FaUserTie, FaGlobe, FaShieldAlt,
  FaBed, FaBus, FaLaptop, FaMusic,
} from 'react-icons/fa';
import SectionHeader from '../ui/SectionHeader';

const features = [
  { icon: FaUserTie, title: 'Expert Teachers', desc: 'Qualified, experienced, and passionate educators dedicated to every student\'s success.', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
  { icon: FaFlask, title: 'Modern Labs', desc: 'State-of-the-art science and computer laboratories equipped with the latest tools.', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
  { icon: FaTrophy, title: 'Top Results', desc: 'Consistently outstanding performance in UCE and UACE national examinations.', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30' },
  { icon: FaBook, title: 'Rich Library', desc: 'Extensive library resources including digital access to support learning beyond the classroom.', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
  { icon: FaTrophy, title: 'Sports & Arts', desc: 'Competitive sports teams, drama, music, and debate for holistic student development.', color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
  { icon: FaShieldAlt, title: 'Safe Environment', desc: '24-hour security, supervised dormitories, and a disciplined, nurturing school culture.', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/30' },
  { icon: FaBed, title: 'Quality Boarding', desc: 'Comfortable, well-maintained dormitories with nutritious meals and round-the-clock care.', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' },
  { icon: FaLaptop, title: 'Digital Learning', desc: 'ICT-integrated lessons and a modern computer lab preparing students for a digital world.', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/30' },
  { icon: FaMusic, title: 'Talent Nurturing', desc: 'Dedicated music, drama, and arts programmes that discover and develop every gift.', color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/30' },
  { icon: FaGlobe, title: 'Global Outlook', desc: 'Education that prepares students to compete and contribute on the global stage.', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30' },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="container-custom">
        <SectionHeader
          badge="Why Choose NVHS"
          title="Everything Your Child"
          highlight="Needs to Thrive"
          subtitle="We provide the environment, resources, and guidance that empower every student to discover their potential and achieve extraordinary results."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 font-poppins">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
