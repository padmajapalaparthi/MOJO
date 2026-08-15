import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, CalendarDays, ShoppingBag, LogOut, LayoutGrid } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Tables', path: '/admin/tables', icon: LayoutGrid },
    { name: 'Menu', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Reservations', path: '/admin/reservations', icon: CalendarDays },
  ];

  return (
    <div className="flex h-screen bg-mojito-bg text-mojito-text font-sans selection:bg-mojito-primary selection:text-mojito-bg">
      {/* Sidebar - Premium Dark */}
      <aside className="w-72 bg-mojito-bg-light border-r border-mojito-border flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-mojito-border">
          <Link to="/admin" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              className="text-mojito-primary"
            >
              <UtensilsCrossed size={24} strokeWidth={1.5} />
            </motion.div>
            <span className="text-xl font-bold tracking-widest text-white uppercase">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group font-medium text-sm tracking-wide',
                  isActive 
                    ? 'bg-mojito-primary/10 text-mojito-primary shadow-[inset_4px_0_0_0_rgba(234,179,8,1)]' 
                    : 'text-mojito-text-muted hover:bg-mojito-border hover:text-white'
                )}
              >
                <Icon size={20} strokeWidth={1.5} className={clsx(isActive ? 'text-mojito-primary' : 'text-mojito-text-muted group-hover:text-white transition-colors')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-mojito-border">
          <button onClick={handleSignOut} className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-mojito-text-muted hover:bg-rose-500/10 hover:text-rose-500 transition-colors text-sm font-medium tracking-wide">
            <LogOut size={20} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-mojito-bg-glass backdrop-blur-xl border-b border-mojito-border flex items-center justify-between px-8 sticky top-0 z-10 md:hidden">
            <span className="font-bold tracking-widest uppercase">Admin</span>
        </header>
        
        <div className="flex-1 overflow-y-auto bg-mojito-bg relative">
          {/* Subtle gradient background decoration */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-mojito-primary/5 to-transparent pointer-events-none"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="p-8 relative z-10 h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
