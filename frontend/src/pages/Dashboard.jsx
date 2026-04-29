import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  LayoutDashboard, 
  History, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  Send,
  Users,
  Wallet,
  ShieldCheck,
  Smartphone,
  Info,
  ChevronRight,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import TransferModal from '../components/TransferModal';
import DepositModal from '../components/DepositModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [balanceRes, historyRes] = await Promise.all([
                api.get('/user/balance'),
                api.get('/transactions/history')
            ]);
            setAccounts(balanceRes.data);
            setTransactions(historyRes.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            if (err.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [showComingSoon, setShowComingSoon] = useState(false);
    const [featureName, setFeatureName] = useState('');

    const handleAction = (feature) => {
        const actionMap = {
            'Historial': 'transactions-section',
            'Movimientos': 'transactions-section',
            'Cuentas': 'top'
        };

        if (actionMap[feature]) {
            if (actionMap[feature] === 'top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                document.getElementById(actionMap[feature])?.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            setFeatureName(feature);
            setShowComingSoon(true);
            setTimeout(() => setShowComingSoon(false), 3000);
        }
    };

    const handleDownloadStatement = async () => {
        try {
            const res = await api.get('/user/statement');
            alert(res.data.message + '. Enlace: ' + res.data.downloadUrl);
        } catch (err) {
            alert('Error al descargar cartola');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const totalBalance = accounts.reduce((acc, curr) => acc + parseFloat(curr.balance || 0), 0);

    return (
        <div className="flex h-screen bg-[#020408] text-slate-100 font-sans overflow-hidden">
            {/* Notification Toast */}
            {showComingSoon && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-8 duration-500">
                    <div className="bg-[#0A0C10] border border-cyan-500/30 px-8 py-4 rounded-2xl shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)] flex items-center gap-4">
                        <Zap size={20} className="text-cyan-400 animate-pulse" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Protocolo Lumina</p>
                            <p className="text-sm font-bold text-white">Módulo <span className="uppercase">{featureName}</span> encriptándose...</p>
                        </div>
                    </div>
                </div>
            )}
            {/* Sidebar - Lumina Edition */}
            <aside className="w-80 border-r border-white/5 bg-[#05070A] hidden lg:flex flex-col p-8 z-50">
                <div className="flex items-center gap-4 mb-12 px-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                        <Zap size={28} strokeWidth={2.5} fill="currentColor" />
                    </div>
                    <div>
                        <span className="font-black text-2xl tracking-tighter block leading-none">Lumina</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 opacity-80">Online Bank</span>
                    </div>
                </div>
                
                <nav className="flex-1 space-y-2">
                    <p className="px-4 text-[10px] font-black uppercase text-slate-600 tracking-[0.25em] mb-4">Menú Principal</p>
                    <NavItem icon={<LayoutDashboard size={20}/>} label="Cuadro de Mando" active />
                    <NavItem icon={<Wallet size={20}/>} label="Mis Cuentas" onClick={() => handleAction('Cuentas')} />
                    <NavItem icon={<CreditCard size={20}/>} label="Tarjetas Virtuales" onClick={() => handleAction('Tarjetas')} />
                    <NavItem icon={<History size={20}/>} label="Movimientos" onClick={() => handleAction('Historial')} />
                    
                    <div className="pt-8">
                        <p className="px-4 text-[10px] font-black uppercase text-slate-600 tracking-[0.25em] mb-4">Servicios</p>
                        <NavItem icon={<TrendingUp size={20}/>} label="Inversiones AI" onClick={() => handleAction('Inversiones')} />
                        <NavItem icon={<Smartphone size={20}/>} label="Pago Móvil" onClick={() => handleAction('Pagos')} />
                        {user.role === 'admin' && (
                            <NavItem icon={<Users size={20}/>} label="Panel Auditor" onClick={() => navigate('/admin')} highlight />
                        )}
                        <NavItem icon={<Settings size={20}/>} label="Seguridad" onClick={() => handleAction('Configuracion')} />
                    </div>
                </nav>

                <div className="pt-8 border-t border-white/5 mt-auto">
                    <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 p-6 rounded-3xl border border-white/5 mb-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cyan-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <p className="text-xs font-bold text-cyan-400 mb-2">Soporte Lumina</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed mb-4">¿Necesitas ayuda con tu cuenta corporativa?</p>
                        <button 
                            onClick={() => handleAction('Chat Soporte')}
                            className="text-[10px] font-black uppercase bg-white/5 hover:bg-white/10 w-full py-3 rounded-xl transition-all active:scale-95 border border-white/5"
                        >
                            Chat 24/7 en Línea
                        </button>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors w-full font-black uppercase text-[10px] tracking-widest group"
                    >
                        <Lock size={18} className="group-hover:rotate-12 transition-transform" /> Finalizar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar bg-[#020408]">
                {/* Header Section */}
                <header className="px-10 py-8 flex justify-between items-center sticky top-0 z-40 bg-[#020408]/60 backdrop-blur-xl">
                    <div className="flex flex-col">
                        <h2 className="text-xs font-black text-cyan-400/80 uppercase tracking-widest mb-1">Status: Operativo</h2>
                        <h1 className="text-3xl font-black tracking-tighter">Bienvenido, {user.full_name.split(' ')[0]}</h1>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 p-1 bg-white/5 rounded-2xl">
                            <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                <Search size={20}/>
                            </button>
                            <button className="relative p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                <Bell size={20}/>
                                <span className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#020408]"></span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-white/5 rounded-2xl transition-all">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black tracking-tight">{user.full_name}</p>
                                <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">{user.role}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[2px]">
                                <div className="w-full h-full rounded-[14px] bg-[#020408] overflow-hidden">
                                    <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=111&color=fff`} className="w-full h-full object-cover" alt="avatar" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="px-10 pb-20 max-w-7xl mx-auto w-full space-y-12">
                    {/* Hero Section - The "Vault" Card */}
                    <section>
                        <div className="relative group p-1 bg-gradient-to-br from-purple-500/30 via-transparent to-cyan-500/30 rounded-[3rem]">
                            <div className="relative bg-[#05070A] rounded-[2.9rem] overflow-hidden p-12 flex flex-col lg:flex-row justify-between items-center gap-12 border border-white/5">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
                                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4"></div>
                                
                                <div className="space-y-8 z-10 text-center lg:text-left">
                                    <div>
                                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em] mb-4 flex items-center justify-center lg:justify-start gap-2">
                                            <ShieldCheck size={14} className="text-cyan-400" /> Encriptación Militar Activa
                                        </p>
                                        <h2 className="text-7xl font-black tracking-tighter leading-none mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                            ${totalBalance.toLocaleString()}
                                        </h2>
                                        <p className="text-sm font-bold text-slate-400">Total acumulado en todas tus carteras digitales</p>
                                    </div>
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                        <ActionBtn icon={<Send size={20}/>} label="Enviar Dinero" onClick={() => setIsTransferOpen(true)} primary />
                                        <ActionBtn icon={<Plus size={20}/>} label="Cargar Cuenta" onClick={() => setIsDepositOpen(true)} />
                                        <ActionBtn icon={<Info size={20}/>} label="Auditar Cartola" onClick={handleDownloadStatement} />
                                    </div>
                                </div>
                                
                                {/* The Virtual Card */}
                                <div className="relative z-10">
                                    <div className="w-[380px] h-[240px] bg-gradient-to-br from-slate-900 via-[#0A0C10] to-[#020408] rounded-[2.5rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-700">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
                                        <div className="flex justify-between items-start mb-16">
                                            <div>
                                                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Lumina Black</p>
                                                <p className="font-bold text-lg tracking-tight">Virtual World</p>
                                            </div>
                                            <Zap size={24} className="text-cyan-400" />
                                        </div>
                                        <p className="text-2xl font-mono tracking-[0.3em] mb-8 text-slate-100">4291 5821 •••• ••••</p>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase mb-0.5">Valid Thru</p>
                                                <p className="text-sm font-bold">12 / 29</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-8 h-8 rounded-full bg-purple-500/50 backdrop-blur-sm"></div>
                                                <div className="w-8 h-8 rounded-full bg-cyan-500/50 backdrop-blur-sm -ml-4"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats & Products */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* History */}
                        <div id="transactions-section" className="lg:col-span-8 space-y-8">
                            <div className="flex justify-between items-end px-2">
                                <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                    Últimos Movimientos
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                </h3>
                                <button onClick={() => handleAction('Historial')} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                                    Ver Todo <ChevronRight size={14}/>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {transactions.length > 0 ? (
                                    transactions.slice(0, 5).map(tx => (
                                        <div key={tx.id} className="p-6 bg-white/[0.02] hover:bg-white/[0.05] rounded-[2rem] border border-white/5 flex items-center justify-between transition-all group cursor-pointer">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-cyan-400/10 text-cyan-400' : 'bg-purple-400/10 text-purple-400'}`}>
                                                    {tx.type === 'deposit' ? <ArrowDownLeft size={24}/> : <ArrowUpRight size={24}/>}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg group-hover:text-white transition-colors">{tx.description || (tx.type === 'deposit' ? 'Abono Recibido' : 'Pago Realizado')}</p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{new Date(tx.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })} • ID #{tx.id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xl font-black ${tx.type === 'deposit' ? 'text-cyan-400' : 'text-slate-100'}`}>
                                                    {tx.type === 'deposit' ? '+' : '-'}${Math.abs(parseFloat(tx.amount)).toLocaleString()}
                                                </p>
                                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Lumina-Chain Verified</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                        <History size={48} className="mx-auto text-slate-800 mb-4" />
                                        <p className="text-slate-600 font-black uppercase text-xs tracking-[0.3em]">Esperando transacciones...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Cards */}
                        <div className="lg:col-span-4 space-y-6">
                            <h3 className="text-xl font-black tracking-tighter px-2 mb-8">Tus Carteras</h3>
                            {accounts.map((acc, i) => (
                                <div key={i} className="p-8 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[2.5rem] border border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer group relative overflow-hidden" onClick={() => handleAction(`Cuenta ${acc.account_number}`)}>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 blur-2xl group-hover:bg-cyan-400/10 transition-colors"></div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                            <Wallet size={22} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Cód. Cartera</p>
                                            <p className="text-sm font-bold text-slate-400">{acc.account_number}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{acc.account_number.startsWith('SAV') ? 'Liquidez de Ahorro' : 'Balance Corriente'}</p>
                                    <h4 className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">${parseFloat(acc.balance).toLocaleString()}</h4>
                                </div>
                            ))}
                            
                            <button className="w-full py-6 rounded-[2rem] border-2 border-dashed border-white/5 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:border-purple-500/50 hover:text-purple-400 transition-all flex items-center justify-center gap-3">
                                <Plus size={18} /> Abrir Nueva Cuenta Lumina
                            </button>
                        </div>
                    </section>
                </div>

                <TransferModal 
                    isOpen={isTransferOpen} 
                    onClose={() => setIsTransferOpen(false)} 
                    onSuccess={fetchData}
                    accounts={accounts}
                />
                <DepositModal 
                    isOpen={isDepositOpen} 
                    onClose={() => setIsDepositOpen(false)} 
                    onSuccess={fetchData}
                    accounts={accounts}
                />
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active = false, onClick, highlight = false }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-500 group ${
            active 
            ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl shadow-purple-600/20' 
            : highlight 
                ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
        }`}
    >
        <span className={`${active ? 'text-white' : 'group-hover:text-cyan-400'} transition-colors`}>{icon}</span>
        <span className={`font-bold text-sm tracking-tight ${active ? 'text-white' : ''}`}>{label}</span>
        {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
);

const ActionBtn = ({ icon, label, onClick, primary = false }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 px-8 py-5 rounded-[1.5rem] transition-all duration-500 hover:-translate-y-1 active:scale-95 group font-black text-xs uppercase tracking-widest ${
            primary 
            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-2xl shadow-purple-500/30 border-none' 
            : 'bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10'
        }`}
    >
        <span className={primary ? 'text-white' : 'text-cyan-400'}>{icon}</span>
        {label}
    </button>
);

export default Dashboard;
