import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en la validación de credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Cinematic Professional Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-10 grayscale" 
          alt="Security background" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408]/80 via-[#020408] to-[#020408]"></div>
      </div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-[460px] relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-[2rem] mb-8 shadow-2xl shadow-purple-500/20 hover:scale-110 transition-transform duration-500">
            <Zap className="text-white w-10 h-10" fill="currentColor" />
          </Link>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tighter">Terminal de Acceso</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Protocolo Lumina Secure-Core</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-3xl rounded-[3rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden group">
            {/* Inner accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50"></div>
            
          {error && (
            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl text-center font-black uppercase tracking-wider flex items-center justify-center gap-3">
                <ShieldCheck size={16} />
                {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Identidad Electrónica</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-500/5 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ID_USUARIO@LUMINA.COM"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:border-purple-500/50 outline-none transition-all placeholder:text-slate-800 relative z-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Clave de Encriptación</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800 relative z-10"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
                <a href="#" className="text-[10px] font-black uppercase text-slate-500 hover:text-cyan-400 transition-colors tracking-widest">¿Olvidó su acceso?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white font-black py-5 rounded-2xl shadow-2xl shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30 uppercase tracking-[0.2em] text-xs relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              {loading ? 'Validando Protocolo...' : 'Autorizar Acceso'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">¿Nuevo en el Mainframe? </span>
            <Link to="/register" className="text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors underline-offset-4 hover:underline">Crear Identidad</Link>
          </div>
        </div>
        
        <p className="mt-10 text-center text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">Lumina Global • AES-256 Protected</p>
      </div>
    </div>
  );
};

export default Login;
