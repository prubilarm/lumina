import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CreditCard, ArrowUpRight, ArrowDownLeft, 
  History as HistoryIcon, Settings, LogOut, Plus, Wallet,
  Bell, Search, User, Zap, ShieldCheck
} from 'lucide-react';
import api from '../utils/api';
import DepositModal from '../components/DepositModal';
import TransferModal from '../components/TransferModal';
import CardsModal from '../components/CardsModal';
import InvestmentsModal from '../components/InvestmentsModal';
import TransactionsModal from '../components/TransactionsModal';
import SettingsModal from '../components/SettingsModal';
import AdminAuditPanel from '../components/AdminAuditPanel';
import CardGallery from '../components/CardGallery';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isCardsOpen, setIsCardsOpen] = useState(false);
  const [isInvestmentsOpen, setIsInvestmentsOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [userRes, balanceRes, historyRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/user/balance'),
        api.get('/transactions/history')
      ]);
      setUser(userRes.data);
      setAccounts(Array.isArray(balanceRes.data) ? balanceRes.data : []);
      setTransactions(historyRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = (type) => {
    if (type === 'deposit') setIsDepositOpen(true);
    else if (type === 'transfer') setIsTransferOpen(true);
    else if (type === 'cards') setIsCardsOpen(true);
    else if (type === 'investments') setIsInvestmentsOpen(true);
    else if (type === 'transactions') setIsTransactionsOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b,transparent)] pointer-events-none opacity-50"></div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-[#05070A]/80 backdrop-blur-3xl border-r border-white/5 z-50 p-10 flex flex-col justify-between">
        <div className="space-y-12">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
              <Zap className="text-white" fill="currentColor" size={24} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">LUMINA</h1>
          </div>

          <nav className="space-y-2">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
            <NavItem icon={<CreditCard size={20} />} label="Mis Tarjetas" onClick={() => setIsCardsOpen(true)} />
            <NavItem icon={<HistoryIcon size={20} />} label="Movimientos" onClick={() => setIsTransactionsOpen(true)} />
            <NavItem icon={<ArrowUpRight size={20} />} label="Transferir" onClick={() => setIsTransferOpen(true)} />
            <NavItem icon={<Settings size={20} />} label="Ajustes" onClick={() => setIsSettingsOpen(true)} />
            {user?.role === 'admin' && (
              <NavItem icon={<ShieldCheck size={20} className="text-purple-400" />} label="Auditoría" onClick={() => setIsAdminOpen(true)} />
            )}
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-4 p-5 rounded-2xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold text-sm uppercase tracking-widest">
          <LogOut size={20} /> Salir de sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="pl-80 min-h-screen">
        <header className="p-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter">Hola, {user?.full_name?.split(' ')[0]}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Estado de cuenta: <span className="text-emerald-500">Activa</span> • <span className="text-indigo-400">Premium</span></p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input type="text" placeholder="Buscar transacción..." className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm w-80 outline-none focus:border-indigo-500/50 transition-all" />
            </div>
            <button className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020408]"></span>
            </button>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <User size={24} />
            </div>
          </div>
        </header>

        <div className="p-10 space-y-10 relative z-10">
          <div className="grid grid-cols-3 gap-10">
            {/* Unified Card Gallery */}
            <div className="col-span-2 min-h-[420px] bg-[#05070A] border border-white/5 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden flex items-center justify-center">
               <CardGallery accounts={accounts} onAction={handleAction} />
            </div>

            {/* Quick Summary */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Resumen de Actividad</p>
                <div className="space-y-8">
                  <SummaryItem label="Ingresos" amount="+$2.450.000" color="text-emerald-500" icon={<ArrowDownLeft size={24} />} />
                  <SummaryItem label="Gastos" amount="-$840.200" color="text-rose-500" icon={<ArrowUpRight size={24} />} />
                </div>
              </div>
              <button onClick={() => setIsTransactionsOpen(true)} className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Ver reporte detallado</button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-[#05070A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-10 flex justify-between items-center border-b border-white/5">
              <h3 className="text-xl font-black text-white tracking-tighter italic">Actividad Reciente</h3>
              <button onClick={() => setIsTransactionsOpen(true)} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300">Ver todo</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.01]">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transacción</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.slice(0, 5).map(tx => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'withdraw' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {tx.type === 'withdraw' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                          </div>
                          <p className="text-sm font-bold text-white">{tx.description || 'Transferencia'}</p>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className={`px-10 py-6 text-sm font-black text-right ${tx.type === 'withdraw' ? 'text-white' : 'text-emerald-500'}`}>
                        {tx.type === 'withdraw' ? '-' : '+'}${parseFloat(tx.amount).toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} onSuccess={fetchData} accounts={accounts} />
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} onSuccess={fetchData} accounts={accounts} />
      <CardsModal isOpen={isCardsOpen} onClose={() => setIsCardsOpen(false)} user={user} accounts={accounts} onUpdate={fetchData} />
      <InvestmentsModal isOpen={isInvestmentsOpen} onClose={() => setIsInvestmentsOpen(false)} />
      <TransactionsModal isOpen={isTransactionsOpen} onClose={() => setIsTransactionsOpen(false)} user={user} accounts={accounts} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />
      <AdminAuditPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
    {icon} {label}
  </button>
);

const SummaryItem = ({ label, amount, color, icon }) => (
  <div className="flex items-center gap-6">
    <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={`text-xl font-black ${color}`}>{amount}</p>
    </div>
  </div>
);

export default Dashboard;
