import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CreditCard, User, Wallet, ShieldCheck, Zap, Lock, Info } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const TransferModal = ({ isOpen, onClose, onSuccess, accounts }) => {
    const [step, setStep] = useState(1); // 1: Type, 2: Destination, 3: Amount/Password, 4: Confirm
    const [transferType, setTransferType] = useState(''); // 'own' or 'third'
    const [destinationCard, setDestinationCard] = useState('');
    const [recipient, setRecipient] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [senderAccount, setSenderAccount] = useState(accounts?.[0]?.account_number || '');

    if (!isOpen) return null;

    const reset = () => {
        setStep(1);
        setTransferType('');
        setDestinationCard('');
        setRecipient(null);
        setAmount('');
        setDescription('');
        setPassword('');
        setLoading(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleContinueToAmount = async () => {
        if (transferType === 'third') {
            if (!destinationCard) return;
            setLoading(true);
            try {
                const res = await api.get(`/transactions/recipient/${destinationCard}`);
                setRecipient(res.data);
                setStep(3);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Destinatario no encontrado',
                    text: err.response?.data?.message || 'Verifique el número de tarjeta.',
                    background: '#0f172a',
                    color: '#f8fafc'
                });
            } finally {
                setLoading(false);
            }
        } else {
            // Own accounts: select another account
            const otherAccount = accounts.find(a => a.account_number !== senderAccount);
            if (otherAccount) {
                setRecipient({
                    name: 'Mi Cuenta Propia',
                    account_number: otherAccount.account_number,
                    bank: 'Lumina Bank'
                });
                setStep(3);
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin otras cuentas',
                    text: 'No tienes otras cuentas propias a las que transferir.',
                    background: '#0f172a',
                    color: '#f8fafc'
                });
            }
        }
    };

    const handleExecuteTransfer = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        if (!password) return;

        setLoading(true);
        try {
            // Verify password first
            await api.post('/auth/verify-password', { password });

            // Execute transfer
            await api.post('/transactions/transfer', {
                amount: parseFloat(amount),
                receiver_card_number: transferType === 'third' ? destinationCard : undefined,
                receiver_account_number: transferType === 'own' ? recipient.account_number : undefined,
                description,
                sender_account_number: senderAccount
            });

            Swal.fire({
                icon: 'success',
                title: 'Transferencia Exitosa',
                text: `Se han transferido $${parseFloat(amount).toLocaleString('es-CL')} a ${recipient.name}`,
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#0ea5e9'
            });
            onSuccess();
            handleClose();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error en la operación',
                text: err.response?.data?.message || 'No se pudo completar la transferencia.',
                background: '#0f172a',
                color: '#f8fafc'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(34,211,238,0.2)] animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-cyan-500/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter text-white">Transferencia Lumina</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Protocolo de Movimiento de Fondos</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8">
                    {/* Step Indicators */}
                    <div className="flex justify-between mb-10 px-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                    step >= s ? 'bg-cyan-500 text-[#020408] shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/5 text-slate-600'
                                }`}>
                                    {s}
                                </div>
                                {s < 3 && <div className={`w-12 h-px ${step > s ? 'bg-cyan-500' : 'bg-white/5'}`}></div>}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Transfer Type */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 text-center">Seleccione Tipo de Transferencia</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => { setTransferType('own'); setStep(2); }}
                                    className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all group flex flex-col items-center gap-4 text-center"
                                >
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                        <Wallet size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Mis Cuentas</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Traspaso interno</p>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => { setTransferType('third'); setStep(2); }}
                                    className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all group flex flex-col items-center gap-4 text-center"
                                >
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">A Terceros</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Otros destinatarios</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Destination */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold mb-4">
                                <ArrowLeft size={14} /> Volver
                            </button>
                            
                            {transferType === 'third' ? (
                                <div className="space-y-6">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest text-center">Nuevo Destinatario</h4>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Número de Tarjeta del Destinatario</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input 
                                                type="text" 
                                                value={destinationCard}
                                                onChange={(e) => setDestinationCard(e.target.value)}
                                                placeholder="4532 XXXX XXXX XXXX"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <p className="text-[9px] text-slate-600 italic mt-2 ml-1">Ingrese el número de la tarjeta Lumina del destinatario.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest text-center">Traspaso entre Mis Cuentas</h4>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cuenta de Origen</label>
                                        <select 
                                            value={senderAccount}
                                            onChange={(e) => setSenderAccount(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all appearance-none"
                                        >
                                            {accounts.map(acc => (
                                                <option key={acc.id} value={acc.account_number} className="bg-[#0f172a]">
                                                    {acc.account_number.startsWith('SAV') ? 'Ahorros' : 'Corriente'} - {acc.account_number} (${parseFloat(acc.balance).toLocaleString('es-CL')})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={handleContinueToAmount}
                                disabled={loading || (transferType === 'third' && !destinationCard)}
                                className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/10 flex items-center justify-center gap-3"
                            >
                                {loading ? 'Buscando...' : 'Continuar'} <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* Step 3: Details & Password */}
                    {step === 3 && recipient && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-[2rem] p-8 space-y-6">
                                <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verificación de Destinatario</p>
                                        <p className="text-lg font-black text-white">{recipient.name}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Cuenta</p>
                                        <p className="text-xs font-bold text-white">{recipient.account_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Banco</p>
                                        <p className="text-xs font-bold text-white">{recipient.bank}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/5 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Wallet size={16} className="text-slate-500" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saldo Disponible (Origen)</span>
                                    </div>
                                    <span className="text-xs font-black text-white">
                                        ${parseFloat(accounts.find(a => a.account_number === senderAccount)?.balance || 0).toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Monto a Transferir</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-400 font-black">$</span>
                                        <input 
                                            type="number" 
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-10 pr-6 text-2xl font-black text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmar con Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Corregir
                                </button>
                                <button 
                                    onClick={handleExecuteTransfer}
                                    disabled={loading || !amount || !password}
                                    className="flex-[2] py-5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:brightness-110 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl shadow-cyan-500/20 flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Procesando...' : 'Confirmar Transferencia'} <ShieldCheck size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center gap-3 text-slate-600">
                    <Info size={14} />
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]">Todas las transacciones están protegidas por el protocolo de seguridad Lumina-AES.</p>
                </div>
            </div>
        </div>
    );
};

export default TransferModal;
