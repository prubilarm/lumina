import React, { useState, useEffect } from 'react';
import { X, Wallet, History, ArrowUpRight, ArrowDownLeft, Calendar, User, Mail, Shield } from 'lucide-react';
import api from '../utils/api';

const UserDetailModal = ({ isOpen, onClose, userId }) => {
    const [details, setDetails] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserDetails();
        }
    }, [isOpen, userId]);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const [detailsRes, txsRes] = await Promise.all([
                api.get(`/admin/users/${userId}`),
                api.get(`/admin/users/${userId}/transactions`)
            ]);
            setDetails(detailsRes.data);
            setTransactions(txsRes.data);
        } catch (err) {
            console.error('Error fetching user details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async () => {
        if (!window.confirm('¿Estás seguro de sancionar/suspender esta cuenta?')) return;
        try {
            await api.post(`/admin/users/${userId}/suspend`);
            alert('Cuenta sancionada correctamente');
            fetchUserDetails();
        } catch (err) {
            alert('Error al sancionar la cuenta');
        }
    };

    const handleGenerateStatement = async () => {
        try {
            const res = await api.get(`/admin/users/${userId}/statement`);
            alert(res.data.message + '. Enlace: ' + res.data.downloadUrl);
        } catch (err) {
            alert('Error al generar certificado');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass shadow-2xl border border-white/10 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                            {details?.full_name?.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight">{details?.full_name || 'Cargando...'}</h2>
                            <p className="text-slate-400 text-xs flex items-center gap-2">
                                <Shield size={12}/> ID de Usuario: #{userId} • {details?.role?.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                            <p className="mt-4 text-slate-500 font-bold text-sm uppercase tracking-widest">Obteniendo Auditoría...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* User Info & Accounts */}
                            <div className="space-y-6">
                                <div className="glass-dark p-6 border border-white/5">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                                        <User size={14} /> Información Personal
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem icon={<Mail size={14}/>} label="Email" value={details?.email} />
                                        <InfoItem icon={<Calendar size={14}/>} label="Cliente desde" value={new Date(details?.created_at).toLocaleDateString()} />
                                        <div className="pt-4 mt-4 border-t border-white/5">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Saldo Consolidado</p>
                                            <p className="text-3xl font-black text-indigo-400">${parseFloat(details?.balance || 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-2">
                                        <Wallet size={14} /> Cuentas Vinculadas
                                    </h3>
                                    {details?.accounts?.map((acc, i) => (
                                        <div key={i} className="glass p-4 border border-white/5 hover:bg-white/5 transition-all">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{acc.account_number}</p>
                                            <div className="flex justify-between items-end">
                                                <p className="font-bold text-sm">Cuenta {acc.account_number.startsWith('SAV') ? 'Ahorro' : 'Corriente'}</p>
                                                <p className="font-black text-lg">${parseFloat(acc.balance).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Transactions History */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <History size={14} /> Historial de Movimientos
                                    </h3>
                                    <span className="text-[10px] font-bold text-indigo-400">{transactions.length} registros</span>
                                </div>

                                <div className="space-y-3">
                                    {transactions.length > 0 ? (
                                        transactions.map(tx => (
                                            <div key={tx.id} className="glass p-4 flex items-center justify-between hover:bg-white/5 transition-all border border-white/5 group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {tx.type === 'deposit' ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{tx.description || (tx.type === 'deposit' ? 'Depósito' : 'Transferencia')}</p>
                                                        <p className="text-[10px] text-slate-500 font-medium">{new Date(tx.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-bold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-white'}`}>
                                                        {tx.type === 'deposit' ? '+' : '-'}${Math.abs(parseFloat(tx.amount)).toLocaleString()}
                                                    </p>
                                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">USD</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center glass border-dashed border-2 border-white/5 flex flex-col items-center">
                                            <History className="text-slate-700 mb-4" size={48} />
                                            <p className="text-slate-500 font-medium italic">Sin movimientos registrados aún</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end gap-4">
                    <button onClick={handleSuspend} className="px-6 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 transition-all">Sancionar Cuenta</button>
                    <button onClick={handleGenerateStatement} className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">Generar Certificado</button>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div>
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-center gap-2 text-slate-200">
            <span className="text-indigo-400">{icon}</span>
            <span className="text-sm font-bold truncate">{value}</span>
        </div>
    </div>
);

export default UserDetailModal;
