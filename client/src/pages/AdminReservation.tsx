import { useState, useEffect } from 'react';
import { Search, CalendarDays, Clock, Users, Check, X } from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminReservation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (reservationId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/reservations/${reservationId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(reservations.map(r => r._id === reservationId ? { ...r, status: newStatus } : r));
      toast.success(`Reservation status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const filteredReservations = reservations.filter(r => {
    const matchesText = r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || r.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = searchDate ? r.date === searchDate : true;
    return matchesText && matchesDate;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reservations</h1>
          <p className="text-mojito-text-muted mt-2 font-light">Manage table bookings and ensure flawless hospitality.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-mojito-bg-light/80 backdrop-blur-md p-5 rounded-2xl border border-mojito-border flex flex-col sm:flex-row gap-4 shadow-lg">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mojito-text-muted">
            <Search size={20} />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 border border-mojito-border rounded-xl text-sm focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary bg-mojito-bg text-white placeholder-mojito-text-muted outline-none transition-all"
            placeholder="Search by guest name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mojito-text-muted">
            <CalendarDays size={20} />
          </div>
          <input
            type="date"
            className="block w-full sm:w-48 pl-12 pr-4 py-3 border border-mojito-border rounded-xl text-sm focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary bg-mojito-bg text-white outline-none transition-all"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
      </div>

      {loading && reservations.length === 0 ? (
        <div className="text-center py-20 text-mojito-text-muted"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mojito-primary mx-auto"></div></div>
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-20 text-mojito-text-muted font-light uppercase tracking-widest text-sm">No reservations found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredReservations.map((reservation, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={reservation._id} 
              className="bg-mojito-bg-light/80 backdrop-blur-md rounded-2xl shadow-xl border border-mojito-border p-6 flex flex-col hover:border-mojito-primary/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-white text-lg">{reservation.user?.name || 'Guest'}</h3>
                  <p className="text-sm text-mojito-text-muted font-light">{reservation.user?.email || 'N/A'}</p>
                </div>
                <span className={clsx(
                  "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                  reservation.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  reservation.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                  'bg-red-500/10 text-red-500 border-red-500/20'
                )}>
                  {reservation.status}
                </span>
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <div className="flex items-center gap-3 text-sm text-mojito-text-muted">
                  <CalendarDays size={18} className="text-mojito-primary" />
                  <span className="font-medium text-white">{new Date(reservation.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-mojito-text-muted">
                  <Clock size={18} className="text-mojito-primary" />
                  <span className="font-medium text-white">{reservation.time}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-mojito-text-muted">
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-mojito-primary" />
                    <span className="font-medium text-white">Party of {reservation.partySize}</span>
                  </div>
                  {reservation.table && (
                    <span className="bg-mojito-primary/20 text-mojito-primary px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-mojito-primary/30">
                      Table {reservation.table.tableNumber}
                    </span>
                  )}
                </div>
                {reservation.specialRequests && (
                  <div className="mt-4 p-4 bg-mojito-bg rounded-xl text-sm text-mojito-text-muted border border-mojito-border/50 font-light leading-relaxed">
                    <span className="font-bold tracking-widest uppercase text-[10px] text-mojito-primary block mb-2">Special Request</span>
                    {reservation.specialRequests}
                  </div>
                )}
                
                {/* Guest Details Section */}
                <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                  <span className="font-bold tracking-widest uppercase text-[10px] text-mojito-primary block mb-3 border-b border-white/10 pb-2">Guest Verification</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-mojito-text-muted">Name:</span>
                    <span className="text-white font-bold">{reservation.guestName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mojito-text-muted">Phone:</span>
                    <span className="text-white font-medium">{reservation.guestPhone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mojito-text-muted">ID Proof:</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-widest">{reservation.guestProof || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {reservation.status === 'Pending' && (
                <div className="flex gap-4 pt-6 border-t border-mojito-border/50">
                  <button 
                    onClick={() => updateStatus(reservation._id, 'Confirmed')}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all border border-emerald-500/20"
                  >
                    <Check size={16} /> Confirm
                  </button>
                  <button 
                    onClick={() => updateStatus(reservation._id, 'Cancelled')}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all border border-red-500/20"
                  >
                    <X size={16} /> Decline
                  </button>
                </div>
              )}
              {reservation.status === 'Confirmed' && (
                <div className="flex pt-6 border-t border-mojito-border/50">
                  <button 
                    onClick={() => updateStatus(reservation._id, 'Cancelled')}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all border border-red-500/20"
                  >
                    <X size={16} /> Cancel Reservation
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReservation;
