import React, { useState, useEffect } from 'react';
import { 
    X, Shield, Search, User, CreditCard, ArrowRight, ArrowLeft, 
    History as HistoryIcon, Lock, Unlock, Eye, Info, Wallet, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Swal from 'sweetalert2';
import PlasticCard from './PlasticCard';

const AdminAuditPanel = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [userHistory, setUserHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchUsers();
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/user/audit/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Audit Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserHistory = async (userId) => {
        setHistoryLoading(true);
        try {
            const response = await api.get(`/user/audit/transactions/${userId}`);
            setUserHistory(response.data);
        } catch (err) {
            console.error('History Fetch Error:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSelectedAccount(null);
        fetchUserHistory(user.id);
    };

    const handleSelectAccount = (accountId) => {
        setSelectedAccount(accountId);
    };

    const handleUnblock = async (accountId) => {
        try {
            await api.post('/user/unblock-account', { accountId });
            Swal.fire({ icon: 'success', title: 'Cuenta Desbloqueada', background: '#0f172a', color: '#f8fafc' });
            fetchUsers(); // Refresh
            if (selectedUser) {
                const updatedUser = { ...selectedUser };
                updatedUser.accounts = updatedUser.accounts.map(a => a.id === accountId ? { ...a, is_blocked: false } : a);
                setSelectedUser(updatedUser);
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message, background: '#0f172a', color: '#f8fafc' });
        }
    };

    if (!isOpen) return null;

    const filteredUsers = users.filter(u => 
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredHistory = selectedAccount 
        ? userHistory.filter(tx => tx.sender_account_id === selectedAccount || tx.receiver_account_id === selectedAccount)
        : userHistory;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#020408]/98 backdrop-blur-2xl">
            <div className="w-full max-w-6xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[90vh]">
                
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter">Terminal de Auditoría</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Panel de Control Administrativo Lumina</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* User List Side */}
                    <div className={`w-full ${selectedUser ? 'hidden lg:flex' : 'flex'} lg:w-2/5 border-r border-white/5 flex flex-col bg-black/20`}>
                        <div className="p-6 border-b border-white/5">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nombre o correo..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white outline-none focus:border-purple-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                            {filteredUsers.map(u => (
                                <button 
                                    key={u.id}
                                    onClick={() => handleSelectUser(u)}
                                    className={`w-full p-6 rounded-[2rem] border transition-all text-left flex items-center justify-between ${selectedUser?.id === u.id ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xs text-slate-400">
                                            {u.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">{u.full_name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold">{u.email}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={18} className="text-slate-700" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Detail Side (PLASTICS) */}
                    <div className={`flex-1 flex flex-col ${!selectedUser ? 'hidden lg:flex' : 'flex'} bg-black/40`}>
                        {selectedUser ? (
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                                <div className="p-10 border-b border-white/5 flex justify-between items-end">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black">
                                            {selectedUser.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white tracking-tighter">{selectedUser.full_name}</h2>
                                            <p className="text-slate-500">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className="lg:hidden p-3 bg-white/5 rounded-2xl text-slate-400">
                                        <ArrowLeft size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                                    <div className="space-y-8">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Cuentas y Tarjetas Asociadas</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {selectedUser.accounts?.map((acc, index) => {
                                                const isCredit = acc.account_number?.startsWith('CRD') || index === 1;
                                                return (
                                                    <div key={acc.id} onClick={() => handleSelectAccount(acc.id)} className="relative h-[280px]">
                                                        <PlasticCard 
                                                            account={acc} 
                                                            isCredit={isCredit} 
                                                            cardType={isCredit ? 'Tarjeta de Crédito' : 'Tarjeta de Débito'}
                                                            hideActions={true}
                                                        />
                                                        {acc.is_blocked && (
                                                            <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px] rounded-[2rem] z-20 flex flex-col items-center justify-center gap-4">
                                                                <Lock size={24} className="text-rose-500" />
                                                                <button onClick={(e) => { e.stopPropagation(); handleUnblock(acc.id); }} className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl">
                                                                    Habilitar Plástico
                                                                </button>
                                                            </div>
                                                        )}
                                                        {selectedAccount === acc.id && (
                                                            <div className="absolute -top-3 -right-3 bg-purple-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl z-30">
                                                                Seleccionado
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* History Table */}
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Historial de Movimientos</h4>
                                        <div className="bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-white/5 bg-white/[0.01]">
                                                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Fecha</th>
                                                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Descripción</th>
                                                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Monto</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {filteredHistory.map(tx => (
                                                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-8 py-5 text-[10px] font-mono text-slate-400">{new Date(tx.created_at).toLocaleString('es-CL')}</td>
                                                            <td className="px-8 py-5 text-[11px] font-bold text-white">{tx.description}</td>
                                                            <td className="px-8 py-5 text-xs font-black text-white text-right">${parseFloat(tx.amount).toLocaleString('es-CL')}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-20 text-center text-slate-500 font-black uppercase tracking-widest text-xs">
                                Selecciona un usuario para auditar sus plásticos
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAuditPanel;
