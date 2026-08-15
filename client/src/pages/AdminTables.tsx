import { useState, useEffect } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminTables = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/tables', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(data);
    } catch (error) {
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTable.tableNumber || !newTable.capacity) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/tables', newTable, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables([...tables, data]);
      setNewTable({ tableNumber: '', capacity: '' });
      toast.success('Table added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add table');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tables/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(tables.filter(t => t._id !== id));
      toast.success('Table deleted');
    } catch (error) {
      toast.error('Failed to delete table');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Table Management</h1>
          <p className="text-mojito-text-muted mt-2 font-light">Add and manage physical tables and capacities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Table Form */}
        <div className="lg:col-span-1">
          <div className="bg-mojito-bg-light/80 backdrop-blur-md rounded-2xl shadow-xl border border-mojito-border p-6 sticky top-6">
            <h2 className="text-xl font-bold text-white mb-6">Add New Table</h2>
            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mojito-text-muted mb-2">Table Number/Name</label>
                <input
                  type="text"
                  value={newTable.tableNumber}
                  onChange={e => setNewTable({...newTable, tableNumber: e.target.value})}
                  className="w-full bg-mojito-bg border border-mojito-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none"
                  placeholder="e.g. 12 or Window-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mojito-text-muted mb-2">Capacity (Persons)</label>
                <input
                  type="number"
                  min="1"
                  value={newTable.capacity}
                  onChange={e => setNewTable({...newTable, capacity: e.target.value})}
                  className="w-full bg-mojito-bg border border-mojito-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none"
                  placeholder="e.g. 4"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-mojito-primary text-black font-bold py-3 rounded-xl hover:bg-mojito-secondary transition-colors"
              >
                <Plus size={18} /> {isSubmitting ? 'Adding...' : 'Add Table'}
              </button>
            </form>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="lg:col-span-2">
          {loading ? (
             <div className="text-center py-20 text-mojito-text-muted">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mojito-primary mx-auto"></div>
             </div>
          ) : tables.length === 0 ? (
            <div className="text-center py-20 text-mojito-text-muted bg-mojito-bg-light/50 rounded-2xl border border-mojito-border border-dashed">
              No tables added yet. Add your first table to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tables.map((table, index) => (
                <motion.div
                  key={table._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-mojito-bg-light/80 backdrop-blur-md p-5 rounded-2xl border border-mojito-border flex items-center justify-between group hover:border-mojito-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-mojito-bg rounded-full flex items-center justify-center border border-mojito-border">
                      <span className="font-bold text-white text-lg">{table.tableNumber}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Table {table.tableNumber}</h3>
                      <div className="flex items-center gap-1.5 text-mojito-text-muted text-sm mt-1">
                        <Users size={14} className="text-mojito-primary" />
                        <span>Seats {table.capacity}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(table._id)}
                    className="p-2 text-mojito-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTables;
