import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import { departments, clubs, schoolInfo } from '../../data/schoolData';
import CTASection from '../../components/sections/CTASection';
import { FaBookOpen, FaClock, FaDownload } from 'react-icons/fa';

const teachingMethods = [
  { title: 'Inquiry-Based Learning', desc: 'Encouraging students to ask questions, investigate, and discover knowledge through guided exploration.', icon: '🔍' },
  { title: 'Project-Based Learning', desc: 'Real-world projects that develop critical thinking, creativity, and collaboration skills.', icon: '📐' },
  { title: 'Digital Integration', desc: 'Technology-enhanced lessons using digital resources, presentations, and interactive tools.', icon: '💻' },
  { title: 'Peer Learning', desc: 'Collaborative group work and peer tutoring that deepens understanding and builds communication skills.', icon: '🤝' },
  { title: 'Assessment for Learning', desc: 'Regular formative and summative assessments to track progress and guide instruction.', icon: '📊' },
  { title: 'Pastoral Support', desc: 'Academic counselling and mentorship to support every student\'s learning journey.', icon: '🌱' },
];

const termDates = [
  { term: 'Term 1', start: 'February 3, 2025', end: 'May 9, 2025', notes: 'Including two weeks mid-term break' },
  { term: 'Term 2', start: 'June 2, 2025', end: 'August 22, 2025', notes: 'Including two weeks mid-term break' },
  { term: 'Term 3', start: 'September 15, 2025', end: 'November 28, 2025', notes: 'End-of-year examinations in November' },
];

export default function Academics() {
  return (
    <>
      <Helmet>
        <title>Academics — {schoolInfo.name}</title>
        <meta name="description" content="Explore the academic programmes, departments, subjects, and teaching methodology at Nyenga Victory High School." />
      </Helmet>

      <PageHero
        title="Academics"
        subtitle="A rigorous, broad, and inspiring curriculum that prepares students for success in examinations and in life."
        breadcrumbs={[{ label: 'Academics' }]}
      />

      {/* Curriculum Overview */}
      <section id="curriculum" className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader badge="Curriculum" title="What We" highlight="Teach" subtitle="Our curriculum follows the Uganda National Curriculum, offering both O-Level and A-Level programmes with a wide range of subject combinations." />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold font-poppins text-slate-900 dark:text-white mb-4">O-Level Programme (S1 – S4)</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                Our Ordinary Level programme provides a strong academic foundation across science, 
                arts, and technical subjects. Students are prepared for the Uganda Certificate of Education (UCE) 
                examinations administered by UNEB.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Commerce', 'Computer Science', 'Fine Art', 'Luganda', 'French'].map(s => (
                  <span key={s} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">{s}</span>
                ))}
              </div>
              <h3 className="text-xl font-bold font-poppins text-slate-900 dark:text-white mb-4">A-Level Programme (S5 – S6)</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                Our Advanced Level programme offers subject combinations in Sciences, Arts, and Business.
                Students sit the Uganda Advanced Certificate of Education (UACE) for university entry.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics',
                  'History', 'Geography', 'Literature in English', 'Divinity (CRE)',
                  'Islamic General Paper', 'Entrepreneurship', 'Computer Science',
                  'Art', 'Music', 'French', 'Kiswahili', 'Arabic', 'Agriculture',
                  'Technical Drawing', 'Fine Art', 'Physical Education', 'General Paper (GP)',
                ].map(s => (
                  <span key={s} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">{s}</span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden h-96 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                <img src="/images/academics/students.jpg" alt="Students in class" className="w-full h-full object-cover"
                  onError={e => { const t = e.target as HTMLImageElement; t.style.display = 'none'; }}
                />
                <div className="text-center text-blue-400 p-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-lg font-semibold">Classroom Photo</p>
                  <p className="text-sm mt-2">Replace with actual classroom image</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader badge="Departments" title="Academic" highlight="Departments" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.name}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`bg-gradient-to-br ${dept.color} p-5`}>
                  <h3 className="text-white font-bold text-lg font-poppins">{dept.name}</h3>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {dept.subjects.map(s => (
                      <span key={s} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methods */}
      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader badge="Pedagogy" title="Teaching" highlight="Methodology" subtitle="We employ modern, student-centred teaching approaches that make learning engaging and effective." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachingMethods.map((m, i) => (
              <motion.div
                key={m.title}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl mb-4">{m.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white font-poppins mb-2">{m.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Calendar */}
      <section id="calendar" className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader badge="2025 Academic Year" title="Academic" highlight="Calendar" />
          <div className="grid md:grid-cols-3 gap-6">
            {termDates.map((term, i) => (
              <motion.div
                key={term.term}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold mb-4 font-poppins">
                  T{i + 1}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white font-poppins text-lg mb-3">{term.term}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <FaClock size={12} className="text-blue-500" />
                    <span>Opens: <strong>{term.start}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <FaClock size={12} className="text-red-500" />
                    <span>Closes: <strong>{term.end}</strong></span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-3 italic">{term.notes}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <a href="/downloads/term-dates-2025.pdf" className="inline-flex items-center gap-2 btn-secondary ripple">
              <FaDownload size={13} /> Download Full Academic Calendar
            </a>
          </motion.div>
        </div>
      </section>

      {/* Co-Curricular */}
      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader badge="Beyond the Classroom" title="Co-Curricular" highlight="Activities" subtitle="At NVHS, we believe that education extends far beyond the classroom. Our rich co-curricular programme develops character, talent, and leadership." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {clubs.map((club, i) => (
              <motion.div
                key={club.name}
                className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-blue-200"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <FaBookOpen size={14} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">{club.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{club.category}</div>
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
