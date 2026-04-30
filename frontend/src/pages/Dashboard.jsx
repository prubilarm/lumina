import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History as HistoryIcon, 
  Settings, 
  LogOut, 
  Plus, 
  Wallet,
  Bell,
  Search,
  User,
  Zap,
  HelpCircle,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import api from '../utils/api';
import DepositModal from '../components/DepositModal';
import TransferModal from '../components/TransferModal';
import CardsModal from '../components/CardsModal';
import InvestmentsModal from '../components/InvestmentsModal';
import TransactionsModal from '../components/TransactionsModal';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [featureName, setFeatureName] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isCardsOpen, setIsCardsOpen] = useState(false);
  const [isInvestmentsOpen, setIsInvestmentsOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  
  const lastTxIdRef = useRef(null);
  const navigate = useNavigate();

  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      
      const userResponse = await api.get('/user/profile');
      setUser(userResponse.data);
      
      const accountsResponse = await api.get('/user/balance');
      setAccounts(Array.isArray(accountsResponse.data) ? accountsResponse.data : []);

      const txsResponse = await api.get('/transactions/history');
      const latestTxs = Array.isArray(txsResponse.data) ? txsResponse.data : [];
      setTransactions(latestTxs.slice(0, 5));

      // Notification Logic: Check for new incoming transfers
      if (latestTxs.length > 0) {
        const newestTx = latestTxs[0];
        // If it's a new transaction, check notification logic
        if (lastTxIdRef.current && newestTx.id > lastTxIdRef.current) {
          // Only notify if the backend confirms it is an incoming transfer for us
          if (newestTx.type === 'transfer' && newestTx.is_incoming) {
             Swal.fire({
                title: '¡Transferencia Recibida!',
                html: `
                  <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
                    <p class="text-[10px] uppercase font-black tracking-widest text-emerald-400">Notificación Formal Lumina</p>
                    <p class="text-2xl font-black text-white mt-2">$${parseFloat(newestTx.amount).toLocaleString('es-CL')}</p>
                    <p class="text-xs text-slate-400 mt-1">${newestTx.description || 'Fondos acreditados'}</p>
                  </div>
                `,
                icon: 'success',
                background: '#05070A',
                color: '#f8fafc',
                confirmButtonColor: '#10b981',
                confirmButtonText: 'Entendido',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
             });
          }
        }
        lastTxIdRef.current = newestTx.id;
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (isInitial) setError('No se pudieron cargar los datos. Por favor, inicia sesión de nuevo.');
      if (err.response?.status === 401) navigate('/login');
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    
    // Polling for real-time notifications
    const interval = setInterval(() => {
      fetchData(false);
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAction = (name) => {
    if (name === 'transferencias') {
      setIsTransferOpen(true);
      return;
    }
    if (name === 'depositos') {
      setIsDepositOpen(true);
      return;
    }
    if (name === 'tarjetas') {
      setIsCardsOpen(true);
      return;
    }
    if (name === 'movimientos') {
      setIsTransactionsOpen(true);
      return;
    }
    if (name === 'inversiones') {
      setIsInvestmentsOpen(true);
      return;
    }
    setFeatureName(name);
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#020408_100%)] opacity-40"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs animate-pulse">Iniciando Terminal Lumina</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center p-6">
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center max-w-md backdrop-blur-xl">
          <p className="text-red-400 mb-6 font-medium">{error}</p>
          <button onClick={() => navigate('/login')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl transition-all">Volver al Login</button>
        </div>
      </div>
    );
  }

  const totalBalance = Array.isArray(accounts) 
    ? accounts.reduce((acc, curr) => acc + parseFloat(curr.balance || 0), 0)
    : 0;

  const mainAccount = (Array.isArray(accounts) && accounts.length > 0) 
    ? accounts[0] 
    : { balance: 0, account_number: '---', currency: 'CLP' };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 flex font-sans overflow-hidden">
      {/* Notifications Toast */}
      {showComingSoon && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-8 duration-500">
          <div className="bg-[#0A0C10] border border-cyan-500/30 px-8 py-4 rounded-2xl shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)] flex items-center gap-4 backdrop-blur-2xl">
            <Zap size={20} className="text-cyan-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Notificación</p>
              <p className="text-sm font-bold text-white">Módulo de <span className="uppercase">{featureName}</span> disponible próximamente.</p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-72 bg-[#05070a] border-r border-white/5 flex flex-col z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">LUMINA</span>
          </div>

          <nav className="space-y-2">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
            <NavItem icon={<CreditCard size={20} />} label="Mis Tarjetas" onClick={() => handleAction('tarjetas')} />
            <NavItem icon={<HistoryIcon size={20} />} label="Movimientos" onClick={() => handleAction('movimientos')} />
            <NavItem icon={<ArrowUpRight size={20} />} label="Transferir" onClick={() => handleAction('transferencias')} />
            <NavItem icon={<Plus size={20} />} label="Inversiones" onClick={() => handleAction('inversiones')} />
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border border-white/10 p-6 rounded-2xl">
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Soporte Lumina</p>
            <p className="text-sm text-slate-400 mb-4 font-medium leading-relaxed">¿Necesitas ayuda con tu cuenta premium?</p>
            <button onClick={() => handleAction('soporte')} className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                <MessageSquare size={14} /> Chatear ahora
            </button>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all font-bold"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar bg-[#020408]">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/5 blur-[120px] rounded-full"></div>
        </div>

        {/* Header Section */}
        <header className="px-10 py-8 flex justify-between items-center sticky top-0 z-40 bg-[#020408]/60 backdrop-blur-xl border-b border-white/5">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-white tracking-tight">Hola, {user?.full_name?.split(' ')[0] || 'Cliente'}</h2>
            <p className="text-slate-500 text-sm font-medium">Estado de cuenta: <span className="text-cyan-500 uppercase tracking-widest text-[10px] font-black">Activa • Premium</span></p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar transacción..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-cyan-500/50 outline-none w-64 transition-all"
              />
            </div>
            <button onClick={() => handleAction('notificaciones')} className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <Bell size={20} className="text-slate-300" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#020408]"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="w-10 h-10 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                <User className="text-slate-400" size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-10 space-y-10 relative z-10">
          <div className="grid grid-cols-3 gap-8">
            {/* Elegant Balance Card */}
            <div className="col-span-2 bg-[#0A0C10] border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
              {/* Background Gradient Orbs */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-16">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Lumina Wealth Management</p>
                      <h4 className="text-white font-bold text-sm tracking-tight">Estado de Patrimonio Neto</h4>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAction('depositos')}
                    className="group/btn flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-4 transition-all active:scale-95"
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300 group-hover/btn:text-white transition-colors">Cargar Saldo</span>
                    <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                      <Plus size={18} />
                    </div>
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] ml-1">Saldo Total Disponible</p>
                  <div className="flex items-baseline gap-4">
                    <h3 className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                      ${totalBalance.toLocaleString('es-CL')}
                    </h3>
                    <span className="text-2xl font-black text-slate-700 tracking-tighter uppercase">CLP</span>
                  </div>
                </div>

                <div className="mt-12 flex items-center gap-6">
                  <div className="bg-white/[0.03] backdrop-blur-md px-8 py-4 rounded-2xl border border-white/5 flex items-center gap-4 group/chip hover:bg-white/[0.06] transition-all">
                    <ShieldCheck size={18} className="text-cyan-400" />
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Cuenta Activa</p>
                      <p className="text-sm font-mono text-white tracking-widest">{mainAccount.account_number}</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Servicio Operativo</span>
                  </div>
                </div>
              </div>

              {/* Massive Decorative Logo */}
              <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Zap size={350} fill="currentColor" />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Resumen Mensual</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                      <ArrowDownLeft size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Ingresos</p>
                      <p className="text-lg font-black text-white">+$2.450.000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400">
                      <ArrowUpRight size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Gastos</p>
                      <p className="text-lg font-black text-white">-$840.200</p>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={() => handleAction('reportes')} className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-300 transition-all">
                Ver Reporte Detallado
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
              <h4 className="text-xl font-black text-white tracking-tight">Actividad Reciente</h4>
              <button onClick={() => handleAction('movimientos')} className="text-cyan-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">Ver Todo</button>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transacción</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoría</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <TableRow 
                        key={tx.id}
                        name={tx.description || (tx.type === 'transfer' ? 'Transferencia' : 'Depósito')}
                        category={tx.type === 'transfer' ? 'Transferencia' : 'Depósito'}
                        date={new Date(tx.created_at).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        amount={`${tx.type === 'withdraw' || (tx.sender_id && tx.sender_id === accounts[0]?.id) ? '-' : '+'} $${parseFloat(tx.amount).toLocaleString('es-CL')}`}
                        type={tx.type === 'withdraw' || (tx.sender_id && tx.sender_id === accounts[0]?.id) ? 'expense' : 'income'}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-10 text-center text-slate-500 font-medium">No se registran movimientos recientes</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        onSuccess={() => fetchData(false)} 
        accounts={accounts} 
      />
      <TransferModal 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        onSuccess={() => fetchData(false)} 
        accounts={accounts} 
      />
      <CardsModal 
        isOpen={isCardsOpen} 
        onClose={() => setIsCardsOpen(false)} 
        user={user}
        accounts={accounts}
      />
      <InvestmentsModal 
        isOpen={isInvestmentsOpen} 
        onClose={() => setIsInvestmentsOpen(false)} 
      />
      <TransactionsModal 
        isOpen={isTransactionsOpen} 
        onClose={() => setIsTransactionsOpen(false)} 
        transactions={transactions}
        accounts={accounts}
      />
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-gradient-to-r from-purple-600/20 to-cyan-500/20 text-white border border-white/10' 
        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
    }`}
  >
    <div className={`${active ? 'text-cyan-400' : 'group-hover:text-purple-400'} transition-colors`}>
      {icon}
    </div>
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);

const TableRow = ({ name, category, date, amount, type }) => (
  <tr className="group hover:bg-white/5 transition-all">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
          type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
        }`}>
          {name.charAt(0)}
        </div>
        <span className="font-bold text-white text-sm">{name}</span>
      </div>
    </td>
    <td className="px-8 py-6">
      <span className="text-xs font-bold text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg uppercase tracking-wider">{category}</span>
    </td>
    <td className="px-8 py-6 text-sm text-slate-500 font-medium">{date}</td>
    <td className={`px-8 py-6 text-sm font-black text-right ${type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
      {amount}
    </td>
  </tr>
);

export default Dashboard;
