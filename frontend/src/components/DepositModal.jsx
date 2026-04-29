import React, { useState } from 'react';
import { X, DollarSign, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const DepositModal = ({ isOpen, onClose, onSuccess, accounts }) => {
    const [amount, setAmount] = useState('');
    const [accountIndex, setAccountIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/transactions/deposit', {
                amount: parseFloat(amount),
                account_number: accounts[accountIndex].account_number,
                description: 'Abono realizado vía Web Banking'
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setAmount('');
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            alert('Error al procesar el depósito: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0A0C10] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="relative p-8">
                    <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>

                    {!success ? (
                        <>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                                    <Wallet size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Depositar Fondos</h2>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Abono inmediato a cuenta propia</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-3 block">Seleccionar Cuenta de Destino</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {accounts.map((acc, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setAccountIndex(i)}
                                                className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center ${accountIndex === i ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                            >
                                                <div>
                                                    <p className="font-bold text-sm">{acc.account_number.startsWith('SAV') ? 'Cta. Ahorro' : 'Cta. Corriente'}</p>
                                                    <p className="text-[10px] text-slate-500">{acc.account_number}</p>
                                                </div>
                                                <p className="font-black text-sm">${parseFloat(acc.balance).toLocaleString()}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest block">Monto a Depositar</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500 group-focus-within:scale-110 transition-transform">
                                            <DollarSign size={24} />
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-2xl font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex gap-4 items-center">
                                    <ShieldCheck size={20} className="text-indigo-400 shrink-0" />
                                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                                        Toda operación de abono es procesada mediante canales cifrados de Lumina Bank Bank bajo protocolo HTTPS.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !amount}
                                    className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${isLoading ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 active:scale-95'}`}
                                >
                                    {isLoading ? 'Procesando...' : (
                                        <>
                                            Confirmar Depósito <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/30">
                                <ShieldCheck size={40} />
                            </div>
                            <h3 className="text-3xl font-black mb-2 tracking-tight">¡Depósito Exitoso!</h3>
                            <p className="text-slate-400 font-medium">Los fondos han sido acreditados a tu cuenta inmediatamente.</p>
                            <div className="mt-8 px-6 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                                Transacción Segura Verified
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepositModal;
