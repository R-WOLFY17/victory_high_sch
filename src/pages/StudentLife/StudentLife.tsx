import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import { clubs, schoolInfo } from '../../data/schoolData';
import CTASection from '../../components/sections/CTASection';
import { FaFutbol, FaTheaterMasks, FaMicrophone, FaLaptop, FaFlask, FaUsers, FaBook, FaBed } from 'react-icons/fa';

const facilities = [
  { icon: FaFlask, name: 'Science Laboratories', desc: 'Fully equipped Physics, Chemistry, and Biology labs for hands-on practical learning.', image: '/images/facilities/lab.jpg', emoji: '🔬' },
  { icon: FaBook, name: 'Library', desc: 'Extensive library with thousands of books, reference materials, and digital resources.', image: '/images/facilities/library.jpg', emoji: '📚' },
  { icon: FaLaptop, name: 'Computer Laboratory', desc: 'Modern ICT lab with internet access, enabling students to develop digital skills.', image: '/images/facilities/ict.jpg', emoji: '💻' },
  { icon: FaFutbol, name: 'Sports Grounds', desc: 'Football pitch, netball and basketball courts, athletics track, and multipurpose playing field.', image: '/images/facilities/sports.jpg', emoji: '⚽' },
  { icon: FaBed, name: 'Dormitories', desc: 'Comfortable, well-maintained dormitories for boys and girls with 24-hour supervision.', image: '/images/facilities/dorms.jpg', emoji: '🏠' },
  { icon: FaUsers, name: 'Assembly Hall', desc: 'Large hall for assemblies, events, drama performances, and guest lectures.', image: '/images/facilities/hall.jpg', emoji: '🏛️' },
];

const sports = [
  { name: 'Football', level: 'District & Regional', icon: '⚽' },
  { name: 'Netball', level: 'District Level', icon: '🏐' },
  { name: 'Athletics', level: 'National Level', icon: '🏃' },
  { name: 'Volleyball', level: 'School Level', icon: '🏐' },
  { name: 'Table Tennis', level: 'School Level', icon: '🏓' },
  { name: 'Board Games', level: 'School Level', icon: '♟️' },
];

export default function StudentLife() {
  return (
    <>
      <Helmet>
        <title>Student Life — {schoolInfo.name}</title>
        <meta name="description" content="Discover the vibrant student life at Nyenga Victory High School — sports, arts, clubs, facilities, and more." />
      </Helmet>

      <PageHero
        title="Student Life"
        subtitle="Life at NVHS is vibrant, purposeful, and full of opportunity — inside and outside the classroom."
        breadcrumbs={[{ label: 'Student Life' }]}
      />

      {/* Sports */}
      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader badge="Athletics" title="Sports &" highlight="Games" subtitle="We believe in developing students physically as well as academically. Our sports programme is competitive and inclusive." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {sports.map((sport, i) => (
              <motion.div
                key={sport.name}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 text-center card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="text-4xl mb-3">{sport.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-poppins mb-1">{sport.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">{sport.level}</p>
              </motion.div>
            ))}
          </div>
          <div className="rounded-2xl overflow-hidden h-72 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center">
            <img src="/images/sports/sports1.jpg" alt="School sports" className="w-full h-full object-cover"
              onError={e => { const t = e.target as HTMLImageElement; t.style.display = 'none'; }}
            />
            <div className="text-center text-emerald-400">
              <div className="text-6xl mb-3">⚽</div>
              <p className="font-semibold">Sports Action Photo</p>
              <p className="text-sm">Replace with actual sports photograph</p>
            </div>
          </div>
        </div>
      </section>

      {/* Arts */}
      <section className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader badge="Arts & Culture" title="Music, Drama &" highlight="The Arts" subtitle="Creativity thrives at NVHS. Our arts programme develops confident, expressive, and culturally aware young people." />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: FaTheaterMasks, title: 'Drama Club', desc: 'Award-winning drama team that performs original and adapted plays at school, district, and national festivals. A platform for budding actors and directors.', color: 'from-violet-500 to-fuchsia-600', emoji: '🎭' },
              { icon: FaMicrophone, title: 'Debate Club', desc: 'Our debate team develops critical thinking, public speaking, and research skills by engaging in interschool and regional debate championships.', color: 'from-emerald-500 to-teal-600', emoji: '🎤' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-2xl overflow-hidden shadow-md card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`bg-gradient-to-br ${item.color} p-6`}>
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h3 className="text-white font-bold text-lg font-poppins">{item.title}</h3>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5">
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs */}
      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader badge="Clubs & Societies" title="Find Your" highlight="Community" subtitle="There's something for everyone at NVHS. Our clubs and societies bring students together around shared interests and passions." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {clubs.map((club, i) => (
              <motion.div
                key={club.name}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 card-hover text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="text-2xl mb-2">
                  {club.category === 'Sports' ? '⚽' : club.category === 'Arts' ? '🎨' : club.category === 'Academic' ? '📚' : club.category === 'Spiritual' ? '✝️' : '🌿'}
                </div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{club.name}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{club.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader badge="Infrastructure" title="World-Class" highlight="Facilities" subtitle="Our modern facilities provide students with everything they need to learn, grow, and thrive." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac, i) => (
              <motion.div
                key={fac.name}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-44 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 relative flex items-center justify-center">
                  <img src={fac.image} alt={fac.name} className="w-full h-full object-cover"
                    onError={e => { const t = e.target as HTMLImageElement; t.style.display = 'none'; }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-4xl text-blue-400">{fac.emoji}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 dark:text-white font-poppins mb-2">{fac.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{fac.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
