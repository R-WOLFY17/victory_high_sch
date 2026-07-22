import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { schoolInfo } from '../../data/schoolData';

const slides = [
  {
    id: 1,
    bg: 'from-blue-900 via-blue-800 to-slate-900',
    image: '/images/hero/hero1.jpg',
    badge: '"Now or Never"',
    title: 'Shaping Future',
    highlight: 'Leaders',
    subtitle: 'Producing responsible, disciplined, self-motivated and cultured members of the wide community.',
  },
  {
    id: 2,
    bg: 'from-slate-900 via-emerald-900 to-slate-900',
    image: '/images/hero/hero2.jpg',
    badge: 'Excellence & Hard Work',
    title: 'Victory Is a',
    highlight: 'Journey',
    subtitle: '"Victory is not just a destination, but a journey of growth, learning and self-discovery."',
  },
  {
    id: 3,
    bg: 'from-slate-900 via-blue-900 to-emerald-900',
    image: '/images/hero/hero3.jpg',
    badge: 'Community School',
    title: 'Where Every',
    highlight: 'Child Belongs',
    subtitle: 'Welcoming all individuals of different religious backgrounds — united by teamwork, integrity and servant hood.',
  },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
}));

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent(p => (p + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Slide background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              filter: 'brightness(0.35)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Animated particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="container-custom relative z-10 pt-28 pb-16">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <motion.span
                className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-yellow-400 font-semibold mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                {slide.badge}
              </motion.span>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-poppins text-white leading-tight mb-3">
                {slide.title}
                <br />
                <span className="text-gradient-gold">{slide.highlight}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-blue-200 text-lg md:text-xl max-w-2xl leading-relaxed mb-4">
                {slide.subtitle}
              </p>

              {/* Motto */}
              <p className="text-yellow-400/80 italic text-base mb-8 font-medium">
                "{schoolInfo.motto}" — Victory is a journey, not just a destination.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link to="/admissions" className="btn-gold ripple flex items-center gap-2 py-3 px-7 text-base">
                  Admission Info <FaArrowRight size={14} />
                </Link>
                <Link to="/about" className="glass border border-white/30 text-white px-7 py-3 rounded-full font-semibold text-base flex items-center gap-2 hover:bg-white/20 transition-all">
                  <FaPlay size={12} className="text-yellow-400" /> Discover More
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center gap-6 mt-14">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-10 bg-yellow-400' : 'w-4 bg-white/30'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={prev}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              aria-label="Previous slide"
            >
              <FaChevronLeft size={13} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              aria-label="Next slide"
            >
              <FaChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
