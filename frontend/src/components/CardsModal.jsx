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
        const isVisa = index % 2 === 0;
        const fullNumber = acc.card_number || '4532 0000 0000 0000';
        return {
            id: acc.id,
            type: isVisa ? 'Visa Infinite' : 'Mastercard World Elite',
            brand: isVisa ? 'VISA' : 'MASTERCARD',
            last4: fullNumber.slice(-4),
            fullNumber: fullNumber,
            expiry: '12/28',
            cvv: '842',
            isBlocked: acc.is_blocked,
            color: isVisa 
                ? 'from-slate-900 via-slate-800 to-slate-950' 
                : 'from-indigo-950 via-purple-900 to-slate-900'
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
                Swal.fire({
                    icon: 'success',
                    title: 'Datos Revelados',
                    text: 'Los datos estarán visibles por 3 minutos.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#0f172a',
                    color: '#f8fafc'
                });
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
                            <h3 className="text-xl font-black text-white tracking-tighter">Centro de Seguridad</h3>
                            {isRevealed && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                    <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest">Auto-ocultado en: {formatTime(timer)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-10 overflow-hidden relative">
                    {cards.length > 0 ? (
                        <div className="relative w-full max-w-md h-[400px] flex items-center justify-center">
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
                                                y: position * -40,
                                                opacity: 1 - position * 0.4,
                                                zIndex: cards.length - position,
                                                filter: card.isBlocked ? 'grayscale(1) brightness(0.5)' : 'none'
                                            }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            onClick={() => setActiveIndex(index)}
                                            className={`absolute inset-0 aspect-[1.586/1] w-full rounded-[2.5rem] bg-gradient-to-br ${card.color} border border-white/10 shadow-2xl p-10 flex flex-col justify-between cursor-pointer group preserve-3d`}
                                            style={{ height: 'fit-content' }}
                                        >
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] italic">{card.type}</p>
                                                    <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-200 rounded-lg shadow-inner mt-4"></div>
                                                </div>
                                                <div className="text-right italic font-black text-white text-xl opacity-60">
                                                    {card.brand}
                                                </div>
                                            </div>

                                            <div className="relative z-10 my-8">
                                                <p className="text-2xl md:text-3xl font-mono text-white tracking-[0.25em]">
                                                    {isRevealed ? card.fullNumber : `•••• •••• •••• ${card.last4}`}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end relative z-10">
                                                <div className="flex gap-10">
                                                    <div>
                                                        <p className="text-[7px] font-black uppercase text-white/30 tracking-widest mb-1">Expira</p>
                                                        <p className="text-sm font-bold text-white">{isRevealed ? card.expiry : '•• / ••'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[7px] font-black uppercase text-white/30 tracking-widest mb-1">CVV</p>
                                                        <p className="text-sm font-bold text-white tracking-widest">{isRevealed ? card.cvv : '•••'}</p>
                                                    </div>
                                                </div>
                                                {card.isBlocked ? <ShieldAlert className="text-rose-500" /> : <Wifi size={20} className="text-white/20 rotate-90" />}
                                            </div>

                                            {card.isBlocked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-[2.5rem] z-20">
                                                    <div className="bg-rose-600 px-6 py-2 rounded-full shadow-2xl">
                                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Tarjeta Bloqueada</p>
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
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Titular</span>
                            <span className="text-sm font-black text-white uppercase tracking-tight">{user?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            <Info size={14} className="text-cyan-400" />
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Haz clic en la tarjeta de atrás para cambiar el foco</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={handleViewData}
                            className={`flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isRevealed ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                        >
                            {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />} {isRevealed ? 'Ocultar datos' : 'Ver datos'}
                        </button>
                        
                        {!activeCard?.isBlocked ? (
                            <button 
                                onClick={() => handleBlockCard(activeCard.id)}
                                className="flex-1 py-5 bg-gradient-to-r from-rose-600 to-rose-700 hover:brightness-110 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-rose-500/10 flex items-center justify-center gap-3"
                            >
                                <Lock size={18} /> Bloquear Tarjeta
                            </button>
                        ) : (
                            <button 
                                disabled
                                className="flex-1 py-5 bg-white/5 border border-white/10 opacity-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-3 cursor-not-allowed"
                            >
                                <ShieldAlert size={18} /> Solo Admin Desbloquea
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardsModal;
