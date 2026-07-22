import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaQuoteRight } from 'react-icons/fa';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import {
  schoolVision, schoolMission, schoolPhilosophy, schoolValues,
  schoolAims, schoolObjectives, leadership, schoolInfo,
} from '../../data/schoolData';
import CTASection from '../../components/sections/CTASection';

const timeline = [
  { year: '2024', event: 'Nyenga Victory High School is founded in Ssunga, Nyenga, with a bold vision and the motto "Now or Never".' },
  { year: '2024', event: 'First intake of students joins the school. Community enrolment opens to all religious backgrounds.' },
  { year: '2025', event: 'School expands facilities including science laboratory and ICT resources.' },
  { year: '2025', event: 'First Football team enters regional competitions. Environmental Club launched.' },
  { year: '2025', event: 'First cohort of O-Level candidates prepares for UCE examinations — the "Now or Never" generation.' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us — {schoolInfo.name}</title>
        <meta name="description" content={`Learn about ${schoolInfo.name} — our history, vision, mission, values, and leadership team in Ssunga, Nyenga, Uganda.`} />
      </Helmet>

      <PageHero
        title="About Us"
        subtitle="Discover the story, values, and people behind Nyenga Victory High School."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* Vision, Mission & Philosophy */}
      <section id="vision" className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader badge="Our Identity" title="Vision, Mission &" highlight="Philosophy" />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Our Vision', text: schoolVision, color: 'from-blue-600 to-blue-800', emoji: '👁️' },
              { title: 'Our Mission', text: schoolMission, color: 'from-emerald-600 to-emerald-800', emoji: '🎯' },
              { title: 'Our Philosophy', text: schoolPhilosophy, color: 'from-yellow-500 to-yellow-700', emoji: '💡' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-2xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className={`bg-gradient-to-br ${item.color} p-5 flex items-center gap-3`}>
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="text-white font-bold text-lg font-poppins">{item.title}</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6">
                  <FaQuoteRight className="text-slate-300 dark:text-slate-600 mb-3" size={20} />
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* School Values */}
      <section id="values" className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader
            badge="School Values"
            title="The Values That"
            highlight="Guide Us"
            subtitle="These core values define who we are as a community and shape the character of every NVHS student and staff member."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {schoolValues.map((v, i) => (
              <motion.div
                key={v.title}
                className={`rounded-2xl bg-gradient-to-br ${v.color} p-6 text-white shadow-lg card-hover`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-lg font-bold font-poppins mb-3">{v.title}</h3>
                <p className="text-white/85 text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Motto */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl px-10 py-8 shadow-xl">
              <p className="text-blue-300 text-sm uppercase tracking-widest mb-3">School Motto</p>
              <p className="text-white text-3xl md:text-4xl font-extrabold font-poppins mb-3">"Now or Never"</p>
              <p className="text-yellow-400 text-sm italic max-w-md mx-auto">
                "Victory is not just a destination, but a journey of growth, learning and self-discovery."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* History Timeline */}
      <section id="history" className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader badge="Our Journey" title="School" highlight="History" subtitle="From humble beginnings to a thriving community school — the NVHS story." />
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 dark:bg-blue-900 md:-translate-x-0.5" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center -translate-x-4 md:-translate-x-4 flex-shrink-0 z-10">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-10' : 'md:pr-10'}`}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md border border-slate-100 dark:border-slate-700">
                      <span className="text-blue-600 font-bold text-lg font-poppins">{item.year}</span>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{item.event}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader badge="Our Team" title="School" highlight="Leadership" subtitle="Dedicated, experienced leaders committed to the success of every student." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((person, i) => (
              <motion.div
                key={person.role}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="h-56 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center relative">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover object-top"
                    onError={e => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center text-4xl">👤</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 dark:text-white font-poppins">{person.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">{person.role}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">{person.qualifications}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed italic line-clamp-4">
                    "{person.message}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Aims & Objectives */}
      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader badge="Our Purpose" title="Aims &" highlight="Objectives" subtitle="The specific goals that drive every decision we make at Nyenga Victory High School." />
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold font-poppins text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-lg flex items-center justify-center text-sm">🎯</span>
                School Aims
              </h3>
              <ul className="space-y-3">
                {schoolAims.map((aim, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{aim}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold font-poppins text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-center text-sm">✅</span>
                School Objectives
              </h3>
              <ul className="space-y-3">
                {schoolObjectives.map((obj, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{obj}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
