import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import { schoolInfo } from '../../data/schoolData';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type FormData = z.infer<typeof schema>;

const officeHours = [
  { day: 'Monday – Friday', hours: '8:00 AM – 5:00 PM' },
  { day: 'Saturday', hours: '9:00 AM – 1:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log('Contact form:', data);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — {schoolInfo.name}</title>
        <meta name="description" content={`Get in touch with ${schoolInfo.name}. Contact us by phone, email, or visit our campus.`} />
      </Helmet>

      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out with any questions or enquiries."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader badge="Get In Touch" title="We're Here" highlight="to Help" />

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact info */}
            <div className="space-y-5">
              {[
                { icon: FaMapMarkerAlt, label: 'Address', value: schoolInfo.address, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
                { icon: FaPhone, label: 'Phone', value: `${schoolInfo.phone}\n${schoolInfo.phone2}\n+256 702 774 552`, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
                { icon: FaEnvelope, label: 'Email', value: schoolInfo.email, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
                    <p className="text-slate-900 dark:text-white text-sm whitespace-pre-line leading-relaxed">{item.value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Office Hours */}
              <motion.div
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex-shrink-0">
                    <FaClock size={16} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Office Hours</p>
                </div>
                <div className="space-y-2 ml-14">
                  {officeHours.map(oh => (
                    <div key={oh.day} className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{oh.day}</span>
                      <span className={`font-medium ${oh.hours === 'Closed' ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{oh.hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Social links */}
              <motion.div
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: FaFacebookF, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
                    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
                    { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
                    { icon: FaWhatsapp, href: `https://wa.me/${schoolInfo.whatsapp}`, label: 'WhatsApp', color: 'hover:bg-green-600' },
                  ].map(({ icon: Icon, href, label, color }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 ${color} hover:text-white transition-all duration-200`}
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Contact form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                      <FaCheckCircle className="text-emerald-500" size={36} />
                    </div>
                    <h3 className="text-2xl font-bold font-poppins text-slate-900 dark:text-white mb-3">Message Sent!</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Thank you for getting in touch. We will respond to your enquiry within 1-2 working days.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 btn-primary"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xl font-bold font-poppins text-slate-900 dark:text-white mb-2">Send Us a Message</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                      <input type="text" placeholder="Your name" {...register('name')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address *</label>
                      <input type="email" placeholder="your@email.com" {...register('email')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                      <input type="tel" placeholder="+256 700 000 000" {...register('phone')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject *</label>
                      <input type="text" placeholder="How can we help?" {...register('subject')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message *</label>
                    <textarea rows={5} placeholder="Your message..." {...register('message')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base ripple disabled:opacity-70"
                  >
                    {isSubmitting
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                      : <><FaPaperPlane size={14} /> Send Message</>
                    }
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-slate-100 dark:bg-slate-950">
        <div className="h-80 relative">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-800 dark:to-slate-900">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="font-bold text-slate-700 dark:text-white text-xl mb-2">Find Us on the Map</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">{schoolInfo.address}</p>
              <a
                href="https://maps.google.com?q=Ssunga+Nyenga+Buikwe+Uganda"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 btn-primary text-sm"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
