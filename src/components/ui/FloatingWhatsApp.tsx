import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { schoolInfo } from '../../data/schoolData';

export default function FloatingWhatsApp() {
  const message = encodeURIComponent('Hello! I am interested in learning more about Nyenga Victory High School.');
  const href = `https://wa.me/${schoolInfo.whatsapp}?text=${message}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 transition-colors"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaWhatsapp size={28} />
    </motion.a>
  );
}
