import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Zap, Lock, Eye, EyeOff, Wifi } from 'lucide-react';
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
            brand: 'VISA',
            last4: '8842', 
            fullNumber: '4532 8842 1190 8842', 
            expiry: '12/28', 
            cvv: '884', 
            status: 'Active', 
            color: 'from-slate-900 via-slate-800 to-slate-950' 
        },
        { 
            id: 2, 
            type: 'Mastercard World Elite', 
            brand: 'MASTERCARD',
            last4: '2291', 
            fullNumber: '5412 2291 0034 2291', 
            expiry: '05/27', 
            cvv: '129', 
            status: 'Locked', 
            color: 'from-indigo-950 via-purple-900 to-slate-900' 
        }
    ];

    const handleViewData = async (cardId) => {
        const { value: password } = await Swal.fire({
            title: 'Verificar Identidad',
            text: 'Por seguridad, ingrese su contraseña para ver los datos sensibles.',
            input: 'password',
            inputPlaceholder: 'Contraseña de acceso',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off',
                autocomplete: 'new-password'
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
                    text: err.response?.data?.message || 'Contraseña incorrecta o error de servidor.',
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
            <div className="w-full max-w-5xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_-20px_rgba(34,211,238,0.2)] animate-in fade-in zoom-in duration-300">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-cyan-500/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white">Centro de Tarjetas</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Gestión de activos físicos y virtuales • Lumina Bank</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-10 space-y-12 overflow-y-auto max-h-[70vh] no-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {cards.map((card) => {
                            const isRevealed = revealedCards[card.id];
                            return (
                                <div key={card.id} className="space-y-6">
                                    {/* Physical Card Representation */}
                                    <div className={`relative aspect-[1.586/1] w-full rounded-[2rem] bg-gradient-to-br ${card.color} border border-white/10 shadow-2xl p-8 flex flex-col justify-between overflow-hidden group`}>
                                        {/* Background Textures */}
                                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                                        </div>
                                        
                                        {/* Top Section */}
                                        <div className="relative z-10 flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase italic">{card.type}</p>
                                                <div className="mt-4 w-12 h-10 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-200 rounded-lg shadow-inner relative overflow-hidden">
                                                    {/* Chip Lines */}
                                                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                                                        {[...Array(9)].map((_, i) => <div key={i} className="border border-black/20"></div>)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-2xl font-black italic text-white tracking-tighter">
                                                        {card.brand === 'VISA' ? (
                                                            <span className="flex items-center gap-2">VISA <Wifi size={16} className="rotate-90 text-white/40" /></span>
                                                        ) : (
                                                            <span className="flex items-center gap-2">MasterCard <Wifi size={16} className="rotate-90 text-white/40" /></span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle Section: Number */}
                                        <div className="relative z-10">
                                            <p className="text-2xl md:text-3xl font-mono text-white tracking-[0.2em] drop-shadow-lg transition-all duration-500">
                                                {isRevealed ? card.fullNumber : `**** **** **** ${card.last4}`}
                                            </p>
                                        </div>

                                        {/* Bottom Section: Info */}
                                        <div className="relative z-10 flex justify-between items-end">
                                            <div className="space-y-4">
                                                <div className="flex gap-8">
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Validez</p>
                                                        <p className="text-sm font-bold text-white tracking-widest">{isRevealed ? card.expiry : '** / **'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">CVV</p>
                                                        <p className="text-sm font-bold text-white tracking-[0.3em]">{isRevealed ? card.cvv : '***'}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Titular</p>
                                                    <p className="text-xs font-black text-white uppercase tracking-widest">{user?.full_name || 'Pablo Rubilar Morales'}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                                {card.status === 'Locked' ? <Lock size={20} className="text-rose-400" /> : <ShieldCheck size={20} className="text-emerald-400" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex justify-center">
                                        {!isRevealed ? (
                                            <button 
                                                onClick={() => handleViewData(card.id)}
                                                className="w-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all flex items-center justify-center gap-3"
                                            >
                                                <Eye size={16} /> Revelar Información de Seguridad
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setRevealedCards(prev => ({ ...prev, [card.id]: false }))}
                                                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 transition-all flex items-center justify-center gap-3"
                                            >
                                                <EyeOff size={16} /> Ocultar Datos Sensibles
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Info */}
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <Zap size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white">Control Total de Activos</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">Todas las tarjetas Lumina están protegidas por encriptación de grado militar y monitoreo 24/7.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardsModal;
