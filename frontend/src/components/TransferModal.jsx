import React, { useState } from 'react';
import { X, Send, ArrowRight, Info, User, ShieldCheck, Zap } from 'lucide-react';
import api from '../utils/api';

const TransferModal = ({ isOpen, onClose, onSuccess, accounts }) => {
    const [amount, setAmount] = useState('');
    const [receiver, setReceiver] = useState('');
    const [description, setDescription] = useState('');
    const [transferType, setTransferType] = useState('third-party'); // 'own' or 'third-party'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/transactions/transfer', {
                amount: parseFloat(amount),
                receiver_account_number: receiver,
                description: description || (transferType === 'own' ? 'Transferencia interna Lumina' : 'Transferencia P2P Lumina')
            });
            onSuccess();
            onClose();
            setAmount('');
            setReceiver('');
            setDescription('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error en la conexión con el nodo central');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(168,85,247,0.3)] animate-in fade-in zoom-in duration-300">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-500/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                            <Send size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white">Transferir Activos</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Ejecución inmediata • Fee 0%</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    {/* Selector de Tipo de Transferencia */}
                    <div className="flex gap-4 p-1.5 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <button 
                            type="button"
                            onClick={() => {
                                setTransferType('own');
                                setReceiver(accounts.find(a => a.account_number !== accounts[0].account_number)?.account_number || '');
                            }}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all ${transferType === 'own' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <ShieldCheck size={16} />
                            Mis Cuentas
                        </button>
                        <button 
                            type="button"
                            onClick={() => {
                                setTransferType('third-party');
                                setReceiver('');
                            }}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all ${transferType === 'third-party' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <User size={16} />
                            A Terceros
                        </button>
                    </div>

                    {error && (
                        <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl flex items-center gap-4 font-bold">
                            <Info size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Destinatario</label>
                            {transferType === 'own' ? (
                                <div className="relative">
                                    <select 
                                        value={receiver}
                                        onChange={(e) => setReceiver(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:border-purple-500/50 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled className="bg-[#0A0C10]">Seleccionar Cartera</option>
                                        {accounts.map((acc, i) => (
                                            <option key={i} value={acc.account_number} className="bg-[#0A0C10]">{acc.account_number} (${parseFloat(acc.balance).toLocaleString()})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <ArrowRight size={18} className="rotate-90" />
                                    </div>
                                </div>
                            ) : (
                                <input 
                                    type="text" 
                                    required
                                    value={receiver}
                                    onChange={(e) => setReceiver(e.target.value)}
                                    placeholder="Ej: LMN-884291"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white font-black focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800"
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Monto (USD)</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <input 
                                    type="number" 
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-black text-xl focus:border-purple-500/50 outline-none transition-all placeholder:text-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Referencia / Glosa</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descripción de la transferencia..."
                            rows="2"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:border-purple-500/50 outline-none transition-all placeholder:text-slate-700 resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-6 py-5 rounded-2xl font-black text-slate-500 hover:text-white hover:bg-white/5 transition-all text-[10px] uppercase tracking-widest border border-white/5"
                        >
                            Anular
                        </button>
                        <button 
                            type="submit"
                            disabled={loading || !receiver || !amount}
                            className="flex-[2] bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white font-black py-5 rounded-2xl shadow-2xl shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale uppercase tracking-[0.2em] text-xs"
                        >
                            {loading ? 'Procesando Hash...' : 'Autorizar Envío'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferModal;
