import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, ShieldCheck, Zap, Lock, Eye, EyeOff, Wifi, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../utils/api';

const CardsModal = ({ isOpen, onClose, user, accounts = [], onUpdate }) => {
    const [isRevealed, setIsRevealed] = useState(false);
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
            isBlocked: acc.is_blocked,
            isCredit: isCredit,
            color: isCredit 
                ? 'from-[#1a1a1a] via-[#333333] to-[#000000]' // Onyx Black
                : 'from-[#0f172a] via-[#1e293b] to-[#020617]' // Deep Navy
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
            title: '¿Bloquear Tarjeta?',
            text: 'Esta acción desactivará temporalmente tu tarjeta. Solo un administrador podrá desbloquearla.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, bloquear',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e11d48',
            background: '#0f172a',
            color: '#f8fafc'
        });

        if (result.isConfirmed) {
            try {
                await api.post('/user/block-account', { accountId: cardId });
                Swal.fire({ icon: 'success', title: 'Tarjeta Bloqueada', background: '#0f172a', color: '#f8fafc' });
                if (onUpdate) onUpdate();
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message, background: '#0f172a', color: '#f8fafc' });
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/95 backdrop-blur-xl">
            <div className="w-full max-w-4xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[85vh]">
                
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter">Billetera Digital</h3>
                            {isRevealed && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                    <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest">Exposición segura: {formatTime(timer)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden relative">
                    {cards.length > 0 ? (
                        <div className="relative w-full max-w-md h-[450px] flex items-center justify-center">
                            <AnimatePresence initial={false}>
                                {cards.map((card, index) => {
                                    const isActive = activeIndex === index;
                                    const position = isActive ? 0 : 1;

                                    return (
                                        <motion.div
                                            key={card.id}
                                            layout
                                            animate={{ 
                                                scale: 1 - position * 0.08,
                                                y: position * -50,
                                                opacity: 1 - position * 0.4,
                                                zIndex: cards.length - position,
                                                filter: card.isBlocked ? 'grayscale(0.8) brightness(0.6)' : 'none'
                                            }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            onClick={() => setActiveIndex(index)}
                                            className={`absolute inset-x-0 mx-auto aspect-[1.586/1] w-full rounded-[2rem] bg-gradient-to-br ${card.color} border border-white/10 shadow-2xl p-8 flex flex-col justify-between cursor-pointer overflow-hidden group`}
                                            style={{ height: 'auto', top: '20px' }}
                                        >
                                            {/* Reflection Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.05] pointer-events-none"></div>
                                            
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="space-y-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{card.label}</span>
                                                        <span className="text-base font-black text-white tracking-tighter italic">Lumina Bank</span>
                                                    </div>
                                                    {/* Security Chip */}
                                                    <div className="w-12 h-9 bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 rounded-lg shadow-inner relative overflow-hidden">
                                                        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,black_2px,black_4px)]"></div>
                                                    </div>
                                                </div>
                                                
                                                {card.isCredit ? (
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

                                            <div className="relative z-10 my-4">
                                                <p className="text-xl md:text-2xl font-mono text-white tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-center lg:text-left">
                                                    {isRevealed ? card.fullNumber : `•••• •••• •••• ${card.last4}`}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end relative z-10">
                                                <div className="flex gap-8">
                                                    <div>
                                                        <p className="text-[7px] font-black uppercase text-white/30 tracking-widest mb-1">VALID THRU</p>
                                                        <p className="text-xs font-bold text-white shadow-sm">{isRevealed ? card.expiry : '•• / ••'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[7px] font-black uppercase text-white/30 tracking-widest mb-1">SECURE CODE</p>
                                                        <p className="text-xs font-bold text-white tracking-widest">{isRevealed ? card.cvv : '•••'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Contactless</span>
                                                    <Wifi size={16} className="text-white/20 rotate-90" />
                                                </div>
                                            </div>

                                            {card.isBlocked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px] rounded-[2rem] z-20">
                                                    <div className="bg-rose-600 px-6 py-2 rounded-2xl shadow-2xl border border-rose-400/30 flex items-center gap-2">
                                                        <Lock size={14} className="text-white" />
                                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Tarjeta Suspendida</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 font-black uppercase tracking-widest">Sin Tarjetas Activas</div>
                    )}
                </div>

                <div className="p-8 border-t border-white/5 bg-white/[0.01] flex flex-col gap-6">
                    <div className="flex justify-between items-center px-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tarjeta Seleccionada</span>
                            <span className="text-sm font-black text-white uppercase tracking-tight">{activeCard?.brand} • {activeCard?.label}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            <Info size={14} className="text-cyan-400" />
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Desliza o haz clic para cambiar de tarjeta</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={handleViewData}
                            className={`flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isRevealed ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                        >
                            {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />} {isRevealed ? 'Ocultar Información' : 'Ver Datos Sensibles'}
                        </button>
                        
                        {!activeCard?.isBlocked ? (
                            <button 
                                onClick={() => handleBlockCard(activeCard.id)}
                                className="flex-1 py-5 bg-gradient-to-r from-rose-600 to-rose-700 hover:brightness-110 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-rose-500/10 flex items-center justify-center gap-3"
                            >
                                <Lock size={18} /> Suspender Tarjeta
                            </button>
                        ) : (
                            <button 
                                disabled
                                className="flex-1 py-5 bg-white/5 border border-white/10 opacity-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-3 cursor-not-allowed"
                            >
                                <ShieldAlert size={18} /> Solo Administrador puede Habilitar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardsModal;
