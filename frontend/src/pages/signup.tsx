import React, { useState } from 'react';
import api from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';


const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
       await Swal.fire({
        title:"Registration successfull",
        text:"Redirecting to Login..",
        icon:"success",
        toast:true,
        position:"top-end",
        showConfirmButton:false,
        timer:2000,
        timerProgressBar:true,
        background:"#0f172a",
        color:'#fff'
      })
      navigate('/login');
    } catch (err) {
      if(axios.isAxiosError(err)){
        setError(err.response?.data?.message || 'Something went wrong');
      }else{
        setError("An unexpected error occurred")
      }
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-slate-800 animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
        <p className="text-slate-400 mb-8">Start managing your tasks efficiently today.</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-600 w-5 h-5" />
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="John Doe"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

        
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-600 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="john@example.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-600 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-12 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-600 hover:text-slate-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-600 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
      disabled={loading}
      className={`w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 group shadow-lg shadow-sky-500/20 ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
           Signing up...
        </div>
      ) : (
        <>
          Sign Up
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}

          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-500 hover:text-sky-400 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
