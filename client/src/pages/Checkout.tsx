import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, CreditCard, ChevronRight } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please log in to place an order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/orders', {
        orderItems: cartItems,
        specialInstructions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/track');
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-mojito-bg relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mojito-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="bg-mojito-bg-light w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-mojito-border">
            <ShoppingBag size={32} className="text-mojito-text-muted" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Your cart is empty</h2>
          <p className="text-mojito-text-muted mb-8 font-light text-lg">Add some delicious items from our menu.</p>
          <button 
            onClick={() => navigate('/menu')} 
            className="bg-mojito-primary hover:bg-mojito-primary-hover text-mojito-bg px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
          >
            Explore Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-mojito-bg py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-mojito-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-white mb-10 tracking-tight"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="bg-mojito-bg-light/80 backdrop-blur-md rounded-3xl p-8 border border-mojito-border shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest border-b border-mojito-border pb-4">Order Items</h2>
              <div className="space-y-6">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item._id} 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                      className="flex items-center gap-6 p-4 rounded-2xl border border-mojito-border bg-mojito-bg hover:border-mojito-primary/30 transition-colors group"
                    >
                      <div className="w-24 h-24 bg-mojito-bg-light rounded-xl overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-mojito-text-muted text-xs uppercase tracking-widest text-center">No Img</div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-white text-lg">{item.name}</h3>
                          <p className="text-mojito-primary font-bold mt-1">₹{item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3 bg-mojito-bg-light p-1 rounded-xl border border-mojito-border">
                            <button 
                              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-mojito-border transition-colors font-medium"
                            >-</button>
                            <span className="w-6 text-center font-bold text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-mojito-border transition-colors font-medium"
                            >+</button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="p-2 text-mojito-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="bg-mojito-bg-light/80 backdrop-blur-md rounded-3xl p-8 border border-mojito-border shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest border-b border-mojito-border pb-4">Special Instructions</h2>
              <textarea
                rows={3}
                className="w-full p-4 bg-mojito-bg border border-mojito-border rounded-xl focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary text-white placeholder-mojito-text-muted outline-none transition-all resize-none"
                placeholder="Any allergies, dietary restrictions, or special requests?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="bg-mojito-bg-light/80 backdrop-blur-md rounded-3xl p-8 border border-mojito-border shadow-xl sticky top-28">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest border-b border-mojito-border pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-mojito-text-muted">
                  <span>Subtotal</span>
                  <span className="text-white">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-mojito-text-muted">
                  <span>Taxes & Fees (5%)</span>
                  <span className="text-white">₹{(cartTotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-mojito-text-muted pb-4 border-b border-mojito-border">
                  <span>Delivery Fee</span>
                  <span className="text-mojito-primary font-medium">Free</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-sm font-bold tracking-widest uppercase text-white">Total</span>
                  <span className="text-3xl font-extrabold text-mojito-primary">₹{(cartTotal * 1.05).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-mojito-primary hover:bg-mojito-primary-hover text-mojito-bg py-4 px-6 rounded-xl font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-mojito-bg"></div>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Place Order
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Add ShoppingBag import if missing
import { ShoppingBag } from 'lucide-react';

export default Checkout;
