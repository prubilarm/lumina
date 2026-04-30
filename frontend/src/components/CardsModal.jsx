import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Zap, Lock, Eye, EyeOff, Wifi, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../utils/api';

const CardsModal = ({ isOpen, onClose, user, accounts = [] }) => {
    const [revealedCards, setRevealedCards] = useState({});
    const [verifying, setVerifying] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

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
            cvv: Math.floor(100 + Math.random() * 899).toString(),
            color: isVisa 
                ? 'from-slate-900 via-slate-800 to-slate-950' 
                : 'from-indigo-950 via-purple-900 to-slate-900'
        };
    });

    const handleViewData = async (cardId) => {
        const { value: password } = await Swal.fire({
            title: 'Verificar Identidad',
            text: 'Por seguridad, ingrese su contraseña para ver los datos.',
            input: 'password',
            inputPlaceholder: 'Contraseña de acceso',
            inputAttributes: {
                autocomplete: 'new-password',
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Verificar',
            confirmButtonColor: '#0ea5e9',
            background: '#0f172a',
            color: '#f8fafc',
        });

        if (password) {
            try {
                await api.post('/auth/verify-password', { password });
                setRevealedCards(prev => ({ ...prev, [cardId]: true }));
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Contraseña incorrecta', background: '#0f172a', color: '#f8fafc' });
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/95 backdrop-blur-xl">
            <div className="w-full max-w-4xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[85vh]">
                
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter">Mis Tarjetas</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Haz clic en la tarjeta de atrás para cambiar</p>
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
                                    const isRevealed = revealedCards[card.id];
                                    const isActive = activeIndex === index;
                                    
                                    // Simple logic for 2 cards: if one is active, the other is behind
                                    const position = isActive ? 0 : 1;

                                    return (
                                        <motion.div
                                            key={card.id}
                                            layout
                                            initial={false}
                                            animate={{ 
                                                scale: 1 - position * 0.08,
                                                y: position * -40,
                                                z: -position * 100,
                                                opacity: 1 - position * 0.4,
                                                zIndex: cards.length - position
                                            }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            onClick={() => setActiveIndex(index)}
                                            className={`absolute inset-0 aspect-[1.586/1] w-full rounded-[2.5rem] bg-gradient-to-br ${card.color} border border-white/10 shadow-2xl p-10 flex flex-col justify-between cursor-pointer group preserve-3d transition-shadow hover:shadow-cyan-500/5`}
                                            style={{ height: 'fit-content' }}
                                        >
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] italic">{card.type}</p>
                                                    <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-200 rounded-lg shadow-inner mt-4 opacity-80"></div>
                                                </div>
                                                <div className="text-right italic font-black text-white text-xl opacity-60">
                                                    {card.brand}
                                                </div>
                                            </div>

                                            <div className="relative z-10 my-8">
                                                <p className="text-2xl md:text-3xl font-mono text-white tracking-[0.25em] drop-shadow-lg">
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
                                                <Wifi size={20} className="text-white/20 rotate-90" />
                                            </div>

                                            {/* Glow effect for active card */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-cyan-500/5 rounded-[2.5rem] animate-pulse pointer-events-none"></div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500">No hay tarjetas disponibles</div>
                    )}

                    {/* Navigation Dots */}
                    {cards.length > 1 && (
                        <div className="mt-12 flex gap-2">
                            {cards.map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${activeIndex === i ? 'w-8 bg-cyan-500' : 'bg-white/10'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Footer */}
                <div className="p-8 border-t border-white/5 bg-white/[0.01] flex flex-col gap-4">
                    <div className="flex justify-between items-center px-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Titular</span>
                            <span className="text-sm font-black text-white uppercase tracking-tight">{user?.full_name}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</span>
                            <span className="text-sm font-black text-emerald-400 uppercase tracking-tight flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Operativa
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        {!revealedCards[cards[activeIndex]?.id] ? (
                            <button 
                                onClick={() => handleViewData(cards[activeIndex].id)}
                                className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-3"
                            >
                                <Eye size={18} /> Ver datos
                            </button>
                        ) : (
                            <button 
                                onClick={() => setRevealedCards(prev => ({ ...prev, [cards[activeIndex].id]: false }))}
                                className="flex-1 py-5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-2xl text-[11px] font-black uppercase tracking-widest text-cyan-400 transition-all flex items-center justify-center gap-3"
                            >
                                <EyeOff size={18} /> Ocultar datos
                            </button>
                        )}
                        <button className="flex-1 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-purple-500/10 flex items-center justify-center gap-3">
                            <Lock size={18} /> Bloquear Tarjeta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardsModal;
