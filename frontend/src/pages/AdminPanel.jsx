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
  Layout
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
            setUsers(usersRes.data);
            setTransactions(txsRes.data);
        } catch (err) {
            setError('No tienes permisos suficientes para ver esta área.');
            setTimeout(() => navigate('/dashboard'), 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const totalFunds = users.reduce((acc, u) => acc + parseFloat(u.balance || 0), 0);
    const weeklyVolume = transactions.reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
                <ShieldAlert className="text-red-500 mb-6" size={64} />
                <h2 className="text-2xl font-bold mb-4">{error}</h2>
                <p className="text-slate-400">Redirigiendo al dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto p-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="w-12 h-12 glass rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 group"
                        >
                            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldAlert size={16} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Security & Analytics Console</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter">Panel de Auditoría</h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                        <TabBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18}/>} label="Usuarios" />
                        <TabBtn active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<Activity size={18}/>} label="Auditoría Gral." />
                    </div>
                </header>

                {/* Main Content Areas */}
                {activeTab === 'users' ? (
                    <div className="space-y-12">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <StatCard label="Usuarios Activos" value={users.length} icon={<Users />} trend="+4.2%" />
                            <StatCard label="Fondos en Custodia" value={`$${totalFunds.toLocaleString()}`} icon={<TrendingUp />} trend="+12.5%" highlight />
                            <StatCard label="Volumen Semanal" value={`$${weeklyVolume.toLocaleString()}`} icon={<Activity />} trend="+8.1%" />
                        </div>

                        {/* Users Table */}
                        <div className="glass overflow-hidden bank-shadow">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="font-bold flex items-center gap-3">
                                    Control de Cuentas
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Filtrar por nombre o email..." 
                                        className="bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-72"
                                    />
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                                        <tr>
                                            <th className="px-8 py-6">Titular de Cuenta</th>
                                            <th className="px-8 py-6">Correo Electrónico</th>
                                            <th className="px-8 py-6 text-right">Saldo Total</th>
                                            <th className="px-8 py-6 text-center">Nivel</th>
                                            <th className="px-8 py-6 text-center">Estado</th>
                                            <th className="px-8 py-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-white/[0.03] transition-all group">
                                                <td className="px-8 py-5 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-slate-800 flex items-center justify-center text-indigo-400 text-sm font-black border border-white/5">
                                                        {u.full_name?.substring(0, 1)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm leading-tight">{u.full_name}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">ID: {u.id}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-xs text-slate-400 font-medium">{u.email}</td>
                                                <td className="px-8 py-5 text-sm font-black text-right text-indigo-400">
                                                    ${parseFloat(u.balance || 0).toLocaleString()}
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800/50 text-slate-500'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <div className="flex justify-center">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black bg-emerald-500/5 text-emerald-400 uppercase border border-emerald-500/10">
                                                            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                                                            Activo
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button 
                                                        onClick={() => setSelectedUserId(u.id)}
                                                        className="flex items-center gap-2 ml-auto text-xs font-bold px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-slate-300 hover:text-white"
                                                    >
                                                        <Eye size={14} /> Inspeccionar
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
                    <div className="space-y-8">
                        <div className="glass p-10 bg-gradient-to-br from-white/5 to-transparent">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl font-black mb-2">Auditoría General de Transacciones</h2>
                                    <p className="text-slate-400 text-sm">Flujo de capital en tiempo real a través de todos los usuarios.</p>
                                </div>
                                <Activity className="text-indigo-500 animate-pulse" size={48} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                                <AuditStat label="Promedio Transacción" value="$420.00" />
                                <AuditStat label="Alertas de Riesgo" value="0" success />
                                <AuditStat label="Operaciones Hoy" value={transactions.length} />
                                <AuditStat label="Tasa de Éxito" value="100%" success />
                            </div>

                            <div className="space-y-4">
                                {transactions.map(tx => (
                                    <div key={tx.id} className="glass p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all border border-white/5">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-100'}`}>
                                                {tx.type === 'deposit' ? <ArrowDownLeft size={24}/> : <ArrowUpRight size={24}/>}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-lg">{tx.description || (tx.type === 'deposit' ? 'Depósito Externo' : 'Transferencia')}</p>
                                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 uppercase">{tx.type}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                                    <p className="flex items-center gap-1"><Users size={14}/> {tx.sender_name || 'System'} → {tx.receiver_name || 'N/A'}</p>
                                                    <span>•</span>
                                                    <p className="flex items-center gap-1"><Calendar size={14}/> {new Date(tx.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-black ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-white'}`}>
                                                {tx.type === 'deposit' ? '+' : '-'}${Math.abs(parseFloat(tx.amount)).toLocaleString()}
                                            </p>
                                            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest italic">Confidencial</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            <UserDetailModal 
                isOpen={!!selectedUserId} 
                onClose={() => setSelectedUserId(null)} 
                userId={selectedUserId}
            />
            
            {/* FAB Float for Refresh */}
            <button 
                onClick={fetchAdminData}
                className="fixed bottom-10 right-10 w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 hover:bg-indigo-500 hover:rotate-180 transition-all active:scale-90 z-40 group"
            >
                <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>
    );
};

const TabBtn = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        {label}
    </button>
);

const StatCard = ({ label, value, icon, trend, highlight }) => (
    <div className={`glass p-8 border-b-2 ${highlight ? 'border-indigo-500 shadow-indigo-500/10 shadow-2xl' : 'border-white/5'}`}>
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${highlight ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
                {icon}
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {trend}
            </span>
        </div>
        <p className="text-4xl font-black mb-1.5 tracking-tighter">{value}</p>
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em]">{label}</p>
    </div>
);

const AuditStat = ({ label, value, success }) => (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">{label}</p>
        <p className={`text-xl font-black ${success ? 'text-emerald-400' : 'text-slate-200'}`}>{value}</p>
    </div>
);

export default AdminPanel;
