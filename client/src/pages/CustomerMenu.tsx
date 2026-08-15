import { useState, useEffect } from 'react';
import { Search, Info, Plus } from 'lucide-react';
import api from '../api';
import clsx from 'clsx';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerMenu = () => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const categories = ['All', 'Appetizers', 'Mains', 'Desserts', 'Drinks'];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data } = await api.get('/api/menu');
        setMenuItems(data.filter((item: any) => item.isAvailable));
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden min-h-screen bg-[#050505]">
      {/* Rich Dynamic Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-mojito-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/5 blur-[150px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
      </div>

      {/* Reactive Glow based on Hover */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-mojito-primary/5 via-transparent to-transparent opacity-50 blur-3xl"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10 w-full flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <span className="text-mojito-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">The Culinary Experience</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white uppercase drop-shadow-2xl">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-mojito-primary via-yellow-200 to-mojito-primary">Taste</span>
          </h1>
        </motion.div>
        
        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-xl relative mt-10 group"
        >
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/40 group-focus-within:text-mojito-primary transition-colors">
            <Search size={22} />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full text-white placeholder-white/30 focus:outline-none focus:border-mojito-primary/50 focus:bg-white/10 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-white/20 text-sm tracking-widest uppercase font-medium"
            placeholder="Search our collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
      </div>

      <div className="flex-1 w-full z-10 relative flex flex-col">
        {/* Categories Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full overflow-x-auto hide-scrollbar py-6 mb-4"
        >
          <div className="flex px-4 sm:px-8 gap-4 min-w-max mx-auto justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="relative px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 outline-none"
              >
                {activeCategory === category && (
                  <motion.div 
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-mojito-primary rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={clsx("relative z-10 transition-colors duration-300", activeCategory === category ? "text-black" : "text-white/60 hover:text-white")}>
                  {category}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Items Display */}
        <div className="flex-1 px-4 sm:px-8 pb-24 w-full max-w-[1600px] mx-auto">
          {loading ? (
            <div className="h-64 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mojito-primary shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    key={item._id}
                    onHoverStart={() => setHoveredItem(item._id)}
                    onHoverEnd={() => setHoveredItem(null)}
                    className="group relative h-[480px] rounded-[2rem] overflow-hidden bg-black/40 border border-white/5 backdrop-blur-md cursor-pointer hover:border-mojito-primary/30 transition-colors duration-500 shadow-2xl"
                  >
                    {/* Inner Glow Border effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_60px_rgba(234,179,8,0.1)] transition-opacity duration-500 z-10 pointer-events-none rounded-[2rem]"></div>

                    {/* Image Background */}
                    <div className="absolute inset-0 z-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 group-hover:rotate-1 opacity-60 group-hover:opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-black/60">
                          <span className="text-xs uppercase tracking-widest font-bold">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10 opacity-90 transition-opacity duration-500"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 items-end">
                      <div className="bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 text-white font-black tracking-widest shadow-xl">
                        ₹{item.price.toFixed(2)}
                      </div>
                      {item.stockQuantity > 0 ? (
                        <div className="bg-mojito-primary/90 backdrop-blur-md text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                          {item.stockQuantity} Left
                        </div>
                      ) : (
                        <div className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                          Sold Out
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col justify-end h-full transform transition-transform duration-500">
                      <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <span className="text-mojito-primary text-[10px] font-black uppercase tracking-[0.3em] mb-3 block opacity-80">
                          {item.category}
                        </span>
                        <h3 className="text-3xl font-black text-white leading-tight mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                          {item.name}
                        </h3>
                        <p className="text-white/60 text-sm font-light line-clamp-2 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {item.description}
                        </p>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.stockQuantity > 0) {
                              addToCart({ _id: item._id, name: item.name, price: item.price, quantity: 1, image: item.image });
                            }
                          }}
                          disabled={item.stockQuantity <= 0}
                          className="w-full bg-white text-black hover:bg-mojito-primary disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Plus size={16} />
                          {item.stockQuantity > 0 ? 'Add to Order' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-40 text-center"
            >
              <div className="w-24 h-24 mb-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                <Info size={40} className="text-white/30" strokeWidth={1} />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-widest">Nothing Found</h3>
              <p className="text-white/50 font-light text-xl max-w-md mx-auto">We couldn't find any culinary masterpieces matching your search.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMenu;
