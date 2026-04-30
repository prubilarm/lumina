import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, ShieldCheck, Zap, Lock, Eye, EyeOff, Wifi, Info, ShieldAlert, History, FileText, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../utils/api';

const CardsModal = ({ isOpen, onClose, user, accounts = [], onUpdate }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);
    const [timer, setTimer] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRevealed) {
            setTimer(180); // 3 minutes
            timerRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setIsRevealed(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimer(0);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRevealed]);

    if (!isOpen) return null;

    const cards = accounts.map((acc, index) => {
        const isCredit = index === 0;
        const fullNumber = acc.card_number || '4532 0000 0000 0000';
        return {
            id: acc.id,
            label: isCredit ? 'Tarjeta de Crédito' : 'Tarjeta de Débito',
            brand: isCredit ? 'Mastercard' : 'Lumina Debit',
            last4: fullNumber.slice(-4),
            fullNumber: fullNumber,
            expiry: '12/28',
            cvv: '842',
            balance: acc.balance,
            account_number: acc.account_number,
            isBlocked: acc.is_blocked,
            isCredit: isCredit,
            color: isCredit 
                ? 'from-[#1a1a1a] via-[#333333] to-[#000000]' 
                : 'from-[#0f172a] via-[#1e293b] to-[#020617]'
        };
    });

    const activeCard = cards[activeIndex];

    const handleViewData = async () => {
        const { value: password } = await Swal.fire({
            title: 'Verificar Identidad',
            text: 'Por seguridad, ingrese su contraseña para ver los datos de todas sus tarjetas.',
            input: 'password',
            inputPlaceholder: 'Contraseña de acceso',
            inputAttributes: { autocomplete: 'new-password' },
            showCancelButton: true,
            confirmButtonText: 'Verificar',
            confirmButtonColor: '#0ea5e9',
            background: '#0f172a',
            color: '#f8fafc',
        });

        if (password) {
            try {
                await api.post('/auth/verify-password', { password });
                setIsRevealed(true);
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Contraseña incorrecta', background: '#0f172a', color: '#f8fafc' });
            }
        }
    };

    const handleBlockCard = async (cardId) => {
        const result = await Swal.fire({
            title: '¿Bloqueo por robo o extravío?',
            text: 'Esta acción desactivará permanentemente tu tarjeta por seguridad. Solo un administrador podrá habilitarla nuevamente tras verificar tu identidad.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar Bloqueo',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e11d48',
            background: '#0f172a',
            color: '#f8fafc'
        });

        if (result.isConfirmed) {
            try {
                await api.post('/user/block-account', { accountId: cardId });
                Swal.fire({ icon: 'success', title: 'Tarjeta Bloqueada', text: 'Se ha registrado el bloqueo por seguridad.', background: '#0f172a', color: '#f8fafc' });
                if (onUpdate) onUpdate();
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message, background: '#0f172a', color: '#f8fafc' });
            }
        }
    };

    const nextCard = () => setActiveIndex((prev) => (prev + 1) % cards.length);
    const prevCard = () => setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/95 backdrop-blur-2xl">
            <div className="w-full max-w-4xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[90vh]">
                
                {/* Custom Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter">Billetera de Productos</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Selecciona un producto para gestionar</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-hidden relative">
                    {/* Horizontal Card Slider Container */}
                    <div className="w-full flex items-center justify-between gap-4 mt-4">
                        <button onClick={prevCard} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-400">
                            <ChevronLeft size={24} />
                        </button>
                        
                        <div className="flex-1 max-w-md relative h-[320px] flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeCard.id}
                                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -100, scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className={`absolute inset-x-0 mx-auto aspect-[1.586/1] w-full rounded-[2rem] bg-gradient-to-br ${activeCard.color} border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between overflow-hidden`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.04] pointer-events-none"></div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="space-y-2">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{activeCard.label}</span>
                                                <span className="text-base font-black text-white tracking-tighter italic">Lumina Bank</span>
                                            </div>
                                            <div className="w-12 h-9 bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 rounded-lg shadow-inner relative overflow-hidden">
                                                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,black_2px,black_4px)]"></div>
                                            </div>
                                        </div>
                                        {activeCard.isCredit ? (
                                            <div className="flex items-center pt-2">
                                                <div className="w-8 h-8 rounded-full bg-[#eb001b] opacity-80"></div>
                                                <div className="w-8 h-8 rounded-full bg-[#f79e1b] -ml-4 opacity-80"></div>
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 mt-1">
                                                <Zap size={20} className="text-white/60" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-xl md:text-2xl font-mono text-white tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                            {isRevealed ? activeCard.fullNumber : `•••• •••• •••• ${activeCard.last4}`}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-end relative z-10">
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-[7px] font-black uppercase text-white/30 tracking-widest mb-1">VALID THRU</p>
                                                <p className="text-xs font-bold text-white">{isRevealed ? activeCard.expiry : '•• / ••'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[7px] font-black uppercase text-white/30 tracking-widest mb-1">SECURE CODE</p>
                                                <p className="text-xs font-bold text-white tracking-widest">{isRevealed ? activeCard.cvv : '•••'}</p>
                                            </div>
                                        </div>
                                        <Wifi size={16} className="text-white/20 rotate-90" />
                                    </div>
                                    {activeCard.isBlocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[2px] rounded-[2rem] z-20">
                                            <div className="bg-rose-600 px-6 py-2 rounded-2xl shadow-2xl border border-rose-400/30 flex items-center gap-2">
                                                <Lock size={14} className="text-white" />
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest text-center">BLOQUEO POR ROBO<br/>O EXTRAVÍO</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <button onClick={nextCard} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-400">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Product Details & Fast Actions (Like image) */}
                    <div className="w-full max-w-xl mt-4 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">{activeCard.isCredit ? 'Cuenta de Crédito Mastercard' : 'Cuenta de Débito Lumina'}</h4>
                                <p className="text-xs text-slate-500 font-bold tracking-widest">{activeCard.account_number}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-400 group"
                                    title={isBalanceHidden ? "Mostrar Saldo" : "Ocultar Saldo"}
                                >
                                    {isBalanceHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                <Share2 size={20} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Saldo disponible</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter">
                                {isBalanceHidden ? '••••••••' : `$${parseFloat(activeCard.balance || 0).toLocaleString('es-CL')}`}
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-indigo-500/10 active:scale-95">
                                <History size={16} /> Movimientos
                            </button>
                            <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95">
                                <FileText size={16} /> Cartolas
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-8 border-t border-white/5 bg-white/[0.01] flex flex-col gap-4 mt-auto">
                    {isRevealed && (
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                            <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest">Información sensible visible • Se ocultará en {formatTime(timer)}</p>
                        </div>
                    )}
                    <div className="flex gap-4">
                        <button 
                            onClick={handleViewData}
                            className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isRevealed ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                        >
                            {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />} {isRevealed ? 'Ocultar Datos' : 'Revelar Datos Sensibles'}
                        </button>
                        
                        {!activeCard.isBlocked ? (
                            <button 
                                onClick={() => handleBlockCard(activeCard.id)}
                                className="flex-1 py-5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                            >
                                <Lock size={18} /> Bloqueo por robo o extravío
                            </button>
                        ) : (
                            <button 
                                disabled
                                className="flex-1 py-5 bg-white/5 border border-white/10 opacity-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-3 cursor-not-allowed"
                            >
                                <ShieldAlert size={18} /> Contactar Admin para Habilitar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardsModal;
