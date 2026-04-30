import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock as LockIcon, Mail, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
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
      setError(err.response?.data?.message || 'Credenciales incorrectas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Premium Background (Consistent with Landing) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#020408_100%)] opacity-40"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in duration-700">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-6 shadow-2xl">
            <Zap className="text-white w-8 h-8" fill="currentColor" />
          </Link>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Bienvenido</h1>
          <p className="text-slate-400 font-medium">Accede a tu banca digital de Lumina Bank</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-bold">
                {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-purple-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-purple-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white font-bold py-4 rounded-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <span className="text-slate-500 text-sm">¿Aún no eres cliente? </span>
            <Link to="/register" className="text-cyan-400 font-bold hover:text-white transition-colors">Crear una cuenta</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
