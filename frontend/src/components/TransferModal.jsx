import React, { useState } from 'react';
import { X, Send, ArrowRight, Info, User, ShieldCheck } from 'lucide-react';
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
                description: description || (transferType === 'own' ? 'Transferencia entre cuentas' : 'Transferencia a terceros')
            });
            onSuccess();
            onClose();
            setAmount('');
            setReceiver('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al realizar la transferencia');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass w-full max-w-lg overflow-hidden shadow-2xl relative border border-white/10 animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-indigo-600/10">
                    <h3 className="text-xl font-black flex items-center gap-3">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
                            <Send className="text-white" size={18} />
                        </div>
                        Nueva Transferencia
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Transfer Type Selector */}
                    <div className="flex gap-2 p-1 bg-slate-900 rounded-xl mb-4">
                        <button 
                            type="button"
                            onClick={() => {
                                setTransferType('own');
                                setReceiver(accounts.find(a => a.account_number !== accounts[0].account_number)?.account_number || '');
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${transferType === 'own' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <ShieldCheck size={14} />
                            Cuenta Propia
                        </button>
                        <button 
                            type="button"
                            onClick={() => {
                                setTransferType('third-party');
                                setReceiver('');
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${transferType === 'third-party' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <User size={14} />
                            Terceros
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded-xl flex items-center gap-3 font-black uppercase tracking-wider">
                            <Info size={16} />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">{transferType === 'own' ? 'Seleccionar Cuenta Propia' : 'Cuenta de Destino (Número)'}</label>
                        {transferType === 'own' ? (
                            <select 
                                value={receiver}
                                onChange={(e) => setReceiver(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Selecciona una cuenta</option>
                                {accounts.map((acc, i) => (
                                    <option key={i} value={acc.account_number}>{acc.account_number} (${parseFloat(acc.balance).toLocaleString()})</option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                type="text" 
                                required
                                value={receiver}
                                onChange={(e) => setReceiver(e.target.value)}
                                placeholder="Ej: SENT-123456"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-800"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Monto a Transferir (USD)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 font-black text-xl">$</span>
                            <input 
                                type="number" 
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white font-black text-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Concepto / Descripción</label>
                        <input 
                            type="text" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Motivo de la transferencia"
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-500 hover:text-white hover:bg-white/5 transition-all text-xs uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={loading || !receiver || !amount}
                            className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-xl shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 disabled:pointer-events-none uppercase tracking-widest text-sm"
                        >
                            {loading ? 'Validando...' : 'Confirmar Envío'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferModal;
