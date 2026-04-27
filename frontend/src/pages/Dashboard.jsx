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
  Info
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

    const handleAction = (feature) => {
        alert(`${feature}: Módulo en mantenimiento preventivo por actualización de sistemas Sentendar.`);
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
        <div className="flex h-screen bg-[#05070A] text-white font-sans overflow-hidden">
            {/* Sidebar - Inspired by High-End Banking Portals */}
            <aside className="w-72 border-r border-white/5 bg-[#0A0C10]/80 backdrop-blur-xl hidden lg:flex flex-col p-8">
                <div className="flex items-center gap-3 mb-16 px-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <ShieldCheck size={24} strokeWidth={2.5} />
                    </div>
                    <span className="font-black text-2xl tracking-tighter">Sentendar<span className="text-indigo-500">.</span></span>
                </div>
                
                <nav className="flex-1 space-y-3">
                    <NavItem icon={<LayoutDashboard size={20}/>} label="Cuadro de Mando" active />
                    <NavItem icon={<Wallet size={20}/>} label="Mis Cuentas" onClick={() => handleAction('Mis Cuentas')} />
                    <NavItem icon={<CreditCard size={20}/>} label="Tarjetas Platinum" onClick={() => handleAction('Tarjetas Platinum')} />
                    <NavItem icon={<History size={20}/>} label="Movimientos" onClick={() => handleAction('Movimientos')} />
                    <NavItem icon={<BarChart3 size={20}/>} label="Análisis de Gasto" onClick={() => handleAction('Análisis de Gasto')} />
                    <div className="pt-8 mb-4">
                        <p className="px-4 text-[10px] font-black uppercase text-slate-600 tracking-[0.25em] mb-4">Administración</p>
                        {user.role === 'admin' && (
                            <NavItem icon={<Users size={20}/>} label="Panel Auditoría" onClick={() => navigate('/admin')} highlight />
                        )}
                        <NavItem icon={<Settings size={20}/>} label="Configuración" onClick={() => handleAction('Configuración')} />
                    </div>
                </nav>

                <div className="pt-8 border-t border-white/5 mt-auto">
                    <button onClick={handleLogout} className="flex items-center gap-4 text-slate-500 hover:text-red-400 transition-all duration-300 w-full p-4 rounded-2xl hover:bg-red-500/5 group">
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Desconectar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar">
                {/* Header Section */}
                <header className="px-10 py-8 flex justify-between items-center sticky top-0 z-30 bg-[#05070A]/80 backdrop-blur-md">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-slate-500">Hola de nuevo,</h2>
                        <h1 className="text-2xl font-black tracking-tight">{user.full_name}</h1>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6 pr-8 border-r border-white/5">
                            <button onClick={() => handleAction('Notificaciones')} className="relative text-slate-400 hover:text-white transition-all transform hover:scale-110">
                                <Bell size={22}/>
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#05070A]"></span>
                            </button>
                            <button onClick={() => handleAction('Dispositivos')} className="text-slate-400 hover:text-white transition-all transform hover:scale-110">
                                <Smartphone size={22}/>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => handleAction('Perfil')}>
                            <div className="text-right">
                                <p className="text-xs font-black uppercase tracking-tighter text-indigo-400">{user.role}</p>
                                <p className="text-[10px] text-slate-500 font-bold">Ver Perfil</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500 overflow-hidden shadow-xl group-hover:ring-2 ring-indigo-500/50 transition-all ring-offset-4 ring-offset-[#05070A]">
                                <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=6366f1&color=fff`} className="w-full h-full object-cover" alt="avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="px-10 pb-20 max-w-7xl mx-auto w-full">
                    {/* Top Row: Hero Balance & Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                        <div className="lg:col-span-8">
                            <div className="relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3rem] opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                                
                                <div className="relative p-12 z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                    <div className="space-y-6 text-center md:text-left">
                                        <div>
                                            <p className="text-indigo-200/60 text-xs font-black uppercase tracking-[0.3em] mb-3">Saldo Neto Disponible</p>
                                            <h2 className="text-7xl font-black tracking-tighter leading-none">${totalBalance.toLocaleString()}</h2>
                                        </div>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                            <ActionBtn icon={<Send size={20}/>} label="Transferir" onClick={() => setIsTransferOpen(true)} primary />
                                            <ActionBtn icon={<Plus size={20}/>} label="Depositar" onClick={() => setIsDepositOpen(true)} />
                                            <ActionBtn icon={<Info size={20}/>} label="Estado" onClick={() => handleAction('Estado de Cuenta')} />
                                        </div>
                                    </div>
                                    
                                    <div className="w-full max-w-[320px]" onClick={() => handleAction('Detalle Tarjeta Premium')}>
                                        <div className="glass p-8 rotate-3 hover:rotate-0 transition-all duration-700 bank-shadow relative border-white/20 cursor-pointer">
                                            <div className="flex justify-between items-start mb-12">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Visa Platinum</p>
                                                    <p className="font-bold text-sm tracking-tight text-white/90">Sentendar Bank</p>
                                                </div>
                                                <div className="w-12 h-9 bg-yellow-400/80 rounded-lg shadow-inner flex items-center justify-center opacity-70">
                                                    <div className="w-8 h-6 border-[1px] border-black/10 rounded"></div>
                                                </div>
                                            </div>
                                            <p className="text-xl font-mono tracking-[0.25em] mb-8 text-white/80">•••• •••• •••• 4291</p>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[8px] font-black text-white/40 uppercase mb-0.5">Exp Date</p>
                                                    <p className="text-sm font-bold text-white/90">12 / 28</p>
                                                </div>
                                                <h3 className="text-3xl font-black italic opacity-20 transform -translate-y-2">VISA</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Sidebar Column */}
                        <div className="lg:col-span-4 space-y-6">
                            <div onClick={() => handleAction('Análisis')} className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-center gap-6 cursor-pointer hover:bg-indigo-500/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                        <BarChart3 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Gasto Mensual</p>
                                        <p className="text-xl font-black">$242,500 <span className="text-xs text-red-500 font-bold ml-2">↑ 12%</span></p>
                                    </div>
                                </div>
                                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full w-[65%]" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold">Te quedan $125.000 de tu presupuesto sugerido para este período.</p>
                            </div>
                            
                            <div onClick={() => handleAction('Metas')} className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-center gap-4 cursor-pointer hover:bg-emerald-500/10 transition-all">
                                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Objetivo: Ahorro Vacaciones</h4>
                                <div className="flex justify-between items-end">
                                    <p className="text-2xl font-black">$1.2M</p>
                                    <p className="text-xs font-bold text-slate-500">Goal: $2.0M</p>
                                </div>
                                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full w-[60%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: History & Detailed Accounts */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8">
                            <div className="flex justify-between items-center mb-8 px-2">
                                <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                    Historial de Actividad
                                    <span className="text-xs font-bold bg-white/5 px-3 py-1 rounded-full text-slate-500">Reciente</span>
                                </h3>
                                <button onClick={handleDownloadStatement} className="text-indigo-400 text-sm font-black hover:text-indigo-300 transition-colors uppercase tracking-widest">Descargar Cartola</button>
                            </div>
                            
                            <div className="space-y-4">
                                {transactions.length > 0 ? (
                                    transactions.slice(0, 6).map(tx => (
                                        <div key={tx.id} className="glass p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all group hover:-translate-y-1 border border-white/5 cursor-pointer" onClick={() => handleAction('Detalle Movimiento')}>
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-100'}`}>
                                                    {tx.type === 'deposit' ? <ArrowDownLeft size={24}/> : <ArrowUpRight size={24}/>}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">{tx.description || (tx.type === 'deposit' ? 'Depósito Recibido' : 'Transferencia Realizada')}</p>
                                                    <p className="text-xs text-slate-500 font-medium">Operación {tx.id} • {new Date(tx.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xl font-black ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-white'}`}>
                                                    {tx.type === 'deposit' ? '+' : '-'}${Math.abs(parseFloat(tx.amount)).toLocaleString()}
                                                </p>
                                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Confirmado</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-24 text-center glass border-dashed bg-white/[0.01]">
                                        <History size={48} className="mx-auto text-slate-800 mb-4" />
                                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Sin registro de movimientos</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-4 gap-8 flex flex-col">
                            <h3 className="text-xl font-black tracking-tighter px-2">Mis Productos</h3>
                            {accounts.map((acc, i) => (
                                <div key={i} className="glass p-8 border-l-4 border-indigo-500 hover:bg-white/[0.04] transition-all cursor-pointer group" onClick={() => handleAction(`Cuenta ${acc.account_number}`)}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                            <Wallet size={24} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Nº Cuenta</p>
                                            <p className="text-sm font-bold tracking-tighter text-slate-400">{acc.account_number}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">{acc.account_number.startsWith('SAV') ? 'Cta. de Ahorro' : 'Cta. Corriente Platinum'}</p>
                                    <h4 className="text-3xl font-black">${parseFloat(acc.balance).toLocaleString()}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
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
        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${
            active 
            ? 'glass-dark bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 relative' 
            : highlight 
                ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
        }`}
    >
        {active && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-full" />}
        <span className={active ? 'text-white' : ''}>{icon}</span>
        <span className={`font-bold text-sm tracking-tight ${active ? 'text-white' : ''}`}>{label}</span>
    </button>
);

const ActionBtn = ({ icon, label, onClick, primary = false }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 group font-bold text-sm ${
            primary 
            ? 'bg-white text-indigo-900 shadow-2xl hover:bg-indigo-50' 
            : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
        }`}
    >
        <span className={primary ? 'text-indigo-600' : 'text-indigo-400'}>{icon}</span>
        {label}
    </button>
);

export default Dashboard;
