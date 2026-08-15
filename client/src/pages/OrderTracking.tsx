import { useState, useEffect } from 'react';
import { Clock, ChefHat, Truck, CheckCircle2, Receipt, Printer, X, Package, ArrowLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const OrderTracking = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const { data } = await api.get('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data && data.length > 0) {
        const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(sorted);
        
        // If an order is currently selected, update its data seamlessly in the background
        if (selectedOrder) {
          const updatedSelectedOrder = sorted.find((o: any) => o._id === selectedOrder._id);
          if (updatedSelectedOrder) {
            setSelectedOrder(updatedSelectedOrder);
          }
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); 
    return () => clearInterval(interval);
  }, [navigate, selectedOrder]);

  const steps = [
    { id: 'Pending', title: 'Order Placed', icon: Clock },
    { id: 'Preparing', title: 'Preparing', icon: ChefHat },
    { id: 'Dispatched', title: 'En Route', icon: Truck },
    { id: 'Delivered', title: 'Delivered', icon: CheckCircle2 },
  ];

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Preparing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Dispatched': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'Delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-mojito-bg print-hide">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mojito-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-mojito-bg relative overflow-hidden print-hide">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mojito-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <div className="mb-6 inline-flex p-6 rounded-full bg-mojito-bg-light border border-mojito-border">
            <Package size={48} className="text-mojito-text-muted" strokeWidth={1} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">No Active Orders</h2>
          <p className="text-mojito-text-muted mb-8 text-lg font-light">Your palate awaits its next indulgence.</p>
          <button onClick={() => navigate('/')} className="bg-mojito-primary hover:bg-mojito-primary-hover text-mojito-bg px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]">
            Explore Menu
          </button>
        </motion.div>
      </div>
    );
  }

  // --- DETAIL VIEW ---
  if (selectedOrder) {
    const currentStepIndex = steps.findIndex(s => s.id === selectedOrder.status);
    const subtotal = selectedOrder.totalAmount || 0;
    const taxRate = 0.05;
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;

    return (
      <>
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              .print-area, .print-area * { visibility: visible; }
              .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; background-color: white !important; color: black !important; }
              .print-hide { display: none !important; }
              @page { margin: 0; }
            }
          `}
        </style>

        <div className="flex-1 flex flex-col items-center py-10 p-6 bg-mojito-bg relative overflow-hidden print-hide min-h-screen">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-mojito-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-2xl w-full relative z-10">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-2 text-mojito-text-muted hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={16} /> Back to Orders
            </button>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-mojito-bg-light/80 backdrop-blur-md rounded-3xl shadow-2xl border border-mojito-border p-10 mb-8"
            >
              <div className="flex justify-between items-center mb-12 pb-8 border-b border-mojito-border/50">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-mojito-text-muted mb-1">Order Number</p>
                  <p className="text-xl font-bold text-white">#{selectedOrder._id.slice(-6)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold tracking-widest uppercase text-mojito-text-muted mb-1">Est. Arrival</p>
                  <p className="text-xl font-bold text-mojito-primary">45-60 min</p>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="relative mb-16 mt-8">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-mojito-border -translate-y-1/2 rounded-full"></div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute top-1/2 left-0 h-1 bg-mojito-primary -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                ></motion.div>
                
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <motion.div 
                          animate={isCurrent ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0 rgba(234,179,8,0)", "0 0 20px rgba(234,179,8,0.5)", "0 0 0 rgba(234,179,8,0)"] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={clsx(
                            "w-14 h-14 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ring-4 ring-mojito-bg-light",
                            isCompleted ? "bg-mojito-primary text-mojito-bg" : "bg-mojito-bg border border-mojito-border text-mojito-text-muted",
                          )}
                        >
                          <Icon size={24} />
                        </motion.div>
                        <span className={clsx(
                          "mt-4 text-xs font-bold uppercase tracking-widest absolute -bottom-10 w-28 text-center transition-colors duration-300",
                          isCurrent ? "text-mojito-primary" : (isCompleted ? "text-white" : "text-mojito-text-muted")
                        )}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-20 bg-mojito-bg rounded-2xl p-8 border border-mojito-border/50 shadow-inner">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-white uppercase tracking-widest text-sm">Order Summary</h3>
                  <button 
                    onClick={() => setShowInvoice(true)}
                    className="flex items-center gap-2 text-mojito-primary hover:text-white bg-mojito-primary/10 hover:bg-mojito-primary/20 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    <Receipt size={14} />
                    View Bill
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-base">
                      <span className="text-mojito-text-muted font-light"><span className="text-mojito-primary font-bold mr-2">{item.quantity}x</span>{item.menuItem?.name || 'Unknown Item'}</span>
                      <span className="text-white font-medium">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-mojito-border/50 pt-5 mt-5 flex justify-between items-center">
                    <span className="text-mojito-text-muted font-bold uppercase tracking-widest text-sm">Subtotal</span>
                    <span className="text-white font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Invoice Modal */}
        <AnimatePresence>
          {showInvoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:static print:bg-white print:block">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowInvoice(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm print-hide"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white text-black w-full max-w-[450px] relative z-10 shadow-2xl rounded-sm overflow-hidden print-area print:shadow-none"
              >
                <div className="absolute top-4 right-4 flex gap-2 print-hide">
                  <button onClick={handlePrint} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors" title="Print Bill">
                    <Printer size={16} />
                  </button>
                  <button onClick={() => setShowInvoice(false)} className="p-2 bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-800 rounded-lg transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-8 font-mono text-sm leading-relaxed">
                  <div className="text-center mb-8 border-b-2 border-dashed border-gray-300 pb-6">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-1">Mojito</h2>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Restaurant</p>
                    <p className="text-gray-600 mt-2">Krishnan Kovil</p>
                    <p className="text-gray-600">Tel: +91 9876543210</p>
                    <p className="text-gray-600">GSTIN: 22AAAAA0000A1Z5</p>
                  </div>

                  <div className="flex justify-between mb-6 text-gray-600">
                    <div>
                      <p>Bill No: #{selectedOrder._id.slice(-8).toUpperCase()}</p>
                      <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                      <p>Time: {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="text-right">
                      <p>Order: Takeaway</p>
                      <p>Status: {selectedOrder.status}</p>
                    </div>
                  </div>

                  <table className="w-full mb-6 text-left border-collapse">
                    <thead>
                      <tr className="border-y-2 border-dashed border-gray-300">
                        <th className="py-2 font-bold w-1/2">Item</th>
                        <th className="py-2 font-bold text-center">Qty</th>
                        <th className="py-2 font-bold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2 pr-2">{item.menuItem?.name || 'Unknown Item'}</td>
                          <td className="py-2 text-center">{item.quantity}</td>
                          <td className="py-2 text-right">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="space-y-1 text-right mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (5% GST):</span>
                      <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-lg mt-2 pt-2 border-t-2 border-dashed border-gray-300">
                      <span>GRAND TOTAL:</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-center mt-12 text-gray-500 text-xs">
                    <p className="font-bold uppercase tracking-widest text-black mb-1">Thank you for dining with Mojito!</p>
                    <p>Please visit us again.</p>
                    <p className="mt-4">** This is a computer generated invoice **</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="flex-1 flex flex-col items-center py-10 p-6 bg-mojito-bg relative overflow-hidden print-hide min-h-screen">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-mojito-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-3xl w-full relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-white mb-10 tracking-tight"
        >
          My Orders
        </motion.h1>

        <div className="space-y-4">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="bg-mojito-bg-light/80 backdrop-blur-md rounded-2xl border border-mojito-border p-6 cursor-pointer hover:border-mojito-primary/50 transition-colors group relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-mojito-bg border border-mojito-border flex items-center justify-center text-mojito-text-muted group-hover:text-mojito-primary transition-colors">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold text-lg">Order #{order._id.slice(-6)}</h3>
                        <span className={clsx(
                          "px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          getStatusColor(order.status)
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-mojito-text-muted text-sm">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-xs text-mojito-text-muted uppercase tracking-widest font-bold mb-1">Total</p>
                      <p className="text-lg font-bold text-mojito-primary">₹{(order.totalAmount || 0).toFixed(2)}</p>
                    </div>
                    <ChevronRight size={24} className="text-mojito-border group-hover:text-mojito-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
