import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import api from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en la inicialización de identidad.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center p-8 relative overflow-hidden font-sans">
      {/* Cinematic Professional Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-10 grayscale" 
          alt="Network background" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408]/80 via-[#020408] to-[#020408]"></div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-[500px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-[2rem] mb-8 shadow-2xl shadow-cyan-500/20 hover:rotate-12 transition-transform duration-500">
            <ShieldCheck className="text-white w-10 h-10" />
          </Link>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tighter">Nueva Identidad</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Inicializar Registro en Lumina Mainframe</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-3xl rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>

          {error && (
            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl text-center font-black uppercase tracking-wider flex items-center justify-center gap-3">
                <Zap size={16} />
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Nombre de Entidad</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="SU NOMBRE COMPLETO"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="ID@LUMINA.COM"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Código de Encriptación</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:border-purple-500/50 outline-none transition-all placeholder:text-slate-800"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:brightness-110 text-white font-black py-6 rounded-2xl shadow-2xl shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30 uppercase tracking-[0.2em] text-xs group"
            >
              {loading ? 'Inicializando Perfil...' : 'Confirmar Identidad'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">¿Ya posee identidad? </span>
            <Link to="/login" className="text-purple-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors underline-offset-4 hover:underline">Acceso Terminal</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
