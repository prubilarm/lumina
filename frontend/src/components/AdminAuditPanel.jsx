import React, { useState, useEffect } from 'react';
import { X, Shield, Search, User, CreditCard, ArrowRight, ArrowLeft, History, Lock, Unlock, Eye, Info, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Swal from 'sweetalert2';

const AdminAuditPanel = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [userHistory, setUserHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
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
        setSelectedAccount(null); // Reset account filter when user changes
        fetchUserHistory(user.id);
    };

    const handleSelectAccount = (accountId) => {
        setSelectedAccount(accountId);
    };

    const handleUnblock = async (accountId) => {
        try {
            await api.post('/user/unblock-account', { accountId });
            Swal.fire({
                icon: 'success',
                title: 'Cuenta Desbloqueada',
                text: 'La tarjeta ahora está operativa nuevamente.',
                background: '#0f172a',
                color: '#f8fafc'
            });
            // Update local state
            setUsers(prev => prev.map(u => ({
                ...u,
                accounts: u.accounts.map(a => a.id === accountId ? { ...a, is_blocked: false } : a)
            })));
            if (selectedUser) {
                setSelectedUser(prev => ({
                    ...prev,
                    accounts: prev.accounts.map(a => a.id === accountId ? { ...a, is_blocked: false } : a)
                }));
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
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-purple-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map(u => (
                                    <button 
                                        key={u.id}
                                        onClick={() => handleSelectUser(u)}
                                        className={`w-full p-6 rounded-[2rem] border transition-all text-left flex items-center justify-between group ${selectedUser?.id === u.id ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${selectedUser?.id === u.id ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400 group-hover:bg-purple-500/20 group-hover:text-purple-400'}`}>
                                                {u.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{u.full_name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{u.email}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className={`transition-transform ${selectedUser?.id === u.id ? 'text-purple-400 translate-x-1' : 'text-slate-700'}`} />
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">No se encontraron usuarios</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Detail Side */}
                    <div className={`flex-1 flex flex-col ${!selectedUser ? 'hidden lg:flex' : 'flex'} bg-black/40`}>
                        {selectedUser ? (
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={selectedUser.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex-1 flex flex-col h-full overflow-hidden"
                                >
                                    {/* User Detail Header */}
                                    <div className="p-10 border-b border-white/5 flex justify-between items-end">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                                                {selectedUser.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h2 className="text-3xl font-black text-white tracking-tighter">{selectedUser.full_name}</h2>
                                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-purple-500/20">{selectedUser.role}</span>
                                                </div>
                                                <p className="text-slate-500 font-medium">{selectedUser.email}</p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2">ID: {selectedUser.id}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedUser(null)}
                                            className="lg:hidden p-3 bg-white/5 rounded-2xl text-slate-400"
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                                        {/* Accounts & Cards */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Wallet size={18} className="text-purple-400" />
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cuentas y Tarjetas Asociadas</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {selectedUser.accounts?.map(acc => (
                                                    <div 
                                                        key={acc.id} 
                                                        onClick={() => handleSelectAccount(acc.id)}
                                                        className={`border rounded-3xl p-8 relative group overflow-hidden cursor-pointer transition-all ${selectedAccount === acc.id ? 'bg-purple-500/10 border-purple-500/50' : 'bg-white/[0.03] border-white/10 hover:border-white/20'}`}
                                                    >
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Número de Cuenta</p>
                                                                <p className="text-lg font-mono text-white font-black tracking-widest">{acc.account_number}</p>
                                                            </div>
                                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${acc.is_blocked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}>
                                                                {acc.is_blocked ? 'Bloqueada' : 'Activa'}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex justify-between items-end">
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Saldo Disponible</p>
                                                                <p className="text-2xl font-black text-white tracking-tight">${parseFloat(acc.balance || 0).toLocaleString('es-CL')}</p>
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                {acc.is_blocked && (
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); handleUnblock(acc.id); }}
                                                                        className="p-3 bg-emerald-500 hover:bg-emerald-400 text-[#020408] rounded-xl transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                                                    >
                                                                        <Unlock size={14} /> Habilitar
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {selectedAccount === acc.id && (
                                                            <div className="absolute top-4 right-4 text-purple-400">
                                                                <Eye size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Transaction History */}
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <History size={18} className="text-purple-400" />
                                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                        {selectedAccount ? 'Movimientos del Producto Seleccionado' : 'Historial General del Usuario'}
                                                    </h4>
                                                </div>
                                                {selectedAccount && (
                                                    <button 
                                                        onClick={() => setSelectedAccount(null)}
                                                        className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors"
                                                    >
                                                        Ver Historial General
                                                    </button>
                                                )}
                                            </div>
                                            <div className="bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-white/5 bg-white/[0.01]">
                                                            <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Fecha</th>
                                                            <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Descripción</th>
                                                            <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Tipo</th>
                                                            <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Monto</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {historyLoading ? (
                                                            <tr>
                                                                <td colSpan="4" className="px-8 py-10 text-center">
                                                                    <div className="w-6 h-6 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                                                                </td>
                                                            </tr>
                                                        ) : filteredHistory.length > 0 ? (
                                                            filteredHistory.map(tx => (
                                                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                                                    <td className="px-8 py-5 text-[10px] font-mono text-slate-400">{new Date(tx.created_at).toLocaleString('es-CL')}</td>
                                                                    <td className="px-8 py-5 text-[11px] font-bold text-white">{tx.description}</td>
                                                                    <td className="px-8 py-5">
                                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${tx.type === 'transfer' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                                            {tx.type}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-8 py-5 text-xs font-black text-white text-right">
                                                                        ${parseFloat(tx.amount).toLocaleString('es-CL')}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-700">
                                                                            <Info size={24} />
                                                                        </div>
                                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Sin movimientos registrados para este producto</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                                <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center text-slate-700">
                                    <User size={40} />
                                </div>
                                <div className="max-w-xs">
                                    <p className="text-lg font-black text-white tracking-tight">Selecciona un usuario</p>
                                    <p className="text-xs text-slate-500 font-medium mt-2">Para ver su información financiera completa, saldos y habilitar tarjetas bloqueadas.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Status */}
                <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between px-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Terminal Auditor Seguro Conectado</p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Info size={14} />
                        <p className="text-[8px] font-black uppercase tracking-widest">Todas las acciones son registradas en el log de auditoría central</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAuditPanel;
