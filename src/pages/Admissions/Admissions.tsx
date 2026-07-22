import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import { admissionSteps, faqs, schoolInfo } from '../../data/schoolData';
import CTASection from '../../components/sections/CTASection';
import { FaCheckCircle, FaDownload, FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-700 group transition-colors"
      >
        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-white text-sm pr-4">{q}</span>
        <FaChevronDown
          size={13}
          className={`flex-shrink-0 text-blue-500 group-hover:text-white transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Admissions() {
  return (
    <>
      <Helmet>
        <title>Admissions — {schoolInfo.name}</title>
        <meta name="description" content={`Learn how to join ${schoolInfo.name}. Admission process, requirements, and fees information.`} />
      </Helmet>

      <PageHero
        title="Admissions"
        subtitle="Everything you need to know about joining the Nyenga Victory High School family."
        breadcrumbs={[{ label: 'Admissions' }]}
      />

      {/* How to Apply */}
      <section id="process" className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader
            badge="How to Apply"
            title="Admission"
            highlight="Procedure"
            subtitle="Our admission process is straightforward and transparent. Follow these steps to secure a place at NVHS."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admissionSteps.map((step, i) => (
              <motion.div
                key={step.step}
                className="relative p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-lg font-poppins mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white font-poppins mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact prompt */}
          <motion.div
            className="mt-10 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white font-poppins text-lg mb-1">
                Ready to apply? Visit us or call today.
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Admission forms are available at the school office — Ssunga, Nyenga, Buikwe District.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <a href={`tel:${schoolInfo.phone}`} className="btn-primary flex items-center gap-2 text-sm ripple">
                <FaPhone size={12} /> Call Us
              </a>
              <a href={`mailto:${schoolInfo.email}`} className="btn-secondary flex items-center gap-2 text-sm ripple">
                <FaEnvelope size={12} /> Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requirements */}
      <section id="requirements" className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader
            badge="What You Need"
            title="Admission"
            highlight="Requirements"
            subtitle="Ensure you have all the required documents ready before visiting the admissions office."
          />
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-lg">S1</div>
                <h3 className="text-lg font-bold font-poppins text-slate-900 dark:text-white">For S1 Entry (O-Level)</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Completed Primary Seven (P7)',
                  'Primary Leaving Examination (PLE) results slip',
                  'Birth certificate (original + photocopy)',
                  '2 recent passport-size photographs',
                  'Completed admission application form',
                  'Parent/guardian national ID (photocopy)',
                  'Previous school report card',
                  'Entrance assessment — English, Maths & Science',
                ].map(req => (
                  <li key={req} className="flex items-start gap-3">
                    <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={14} />
                    <span className="text-slate-600 dark:text-slate-300 text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg">S5</div>
                <h3 className="text-lg font-bold font-poppins text-slate-900 dark:text-white">For S5 Entry (A-Level)</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'UCE results slip with at least 6 passes',
                  'Minimum Credit 3 in chosen principal subjects',
                  'UCE results slip (original + photocopy)',
                  '2 recent passport-size photographs',
                  'Birth certificate (original + photocopy)',
                  'Completed admission application form',
                  'Parent/guardian national ID (photocopy)',
                  'Subject combination selection form',
                ].map(req => (
                  <li key={req} className="flex items-start gap-3">
                    <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={14} />
                    <span className="text-slate-600 dark:text-slate-300 text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* School Fees */}
      <section id="fees" className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader
            badge="Fees Structure"
            title="School"
            highlight="Fees"
            subtitle="Our fees represent excellent value for the quality of holistic education we provide."
          />
          <motion.div
            className="max-w-2xl mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold font-poppins text-slate-900 dark:text-white mb-3">Fees Information</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                For the current, up-to-date fees structure please contact our admissions office directly
                or download the official fees schedule. Fees vary by class level and are reviewed annually.
              </p>
            </div>

            {/* Contact details */}
            <div className="bg-white dark:bg-slate-700 rounded-xl p-5 space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" size={14} />
                <span>School Office — Ssunga, Nyenga, Buikwe District, Uganda</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <FaPhone className="text-emerald-500 flex-shrink-0" size={13} />
                <a href={`tel:${schoolInfo.phone}`} className="hover:text-blue-600 transition-colors">{schoolInfo.phone}</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <FaPhone className="text-emerald-500 flex-shrink-0" size={13} />
                <a href={`tel:${schoolInfo.phone2}`} className="hover:text-blue-600 transition-colors">{schoolInfo.phone2}</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <FaEnvelope className="text-yellow-500 flex-shrink-0" size={13} />
                <a href={`mailto:${schoolInfo.email}`} className="hover:text-blue-600 transition-colors break-all">{schoolInfo.email}</a>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="/downloads/fees-structure-2025.pdf" className="btn-primary flex items-center gap-2 ripple">
                <FaDownload size={13} /> Download Fees Schedule
              </a>
              <a href={`tel:${schoolInfo.phone}`} className="btn-secondary flex items-center gap-2 ripple">
                <FaPhone size={12} /> Call Admissions
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader badge="FAQs" title="Frequently Asked" highlight="Questions" />
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <FAQItem q={faq.question} a={faq.answer} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
