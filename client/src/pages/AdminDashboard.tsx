import { useState, useEffect } from 'react';
import { ShoppingBag, CalendarDays, TrendingUp, DollarSign } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    orders: { total: 0, pending: 0, revenue: 0 },
    reservations: { total: 0, today: 0, pending: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Orders', value: stats.orders.total, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Pending Orders', value: stats.orders.pending, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Total Revenue', value: `$${stats.orders.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Reservations Today', value: stats.reservations.today, icon: CalendarDays, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-mojito-text-muted mt-2 font-light">Welcome to the Mojito administration center.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-mojito-text-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mojito-primary mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={card.title}
                className="bg-mojito-bg-light/80 backdrop-blur-md rounded-2xl p-6 border border-mojito-border shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-mojito-text-muted">{card.title}</p>
                    <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
