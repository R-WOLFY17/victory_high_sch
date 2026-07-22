import { Link } from 'react-router-dom';
import {
  FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaWhatsapp,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight,
} from 'react-icons/fa';
import { schoolInfo } from '../../data/schoolData';

const quickLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Student Life', path: '/student-life' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'News & Events', path: '/news' },
  { label: 'Downloads', path: '/downloads' },
  { label: 'Contact Us', path: '/contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl font-poppins">V</span>
              </div>
              <div>
                <div className="font-bold text-white font-poppins">Nyenga Victory</div>
                <div className="text-xs text-emerald-400">High School</div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              A community school in Ssunga, Nyenga, Buikwe — producing responsible, disciplined and
              self-motivated members of the wider community.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaFacebookF, href: '#', label: 'Facebook' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaYoutube, href: '#', label: 'YouTube' },
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaWhatsapp, href: `https://wa.me/${schoolInfo.whatsapp}`, label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-5 font-poppins">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-sm transition-colors group"
                  >
                    <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Motto + Dashboard link */}
          <div>
            <h3 className="font-semibold text-white mb-5 font-poppins">School Motto</h3>
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 mb-5">
              <p className="text-yellow-400 font-extrabold text-2xl font-poppins italic mb-2">
                "Now or Never"
              </p>
              <p className="text-blue-200 text-xs leading-relaxed italic">
                "Victory is not just a destination, but a journey of growth, learning and self-discovery."
              </p>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-sm transition-colors group"
            >
              <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
              Admin Dashboard
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-5 font-poppins">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <FaMapMarkerAlt className="text-emerald-400 mt-1 flex-shrink-0" size={14} />
                <p className="text-slate-400 text-sm">{schoolInfo.address}</p>
              </li>
              <li>
                <a href={`tel:${schoolInfo.phone}`} className="flex gap-3 text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                  <FaPhone className="text-emerald-400 mt-0.5 flex-shrink-0" size={13} />
                  {schoolInfo.phone}
                </a>
              </li>
              <li>
                <a href={`tel:${schoolInfo.phone2}`} className="flex gap-3 text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                  <FaPhone className="text-emerald-400 mt-0.5 flex-shrink-0" size={13} />
                  {schoolInfo.phone2}
                </a>
              </li>
              <li>
                <a href={`tel:${schoolInfo.phone3}`} className="flex gap-3 text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                  <FaPhone className="text-emerald-400 mt-0.5 flex-shrink-0" size={13} />
                  {schoolInfo.phone3}
                </a>
              </li>
              <li>
                <a href={`mailto:${schoolInfo.email}`} className="flex gap-3 text-slate-400 hover:text-emerald-400 text-sm transition-colors break-all">
                  <FaEnvelope className="text-emerald-400 mt-0.5 flex-shrink-0" size={13} />
                  {schoolInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container-custom py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500">
          <p>© {year} {schoolInfo.name}. All rights reserved.</p>
          <p className="text-slate-600 italic text-xs">Ssunga, Nyenga, Buikwe District, Uganda</p>
        </div>
      </div>
    </footer>
  );
}
