import { Link } from 'react-router-dom';
import { Camera, MessageCircle, Globe, MapPin, Phone, Mail, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-mojito-bg border-t border-mojito-border/50 relative overflow-hidden pt-16 pb-8 z-10 print-hide">
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-mojito-primary/50 to-transparent"></div>
      <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-3/4 h-[300px] bg-mojito-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="text-mojito-primary"
              >
                <Utensils size={28} strokeWidth={1.5} />
              </motion.div>
              <span className="text-2xl font-bold tracking-widest uppercase text-white">Mojito</span>
            </Link>
            <p className="text-mojito-text-muted text-sm leading-relaxed mb-6">
              Elevating the standard of dining with a blend of modern aesthetics, premium ingredients, and flawless hospitality.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-mojito-bg-light border border-mojito-border flex items-center justify-center text-mojito-text-muted hover:text-white hover:border-white/30 hover:bg-white/5 transition-all" title="Instagram">
                <Camera size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-mojito-bg-light border border-mojito-border flex items-center justify-center text-mojito-text-muted hover:text-white hover:border-white/30 hover:bg-white/5 transition-all" title="Twitter">
                <MessageCircle size={18} />
              </a>
              <a href="https://mojito.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-mojito-bg-light border border-mojito-border flex items-center justify-center text-mojito-text-muted hover:text-white hover:border-white/30 hover:bg-white/5 transition-all">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm mb-6">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-mojito-text-muted hover:text-mojito-primary transition-colors text-sm font-light">Our Menu</Link>
              </li>
              <li>
                <Link to="/reserve" className="text-mojito-text-muted hover:text-mojito-primary transition-colors text-sm font-light">Book a Table</Link>
              </li>
              <li>
                <Link to="/tracking" className="text-mojito-text-muted hover:text-mojito-primary transition-colors text-sm font-light">Track Order</Link>
              </li>
              <li>
                <Link to="/login" className="text-mojito-text-muted hover:text-mojito-primary transition-colors text-sm font-light">Customer Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin size={18} className="text-mojito-primary shrink-0 mt-0.5" />
                <span className="text-mojito-text-muted text-sm font-light">123 Culinary Avenue, Food District,<br/>Krishnan Kovil</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone size={18} className="text-mojito-primary shrink-0" />
                <span className="text-mojito-text-muted text-sm font-light">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail size={18} className="text-mojito-primary shrink-0" />
                <span className="text-mojito-text-muted text-sm font-light">hello@mojito.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm mb-6">Opening Hours</h3>
            <ul className="space-y-4">
              <li className="flex justify-between w-full max-w-[200px] text-sm">
                <span className="text-mojito-text-muted font-light">Mon - Fri:</span>
                <span className="text-white font-medium">11 AM - 11 PM</span>
              </li>
              <li className="flex justify-between w-full max-w-[200px] text-sm">
                <span className="text-mojito-text-muted font-light">Sat - Sun:</span>
                <span className="text-white font-medium">10 AM - 12 AM</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-mojito-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-mojito-text-muted text-xs font-light tracking-wider">
            &copy; {new Date().getFullYear()} Mojito Restaurant & Bar. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-mojito-text-muted font-light">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
