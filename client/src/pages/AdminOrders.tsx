import { useState, useEffect } from 'react';
import { Clock, ChefHat, Truck, CheckCircle2, ChevronRight, X, User } from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); 
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const columns = [
    { id: 'Pending', title: 'New Orders', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500/30' },
    { id: 'Preparing', title: 'In Kitchen', icon: ChefHat, color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500/30' },
    { id: 'Dispatched', title: 'Out for Delivery', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500/30' },
    { id: 'Delivered', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500/30' },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mojito-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Order Fulfillment</h1>
        <p className="text-mojito-text-muted mt-2 font-light">Drag-free dynamic order management system.</p>
      </div>

      <div className="flex-1 overflow-x-auto hide-scrollbar pb-8">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col, index) => {
            const colOrders = orders.filter(o => o.status === col.id);
            const Icon = col.icon;
            
            return (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={col.id} 
                className="flex flex-col w-[340px] bg-mojito-bg-light/40 backdrop-blur-md rounded-[2rem] border border-mojito-border/50 overflow-hidden shadow-2xl relative"
              >
                {/* Column Header Glow */}
                <div className={clsx("absolute top-0 left-0 w-full h-1", col.bg)}></div>

                <div className="p-6 border-b border-mojito-border/50 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded-xl bg-black/40 shadow-inner border border-white/5", col.color)}>
                      <Icon size={20} />
                    </div>
                    <h2 className={clsx("font-bold tracking-widest uppercase text-sm", col.color)}>{col.title}</h2>
                  </div>
                  <span className={clsx("text-xs font-black px-3 py-1 rounded-full bg-black/40 border border-white/10 shadow-inner", col.color)}>
                    {colOrders.length}
                  </span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 hide-scrollbar">
                  <AnimatePresence>
                    {colOrders.map(order => (
                      <motion.div 
                        layoutId={order._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={order._id} 
                        className="bg-black/40 backdrop-blur-xl p-1 rounded-3xl shadow-xl border border-white/10 relative group hover:border-white/20 transition-all duration-300"
                      >
                        <div className="p-5">
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="text-xs font-black text-white/50 uppercase tracking-widest block mb-1">
                                Order #{order._id.slice(-6)}
                              </span>
                              <span className="text-xs font-medium text-mojito-text-muted flex items-center gap-1">
                                <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            {col.id !== 'Delivered' && col.id !== 'Cancelled' && (
                              <button 
                                onClick={() => updateStatus(order._id, 'Cancelled')} 
                                className="p-2 text-mojito-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-50 hover:opacity-100"
                                title="Cancel Order"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>

                          {/* Customer Info */}
                          <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-mojito-primary/20 flex items-center justify-center text-mojito-primary">
                              <User size={14} />
                            </div>
                            <h3 className="font-bold text-white text-sm truncate">{order.user?.name || 'Guest Customer'}</h3>
                          </div>
                          
                          {/* Items List */}
                          <div className="space-y-3 mb-6">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-3 text-sm">
                                <span className="font-black text-mojito-primary bg-mojito-primary/10 px-2 py-0.5 rounded text-xs">{item.quantity}x</span>
                                <span className="text-white/80 font-light leading-tight mt-0.5">{item.menuItem?.name || 'Unknown Item'}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Footer / Total */}
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-mojito-text-muted uppercase tracking-widest">Total Amount</span>
                            <span className="font-black text-lg text-white">₹{order.totalAmount?.toFixed(2) || 0}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {col.id === 'Pending' && (
                          <button 
                            onClick={() => updateStatus(order._id, 'Preparing')} 
                            className="w-full py-4 text-xs font-black tracking-widest uppercase bg-orange-500 hover:bg-orange-600 text-white rounded-[1.4rem] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                          >
                            Send to Kitchen <ChevronRight size={16} />
                          </button>
                        )}
                        {col.id === 'Preparing' && (
                          <button 
                            onClick={() => updateStatus(order._id, 'Dispatched')} 
                            className="w-full py-4 text-xs font-black tracking-widest uppercase bg-blue-500 hover:bg-blue-600 text-white rounded-[1.4rem] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                          >
                            Dispatch Order <ChevronRight size={16} />
                          </button>
                        )}
                        {col.id === 'Dispatched' && (
                          <button 
                            onClick={() => updateStatus(order._id, 'Delivered')} 
                            className="w-full py-4 text-xs font-black tracking-widest uppercase bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.4rem] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                          >
                            Mark Delivered <CheckCircle2 size={16} />
                          </button>
                        )}
                        {col.id === 'Delivered' && (
                          <div className="w-full py-4 text-xs font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-500 rounded-[1.4rem] flex items-center justify-center gap-2 border border-emerald-500/20">
                            Completed <CheckCircle2 size={16} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {colOrders.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center py-16 text-white/20 flex flex-col items-center gap-4"
                    >
                      <div className="p-4 rounded-full bg-black/20">
                        <Icon size={32} strokeWidth={1} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">No Orders</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
