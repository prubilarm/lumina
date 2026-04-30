import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Zap, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../utils/api';

const CardsModal = ({ isOpen, onClose, user }) => {
    const [revealedCards, setRevealedCards] = useState({});
    const [verifying, setVerifying] = useState(false);

    if (!isOpen) return null;

    const cards = [
        { 
            id: 1, 
            type: 'Visa Infinite', 
            last4: '8842', 
            fullNumber: '4532 8842 1190 8842', 
            expiry: '12/28', 
            cvv: '884', 
            status: 'Active', 
            color: 'from-slate-800 to-slate-900' 
        },
        { 
            id: 2, 
            type: 'Mastercard World Elite', 
            last4: '2291', 
            fullNumber: '5412 2291 0034 2291', 
            expiry: '05/27', 
            cvv: '129', 
            status: 'Locked', 
            color: 'from-indigo-900 to-purple-900' 
        }
    ];

    const handleViewData = async (cardId) => {
        const { value: password } = await Swal.fire({
            title: 'Verificar Identidad',
            text: 'Por seguridad, ingrese su contraseña para ver los datos sensibles de la tarjeta.',
            input: 'password',
            inputPlaceholder: 'Su contraseña',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Verificar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0ea5e9',
            background: '#0f172a',
            color: '#f8fafc',
            customClass: {
                input: 'bg-white/5 border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50'
            }
        });

        if (password) {
            setVerifying(true);
            try {
                await api.post('/auth/verify-password', { password });
                setRevealedCards(prev => ({ ...prev, [cardId]: true }));
                Swal.fire({
                    icon: 'success',
                    title: 'Acceso Autorizado',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#0f172a',
                    color: '#f8fafc'
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Verificación',
                    text: err.response?.data?.message || 'No se pudo verificar la identidad.',
                    background: '#0f172a',
                    color: '#f8fafc'
                });
            } finally {
                setVerifying(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-4xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(34,211,238,0.2)] animate-in fade-in zoom-in duration-300">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-cyan-500/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white">Centro de Tarjetas Premium</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Gestión de activos físicos y virtuales • Lumina Bank</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {cards.map((card) => {
                            const isRevealed = revealedCards[card.id];
                            return (
                                <div key={card.id} className={`p-10 rounded-[2.5rem] bg-gradient-to-br ${card.color} border border-white/10 relative overflow-hidden group shadow-2xl min-h-[280px] flex flex-col justify-between`}>
                                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                        <Zap size={120} fill="currentColor" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-12">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-1">{card.type}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${card.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`}></div>
                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{card.status}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
                                                {card.status === 'Locked' ? <Lock size={20} className="text-rose-400" /> : <ShieldCheck size={20} className="text-emerald-400" />}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.3em] mb-3">Número de Tarjeta</p>
                                                <p className="text-2xl font-mono text-white tracking-[0.25em]">
                                                    {isRevealed ? card.fullNumber : `**** **** **** ${card.last4}`}
                                                </p>
                                            </div>

                                            <div className="flex gap-12">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.3em] mb-2">Vencimiento</p>
                                                    <p className="text-sm font-bold text-white tracking-widest">{isRevealed ? card.expiry : '** / **'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.3em] mb-2">CVV</p>
                                                    <p className="text-sm font-bold text-white tracking-[0.3em]">{isRevealed ? card.cvv : '***'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 pt-8 mt-8 border-t border-white/5 flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.3em] mb-1">Titular</p>
                                            <p className="text-xs font-bold text-white uppercase tracking-wider">{user?.full_name || 'Titular de Cuenta'}</p>
                                        </div>
                                        
                                        {!isRevealed ? (
                                            <button 
                                                onClick={() => handleViewData(card.id)}
                                                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-3 backdrop-blur-xl border border-white/10"
                                            >
                                                <Eye size={14} /> Ver Datos
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setRevealedCards(prev => ({ ...prev, [card.id]: false }))}
                                                className="bg-cyan-500/20 hover:bg-cyan-500/30 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-cyan-400 transition-all flex items-center gap-3 backdrop-blur-xl border border-cyan-500/20"
                                            >
                                                <EyeOff size={14} /> Ocultar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-8 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 border border-white/5 rounded-[2rem] flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10">
                                <Zap size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white">¿Necesitas una nueva tarjeta?</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">Genera tarjetas virtuales infinitas con control de gasto instantáneo.</p>
                            </div>
                        </div>
                        <button className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:brightness-110 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-cyan-500/20 active:scale-95">
                            Emitir Tarjeta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardsModal;
