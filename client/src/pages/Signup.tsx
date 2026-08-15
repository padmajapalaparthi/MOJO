import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/auth/register', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      }));

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post('/api/auth/google', { token: credentialResponse.credential });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      }));

      toast.success('Account created successfully with Google!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google registration failed');
    }
  };

  return (
    <div className="flex-1 flex min-h-screen bg-mojito-bg relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-mojito-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-32 z-10 w-full lg:w-1/2 relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-mojito-primary text-mojito-bg p-3 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                <Utensils size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold tracking-widest uppercase text-white">Mojito</h2>
            </div>
            <h2 className="mt-8 text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
            <p className="mt-3 text-sm text-mojito-text-muted font-light">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-mojito-primary hover:text-mojito-primary-hover transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-mojito-text-muted mb-2">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-xl border border-mojito-border bg-mojito-bg-light/50 px-4 py-3 text-white placeholder-mojito-text-muted focus:border-mojito-primary focus:outline-none focus:ring-1 focus:ring-mojito-primary sm:text-sm transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-mojito-text-muted mb-2">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-xl border border-mojito-border bg-mojito-bg-light/50 px-4 py-3 text-white placeholder-mojito-text-muted focus:border-mojito-primary focus:outline-none focus:ring-1 focus:ring-mojito-primary sm:text-sm transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-mojito-text-muted mb-2">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-xl border border-mojito-border bg-mojito-bg-light/50 px-4 py-3 text-white placeholder-mojito-text-muted focus:border-mojito-primary focus:outline-none focus:ring-1 focus:ring-mojito-primary sm:text-sm transition-all"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-mojito-primary px-4 py-4 text-sm font-bold tracking-widest uppercase text-mojito-bg hover:bg-mojito-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mojito-primary shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all disabled:opacity-50 mt-8"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>

            <div className="mt-8 flex flex-col gap-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-mojito-border/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-mojito-bg px-4 font-bold tracking-widest uppercase text-mojito-text-muted text-xs">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center w-full *:w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google Sign-In failed')}
                  theme="filled_black"
                  shape="pill"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Premium Image Side */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1934&q=80"
            alt="Fine dining experience"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-mojito-bg via-mojito-bg/50 to-transparent"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
