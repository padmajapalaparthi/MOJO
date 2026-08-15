import { useState, useEffect } from 'react';
import { CalendarDays, Clock, Users, ArrowRight, Check, Plus, Package, CreditCard, User, Phone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Reservation = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    partySize: '2',
    guestName: '',
    guestPhone: '',
    guestProof: '',
    specialRequests: ''
  });
  
  const [availableTables, setAvailableTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const { data } = await axios.get('http://localhost:5000/api/reservations/myreservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(data);
      if (data.length === 0) {
        setView('form'); // Auto show form if no reservations
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleFindTables = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.partySize) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/tables/available', {
        date: formData.date,
        time: formData.time,
        partySize: Number(formData.partySize)
      });
      setAvailableTables(data);
      if (data.length === 0) {
        toast.error('No tables available for this time. Please try another time.');
      } else {
        setStep(2);
      }
    } catch (error) {
      toast.error('Failed to search tables');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedTable) return toast.error('Please select a table');
    if (!formData.guestName || !formData.guestPhone || !formData.guestProof) {
      return toast.error('Please fill in all guest details for verification');
    }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/reservations', {
        table: selectedTable,
        date: formData.date,
        time: formData.time,
        partySize: Number(formData.partySize),
        guestName: formData.guestName,
        guestPhone: formData.guestPhone,
        guestProof: formData.guestProof,
        specialRequests: formData.specialRequests
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Reservation submitted successfully!');
      
      // Reset form and go back to list
      setStep(1);
      setSelectedTable('');
      setFormData({
        date: '',
        time: '',
        partySize: '2',
        guestName: '',
        guestPhone: '',
        guestProof: '',
        specialRequests: ''
      });
      setView('list');
      fetchReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book reservation');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingReservations) {
    return (
      <div className="flex-1 bg-mojito-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mojito-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-mojito-bg relative overflow-hidden py-20 px-4 sm:px-6 min-h-screen">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mojito-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {view === 'list' && reservations.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">My Reservations</h1>
                <p className="text-mojito-text-muted mt-2 font-light">Track the status of your table bookings.</p>
              </div>
              <button 
                onClick={() => setView('form')}
                className="flex items-center gap-2 bg-mojito-primary hover:bg-mojito-primary-hover text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] uppercase tracking-widest text-xs"
              >
                <Plus size={16} /> Book Table
              </button>
            </div>

            <div className="grid gap-6">
              {reservations.map((res: any, idx: number) => (
                <div key={res._id} className="bg-mojito-bg-light/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-mojito-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        res.status === 'Confirmed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        res.status === 'Pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {res.status}
                      </span>
                      <span className="text-mojito-text-muted text-sm font-bold uppercase tracking-widest">
                        Table {res.table?.tableNumber || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2 text-white">
                        <CalendarDays size={18} className="text-mojito-primary" />
                        <span className="font-medium">{new Date(res.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Clock size={18} className="text-mojito-primary" />
                        <span className="font-medium">{res.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Users size={18} className="text-mojito-primary" />
                        <span className="font-medium">{res.partySize} Guests</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 min-w-[200px]">
                    <p className="text-xs text-mojito-text-muted font-bold uppercase tracking-widest mb-2">Guest Details</p>
                    <p className="text-white text-sm font-medium mb-1">{res.guestName}</p>
                    <p className="text-white/60 text-xs mb-1">{res.guestPhone}</p>
                    <p className="text-white/40 text-xs">ID: {res.guestProof}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              {reservations.length > 0 && (
                <button 
                  onClick={() => setView('list')}
                  className="text-mojito-primary text-sm font-bold uppercase tracking-widest hover:underline mb-8 inline-block"
                >
                  &larr; Back to My Reservations
                </button>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Reserve a Table</h1>
              <p className="text-mojito-text-muted text-lg max-w-xl mx-auto font-light">
                Secure your perfect dining experience. We block tables for a 2-hour window.
              </p>
            </div>

            <div className="bg-mojito-bg-light/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 p-6 md:p-10 border border-mojito-border">
              
              {step === 1 ? (
                <form onSubmit={handleFindTables} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-mojito-text-muted mb-2">Date</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mojito-primary">
                          <CalendarDays size={18} />
                        </div>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                          className="w-full bg-mojito-bg border border-mojito-border rounded-xl pl-11 pr-4 py-3.5 text-white focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mojito-text-muted mb-2">Time</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mojito-primary">
                          <Clock size={18} />
                        </div>
                        <input
                          type="time"
                          required
                          value={formData.time}
                          onChange={e => setFormData({...formData, time: e.target.value})}
                          className="w-full bg-mojito-bg border border-mojito-border rounded-xl pl-11 pr-4 py-3.5 text-white focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mojito-text-muted mb-2">Party Size</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mojito-primary">
                        <Users size={18} />
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        required
                        value={formData.partySize}
                        onChange={e => setFormData({...formData, partySize: e.target.value})}
                        className="w-full bg-mojito-bg border border-mojito-border rounded-xl pl-11 pr-4 py-3.5 text-white focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-mojito-primary hover:bg-mojito-secondary text-black font-bold py-4 px-4 rounded-xl transition-colors group mt-8"
                  >
                    <span>{isLoading ? 'Searching...' : 'Find Available Tables'}</span>
                    {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div>
                    <button onClick={() => setStep(1)} className="text-mojito-primary text-sm hover:underline mb-4 inline-block">&larr; Change Date/Time</button>
                    <h2 className="text-xl font-bold text-white">Select a Table & Verify</h2>
                    <p className="text-sm text-mojito-text-muted mb-6">Available tables for {formData.partySize} guests at {formData.time}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {availableTables.map(table => (
                        <div
                          key={table._id}
                          onClick={() => setSelectedTable(table._id)}
                          className={clsx(
                            "cursor-pointer p-4 rounded-xl border-2 transition-all text-center relative",
                            selectedTable === table._id 
                              ? "border-mojito-primary bg-mojito-primary/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]" 
                              : "border-mojito-border bg-mojito-bg hover:border-mojito-primary/50"
                          )}
                        >
                          <div className="font-bold text-white text-lg">Table {table.tableNumber}</div>
                          <div className="text-xs text-mojito-text-muted mt-1">Seats {table.capacity}</div>
                          {selectedTable === table._id && (
                            <div className="absolute top-2 right-2 text-mojito-primary">
                              <Check size={16} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-mojito-border/50">
                    <h3 className="text-lg font-bold text-white">Guest Verification Details</h3>
                    <p className="text-xs text-mojito-text-muted">Required by management for security and entry verification.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-mojito-text-muted mb-2">Guest Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mojito-primary">
                            <User size={18} />
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={formData.guestName}
                            onChange={e => setFormData({...formData, guestName: e.target.value})}
                            className="w-full bg-mojito-bg border border-mojito-border rounded-xl pl-11 pr-4 py-3 text-white focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-mojito-text-muted mb-2">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mojito-primary">
                            <Phone size={18} />
                          </div>
                          <input
                            type="tel"
                            required
                            placeholder="+91..."
                            value={formData.guestPhone}
                            onChange={e => setFormData({...formData, guestPhone: e.target.value})}
                            className="w-full bg-mojito-bg border border-mojito-border rounded-xl pl-11 pr-4 py-3 text-white focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mojito-text-muted mb-2">Government ID Proof Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mojito-primary">
                          <CreditCard size={18} />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Aadhaar or Driver's License Number"
                          value={formData.guestProof}
                          onChange={e => setFormData({...formData, guestProof: e.target.value})}
                          className="w-full bg-mojito-bg border border-mojito-border rounded-xl pl-11 pr-4 py-3 text-white focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mojito-text-muted mb-2">Special Requests (Optional)</label>
                      <textarea
                        rows={2}
                        value={formData.specialRequests}
                        onChange={e => setFormData({...formData, specialRequests: e.target.value})}
                        className="w-full bg-mojito-bg border border-mojito-border rounded-xl p-4 text-white focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all resize-none"
                        placeholder="Dietary requirements or special occasions?"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={isLoading || !selectedTable}
                    className="w-full flex items-center justify-center gap-2 bg-mojito-primary hover:bg-mojito-secondary disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors mt-8 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                  >
                    {isLoading ? 'Confirming...' : 'Submit Booking Request'} <Check size={18} />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reservation;
