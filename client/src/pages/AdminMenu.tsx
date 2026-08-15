import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isAvailable: boolean;
  stockQuantity: number;
  image?: string;
}

const AdminMenu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Appetizers',
    price: '',
    description: '',
    stockQuantity: '10',
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/api/menu');
      setItems(data);
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      stockQuantity: item.stockQuantity.toString(),
      isAvailable: item.isAvailable,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Item deleted successfully');
      fetchItems();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      let imageUrl = '';

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await api.post('/api/upload', uploadData, {
          headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data',
          }
        });
        imageUrl = uploadRes.data.url;
      }

      const newItem = {
        ...formData,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        ...(imageUrl && { image: imageUrl }), // only include image if new one was uploaded
      };

      if (editingId) {
        await api.put(`/api/menu/${editingId}`, newItem, config);
        toast.success('Menu item updated successfully');
      } else {
        await api.post('/api/menu', newItem, config);
        toast.success('Menu item added successfully');
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        name: '',
        category: 'Appetizers',
        price: '',
        description: '',
        stockQuantity: '10',
        isAvailable: true,
      });
      setImageFile(null);
      fetchItems();
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to add menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Menu Management</h1>
          <p className="text-mojito-text-muted mt-2 font-light">Curate your premium dining experience.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-mojito-primary hover:bg-mojito-primary-hover text-mojito-bg px-6 py-3 rounded-xl font-bold transition-colors uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)]"
        >
          <Plus size={18} />
          Add Item
        </motion.button>
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
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-mojito-bg-light/80 backdrop-blur-md rounded-2xl border border-mojito-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-mojito-bg text-mojito-text-muted border-b border-mojito-border">
              <tr>
                <th className="px-6 py-5 font-semibold tracking-widest uppercase text-xs">Image</th>
                <th className="px-6 py-5 font-semibold tracking-widest uppercase text-xs">Item Name</th>
                <th className="px-6 py-5 font-semibold tracking-widest uppercase text-xs">Category</th>
                <th className="px-6 py-5 font-semibold tracking-widest uppercase text-xs">Price</th>
                <th className="px-6 py-5 font-semibold tracking-widest uppercase text-xs">Stock</th>
                <th className="px-6 py-5 font-semibold tracking-widest uppercase text-xs">Status</th>
                <th className="px-6 py-5 font-semibold tracking-widest uppercase text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mojito-border/50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-mojito-text-muted"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mojito-primary mx-auto"></div></td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-mojito-text-muted font-light">No items found.</td></tr>
              ) : (
                filteredItems.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item._id} 
                    className="hover:bg-mojito-border/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      {item.image ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-mojito-border relative group-hover:border-mojito-primary/50 transition-colors">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-mojito-bg border border-mojito-border rounded-xl flex items-center justify-center text-mojito-text-muted text-[10px] uppercase tracking-wider text-center p-1">No Img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white text-base">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-mojito-bg text-mojito-text-muted border border-mojito-border uppercase tracking-widest">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-mojito-primary">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white">{item.stockQuantity}</span>
                    </td>
                    <td className="px-6 py-4">
                      {item.isAvailable && item.stockQuantity > 0 ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-widest">
                          Sold Out
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(item)} className="p-2.5 text-mojito-text-muted hover:text-white hover:bg-mojito-border rounded-xl transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-2.5 text-mojito-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-mojito-bg-light border border-mojito-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
            >
              <div className="px-8 py-6 border-b border-mojito-border flex justify-between items-center bg-mojito-bg/50">
                <h3 className="text-xl font-bold text-white tracking-widest uppercase">
                  {editingId ? 'Edit Menu Item' : 'Add New Item'}
                </h3>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      category: 'Appetizers',
                      price: '',
                      description: '',
                      stockQuantity: '10',
                      isAvailable: true,
                    });
                  }}
                  className="p-2 rounded-xl text-mojito-text-muted hover:text-white hover:bg-mojito-border transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-mojito-text-muted mb-2">Item Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-mojito-bg border border-mojito-border rounded-xl focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all text-white" 
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-mojito-text-muted mb-2">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-mojito-bg border border-mojito-border rounded-xl focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all text-white"
                    >
                      <option value="Appetizers">Appetizers</option>
                      <option value="Mains">Mains</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-mojito-text-muted mb-2">Price (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-mojito-bg border border-mojito-border rounded-xl focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-mojito-text-muted mb-2">Stock Qty</label>
                    <input 
                      type="number" 
                      name="stockQuantity"
                      required
                      min="0"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-mojito-bg border border-mojito-border rounded-xl focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-mojito-text-muted mb-2">Description</label>
                  <textarea 
                    name="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-mojito-bg border border-mojito-border rounded-xl focus:ring-1 focus:ring-mojito-primary focus:border-mojito-primary outline-none transition-all resize-none text-white" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-mojito-text-muted mb-2">Menu Photo</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-mojito-bg border border-mojito-border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-mojito-primary/10 file:text-mojito-primary hover:file:bg-mojito-primary hover:file:text-mojito-bg transition-all text-sm text-mojito-text-muted cursor-pointer" 
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="isAvailable"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="rounded border-mojito-border bg-mojito-bg text-mojito-primary focus:ring-mojito-primary/20 w-5 h-5 cursor-pointer accent-mojito-primary" 
                  />
                  <label htmlFor="isAvailable" className="text-sm font-medium text-white cursor-pointer tracking-wide">
                    Available for Order
                  </label>
                </div>

                <div className="pt-6 flex justify-end gap-4 border-t border-mojito-border mt-8">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-sm font-bold tracking-widest uppercase text-mojito-text-muted hover:text-white bg-mojito-bg border border-mojito-border rounded-xl hover:bg-mojito-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 text-sm font-bold tracking-widest uppercase text-mojito-bg bg-mojito-primary hover:bg-mojito-primary-hover rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                  >
                    {isSubmitting ? 'Uploading...' : 'Save Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMenu;
