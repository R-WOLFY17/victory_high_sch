import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPhone } from 'react-icons/fa';
import { schoolInfo } from '../../data/schoolData';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-2xl" />

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-poppins leading-tight mb-6">
            The Time is
            <br />
            <span className="text-yellow-400">Now or Never</span>
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            Join the Nyenga Victory High School family — a community school in Ssunga, Nyenga, Buikwe
            that welcomes everyone, champions hard work and teamwork, and produces responsible,
            self-motivated graduates ready to change the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/admissions"
              className="btn-gold flex items-center gap-2 text-base py-3.5 px-8 ripple"
            >
              Admission Info <FaArrowRight size={14} />
            </Link>
            <a
              href={`tel:${schoolInfo.phone}`}
              className="glass border border-white/30 text-white px-8 py-3.5 rounded-full font-semibold text-base flex items-center gap-2 hover:bg-white/20 transition-all"
            >
              <FaPhone size={14} /> Call Us Today
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
