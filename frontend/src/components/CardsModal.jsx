import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, ShieldCheck, Zap, Lock, Eye, EyeOff, Wifi, Info, ShieldAlert, History as HistoryIcon, FileText, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
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
            <div className="w-full max-w-2xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Custom Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter">Billetera Lumina</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Gestiona tus productos premium</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="w-full relative h-[500px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCard.id}
                                initial={{ opacity: 0, x: 100, scale: 0.9, rotateY: 30 }}
                                animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, x: -100, scale: 0.9, rotateY: -30 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                                className={`absolute inset-0 w-full bg-gradient-to-br ${activeCard.color} rounded-[2.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] p-10 flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing`}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(e, { offset }) => {
                                    if (offset.x > 100) prevCard();
                                    else if (offset.x < -100) nextCard();
                                }}
                            >
                                {/* Glass Overlay Decor */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none"></div>
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>
                                
                                {/* Top Section: Brand & Label */}
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">{activeCard.label}</span>
                                            <span className="text-2xl font-black text-white tracking-tighter italic">Lumina Bank</span>
                                        </div>
                                        <div className="w-14 h-11 bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 rounded-xl shadow-inner relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,black_2px,black_4px)]"></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-4">
                                        {activeCard.isCredit ? (
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-[#eb001b] opacity-90 shadow-lg"></div>
                                                <div className="w-10 h-10 rounded-full bg-[#f79e1b] -ml-5 opacity-90 shadow-lg"></div>
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                                                <Zap size={24} className="text-white" fill="currentColor" />
                                            </div>
                                        )}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setIsBalanceHidden(!isBalanceHidden); }}
                                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-white/60"
                                        >
                                            {isBalanceHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Middle Section: Balance & Number */}
                                <div className="relative z-10 space-y-2">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Saldo Disponible</p>
                                    <h3 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">
                                        {isBalanceHidden ? '••••••••' : `$${parseFloat(activeCard.balance || 0).toLocaleString('es-CL')}`}
                                    </h3>
                                    <div className="pt-4">
                                        <p className="text-xl font-mono text-white/80 tracking-[0.3em] drop-shadow-lg">
                                            {isRevealed ? activeCard.fullNumber : `•••• •••• •••• ${activeCard.last4}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Section: Actions & Expiry */}
                                <div className="relative z-10 flex flex-col gap-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-xl"
                                        >
                                            <HistoryIcon size={16} /> Movimientos
                                        </button>
                                        <button 
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg"
                                        >
                                            <FileText size={16} /> Cartolas
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="flex gap-10">
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">VALID THRU</p>
                                                <p className="text-xs font-bold text-white">{isRevealed ? activeCard.expiry : '•• / ••'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">SECURE CODE</p>
                                                <p className="text-xs font-bold text-white tracking-widest">{isRevealed ? activeCard.cvv : '•••'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Share2 size={20} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                                            <Wifi size={20} className="text-white/30 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                {/* Blocked Overlay */}
                                {activeCard.isBlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-[6px] rounded-[2.5rem] z-20">
                                        <div className="bg-rose-600 px-8 py-4 rounded-3xl shadow-2xl border border-rose-400/30 flex flex-col items-center gap-3 scale-110">
                                            <Lock size={24} className="text-white" />
                                            <p className="text-xs font-black text-white uppercase tracking-widest text-center leading-relaxed">BLOQUEO POR ROBO<br/>O EXTRAVÍO</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {cards.map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`h-2 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-10 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'w-2 bg-white/10 hover:bg-white/20'}`} 
                            />
                        ))}
                    </div>
                </div>

                {/* Footer Data Reveal */}
                <div className="p-8 border-t border-white/5 bg-white/[0.01] flex flex-col gap-6">
                    {isRevealed && (
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                            <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest">Información confidencial activa • Se ocultará en {formatTime(timer)}</p>
                        </div>
                    )}
                    <div className="flex gap-4">
                        <button 
                            onClick={handleViewData}
                            className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${isRevealed ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-cyan-500/10' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                        >
                            {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />} {isRevealed ? 'Ocultar Datos Sensibles' : 'Ver Datos de Tarjetas'}
                        </button>
                        
                        {!activeCard.isBlocked ? (
                            <button 
                                onClick={() => handleBlockCard(activeCard.id)}
                                className="px-10 py-5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 group"
                            >
                                <Lock size={18} className="group-hover:scale-110 transition-transform" /> Bloqueo de Seguridad
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
