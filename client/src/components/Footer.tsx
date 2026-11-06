import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact-us" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pb-12 border-b border-slate-800">
          
          {/* Column 1 - Join Us */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
                <HeartHandshake className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">Senabil</span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering displaced families, rebuilding essential water and schooling, and connecting passionate volunteers directly to relief projects across the Gaza Strip.
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Join Our Mission
              </h4>
              <p className="text-sm font-medium text-slate-200 mb-4">
                Do you already have an account?
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition border border-slate-700 inline-flex items-center space-x-1.5"
                >
                  <span>Login</span>
                </Link>
                <Link
                  to="/choose-role"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-md shadow-emerald-900/40 inline-flex items-center space-x-1.5"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase text-sm border-l-2 border-emerald-500 pl-3">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors inline-block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-emerald-400 transition-colors inline-block py-1">
                  Projects
                </Link>
              </li>
              <li>
                <span className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer inline-block py-1">
                  Usage Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer inline-block py-1">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer inline-block py-1">
                  Terms Of Service
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Us */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase text-sm border-l-2 border-emerald-500 pl-3">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@senabil.org" className="hover:text-white transition">
                  contact@senabil.org
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Globe className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <a href="https://senabil.org" target="_blank" rel="noreferrer" className="hover:text-white transition inline-flex items-center space-x-1">
                  <span>www.senabil.org</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>+970 59 900 0001</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Al-Rimal District, Omar Al-Mukhtar St, Gaza City, Palestine</span>
              </li>
            </ul>

            {/* Social Channels */}
            <div className="pt-2">
              <div className="flex space-x-3">
                <span className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 transition flex items-center justify-center text-xs font-bold text-white cursor-pointer" title="Facebook">
                  f
                </span>
                <span className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 transition flex items-center justify-center text-xs font-bold text-white cursor-pointer" title="Instagram">
                  in
                </span>
                <span className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 transition flex items-center justify-center text-xs font-bold text-white cursor-pointer" title="LinkedIn">
                  li
                </span>
                <span className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 transition flex items-center justify-center text-xs font-bold text-white cursor-pointer" title="YouTube">
                  yt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Senabil Community Impact Platform. Humanitarian NGO operations.</p>
          <p className="mt-2 sm:mt-0">Built with Node.js, Express, TypeScript, Prisma, PostgreSQL & React</p>
        </div>
      </div>
    </footer>
  );
};

