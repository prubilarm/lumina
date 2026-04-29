import React, { useState } from 'react';
import { X, DollarSign, Wallet, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
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
                description: 'Abono instantáneo Lumina-Chain'
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] animate-in fade-in zoom-in duration-300">
                <div className="relative p-10">
                    <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-xl">
                        <X size={20} />
                    </button>

                    {!success ? (
                        <>
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                                    <Zap size={28} fill="currentColor" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter">Cargar Cuenta</h2>
                                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.2em]">Inyección de liquidez inmediata</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2 block">Destino de Fondos</label>
                                    <div className="space-y-3">
                                        {accounts.map((acc, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setAccountIndex(i)}
                                                className={`w-full p-5 rounded-3xl border transition-all text-left flex justify-between items-center group relative overflow-hidden ${accountIndex === i ? 'bg-purple-500/10 border-purple-500/50' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                            >
                                                {accountIndex === i && <div className="absolute inset-y-0 left-0 w-1 bg-purple-500" />}
                                                <div>
                                                    <p className={`font-black text-sm uppercase tracking-tight ${accountIndex === i ? 'text-purple-400' : 'text-slate-400'}`}>
                                                        {acc.account_number.startsWith('SAV') ? 'Vault de Ahorro' : 'Cartera Principal'}
                                                    </p>
                                                    <p className="text-xs font-mono text-slate-500">{acc.account_number}</p>
                                                </div>
                                                <p className="font-black text-lg">${parseFloat(acc.balance).toLocaleString()}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2 block">Monto Total</label>
                                    <div className="relative">
                                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-cyan-400">
                                            <DollarSign size={28} />
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            required
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] py-8 pl-18 pr-10 text-4xl font-black focus:border-cyan-400/50 outline-none transition-all placeholder:text-slate-800 text-white shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="p-5 bg-cyan-400/5 rounded-3xl border border-cyan-400/10 flex gap-5 items-center">
                                    <ShieldCheck size={24} className="text-cyan-400 shrink-0" />
                                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-wider">
                                        Transacción protegida por Lumina Quantum-Shield. 
                                        Los fondos estarán disponibles en <span className="text-cyan-400">0.02s</span>.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !amount}
                                    className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all ${isLoading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-2xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 hover:brightness-110'}`}
                                >
                                    {isLoading ? 'Cifrando Transacción...' : (
                                        <>
                                            Ejecutar Depósito <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="py-16 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-cyan-500/30">
                                <ShieldCheck size={48} />
                            </div>
                            <h3 className="text-4xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Operación Exitosa</h3>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Protocolo de abono completado correctamente</p>
                            <div className="mt-10 px-8 py-3 bg-white/5 text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-cyan-400/20">
                                Transacción ID: #{Math.floor(Math.random() * 1000000)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepositModal;
