import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  ArrowLeft, 
  ShieldAlert, 
  Search,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Zap,
  Terminal,
  ShieldCheck,
  Lock as LockIcon,
  ChevronRight
} from 'lucide-react';
import api from '../utils/api';
import UserDetailModal from '../components/UserDetailModal';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'audit'

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [usersRes, txsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/transactions')
            ]);
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
            setTransactions(Array.isArray(txsRes.data) ? txsRes.data : []);
        } catch (err) {
            setError('Acceso denegado: Protocolo de seguridad Lumina-Admin no superado.');
            setTimeout(() => navigate('/dashboard'), 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const totalFunds = (Array.isArray(users) ? users : []).reduce((acc, u) => acc + parseFloat(u.balance || 0), 0);
    const weeklyVolume = (Array.isArray(transactions) ? transactions : []).reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);

    if (error) {
        return (
            <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-8 border border-red-500/20 animate-pulse">
                    <LockIcon size={40} />
                </div>
                <h2 className="text-3xl font-black mb-4 text-white tracking-tighter">{error}</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Reconectando con el terminal de usuario...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020408] text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-purple-600/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto p-10">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 group"
                        >
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Terminal size={14} className="text-purple-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">Lumina Mainframe v2.0</span>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter">Terminal Auditor</h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
                        <TabBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18}/>} label="Directorio" />
                        <TabBtn active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<Activity size={18}/>} label="Flujos P2P" />
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <StatCard label="Usuarios en Red" value={users.length} icon={<Users />} trend="+4%" />
                    <StatCard label="Custodia Total" value={`$${totalFunds.toLocaleString()}`} icon={<TrendingUp />} trend="+12%" highlight />
                    <StatCard label="Volumen de Transacciones" value={`$${weeklyVolume.toLocaleString()}`} icon={<Activity />} trend="+8%" />
                </section>

                {activeTab === 'users' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-[#05070A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
                            <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r from-purple-500/5 to-transparent">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tighter mb-1">Registros de Ciudadanía</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Control total sobre cuentas activas</p>
                                </div>
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Filtrar por nombre, email o ID..." 
                                        className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm focus:border-purple-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.02] text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">
                                        <tr>
                                            <th className="px-10 py-6">Entidad</th>
                                            <th className="px-10 py-6">Comunicación</th>
                                            <th className="px-10 py-6 text-right">Liquidez</th>
                                            <th className="px-10 py-6 text-center">Rango</th>
                                            <th className="px-10 py-6 text-center">Estado de Nodo</th>
                                            <th className="px-10 py-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-white/[0.02] transition-all group">
                                                <td className="px-10 py-6 flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-purple-400 font-black">
                                                        {u.full_name?.substring(0, 1)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm group-hover:text-white transition-colors">{u.full_name}</p>
                                                        <p className="text-[10px] text-slate-500 font-mono">UID: {u.id}</p>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-xs text-slate-400 font-bold">{u.email}</td>
                                                <td className="px-10 py-6 text-base font-black text-right text-cyan-400">
                                                    ${parseFloat(u.balance || 0).toLocaleString()}
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10' : 'bg-slate-800/50 text-slate-500 border border-white/5'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <div className="flex justify-center">
                                                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black bg-cyan-500/5 text-cyan-400 uppercase border border-cyan-400/20">
                                                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
                                                            Online
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <button 
                                                        onClick={() => setSelectedUserId(u.id)}
                                                        className="p-3 bg-white/5 hover:bg-purple-500/10 hover:text-purple-400 rounded-xl transition-all border border-white/5"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-[#05070A] p-12 border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl"></div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-4">
                                <div>
                                    <h2 className="text-3xl font-black mb-3 tracking-tighter">Monitoreo de Capital Lumina</h2>
                                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Flujo global de transacciones encriptadas</p>
                                </div>
                                <div className="flex gap-4">
                                    <AuditStat label="Alertas de Seguridad" value="Limpio" success icon={<ShieldCheck size={14}/>} />
                                    <AuditStat label="Integridad de Cadena" value="99.9%" success icon={<Zap size={14}/>} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {transactions.map(tx => (
                                    <div key={tx.id} className="p-8 bg-white/[0.02] hover:bg-white/[0.04] rounded-[2.5rem] border border-white/5 flex items-center justify-between transition-all group">
                                        <div className="flex items-center gap-8">
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${tx.type === 'deposit' ? 'bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/5' : 'bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/5'}`}>
                                                {tx.type === 'deposit' ? <ArrowDownLeft size={28}/> : <ArrowUpRight size={28}/>}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className="font-black text-xl group-hover:text-white transition-colors">{tx.description || (tx.type === 'deposit' ? 'Abono Externo' : 'Transferencia P2P')}</p>
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${tx.type === 'deposit' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'}`}>{tx.type}</span>
                                                </div>
                                                <div className="flex items-center gap-5 text-slate-500 text-xs font-bold">
                                                    <p className="flex items-center gap-2 opacity-80"><Users size={14}/> {tx.sender_name || 'Network'} <ChevronRight size={10} className="opacity-30"/> {tx.receiver_name || 'UID-Vault'}</p>
                                                    <p className="flex items-center gap-2 opacity-80"><Calendar size={14}/> {new Date(tx.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-3xl font-black ${tx.type === 'deposit' ? 'text-cyan-400' : 'text-slate-100'}`}>
                                                {tx.type === 'deposit' ? '+' : '-'}${Math.abs(parseFloat(tx.amount)).toLocaleString()}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mt-2">Verified by Lumina-Core</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <UserDetailModal 
                isOpen={!!selectedUserId} 
                onClose={() => setSelectedUserId(null)} 
                userId={selectedUserId}
            />
            
            <div className="fixed bottom-12 right-12 flex flex-col gap-4 z-50">
                <button 
                    onClick={fetchAdminData}
                    className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-600/30 hover:rotate-180 transition-all duration-700 active:scale-90 group"
                >
                    <RefreshCw size={24} className={`text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    );
};

const TabBtn = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${active ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl shadow-purple-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        {label}
    </button>
);

const StatCard = ({ label, value, icon, trend, highlight }) => (
    <div className={`p-10 rounded-[3rem] bg-[#05070A] border relative overflow-hidden transition-all duration-700 group hover:-translate-y-2 ${highlight ? 'border-purple-500/30 shadow-2xl shadow-purple-500/10' : 'border-white/5 hover:border-white/10'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl"></div>
        <div className="flex justify-between items-start mb-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${highlight ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/30 group-hover:scale-110' : 'bg-white/5 text-purple-400'}`}>
                {icon}
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest ${trend.startsWith('+') ? 'bg-cyan-400/10 text-cyan-400' : 'bg-red-400/10 text-red-400'}`}>
                {trend}
            </div>
        </div>
        <p className="text-5xl font-black mb-3 tracking-tighter text-white group-hover:text-purple-400 transition-colors">{value}</p>
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">{label}</p>
    </div>
);

const AuditStat = ({ label, value, success, icon }) => (
    <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <span className="text-slate-600">{icon}</span>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">{label}</p>
        </div>
        <p className={`text-xl font-black leading-none ${success ? 'text-cyan-400' : 'text-slate-200'}`}>{value}</p>
    </div>
);

export default AdminPanel;
