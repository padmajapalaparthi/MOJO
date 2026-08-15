import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Utensils, ShoppingBag, User, LogOut, Package, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

const Layout = () => {
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-mojito-bg text-mojito-text selection:bg-mojito-primary selection:text-white">
      {/* Navbar - Glassmorphism Premium */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-mojito-bg-glass border-b border-mojito-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="text-mojito-primary"
              >
                <Utensils size={28} strokeWidth={1.5} />
              </motion.div>
              <span className="text-2xl font-bold tracking-widest uppercase text-white">Mojito</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <Link to="/" className="relative p-2 text-mojito-text-muted hover:text-mojito-primary transition-colors flex items-center gap-2">
                <Home size={20} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest font-bold hidden sm:inline">Home</span>
              </Link>
              {user && (
                <Link to="/tracking" className="relative p-2 text-mojito-text-muted hover:text-mojito-primary transition-colors flex items-center gap-2">
                  <Package size={20} strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-widest font-bold hidden sm:inline">Orders</span>
                </Link>
              )}
              <Link to="/checkout" className="relative p-2 text-mojito-text-muted hover:text-mojito-primary transition-colors">
                <ShoppingBag size={24} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-mojito-bg bg-mojito-primary rounded-full min-w-5 text-center shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              {user ? (
                <div className="flex items-center gap-6">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-sm tracking-widest font-medium text-mojito-primary hover:text-white transition-colors uppercase">
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center gap-2 text-sm font-medium text-white border border-mojito-border px-4 py-2 rounded-full">
                    <User size={16} className="text-mojito-primary" />
                    {user.name.split(' ')[0]}
                  </div>
                  <button onClick={handleSignOut} className="text-sm font-medium text-mojito-text-muted hover:text-rose-500 transition-colors p-2">
                    <LogOut size={20} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-mojito-text-muted hover:text-white transition-colors uppercase tracking-widest">
                  Log in
                </Link>
              )}
              <Link to="/reserve" className="text-sm font-semibold bg-mojito-primary text-mojito-bg px-6 py-3 rounded-full hover:bg-mojito-primary-hover transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] hover:-translate-y-0.5 hidden sm:block uppercase tracking-widest">
                Book Table
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex-1 flex flex-col"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Layout;
