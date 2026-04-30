import React from 'react';
import { X, CreditCard, ShieldCheck, Zap, Lock } from 'lucide-react';

const CardsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const cards = [
        { id: 1, type: 'Visa Infinite', number: '**** **** **** 8842', expiry: '12/28', status: 'Active', color: 'from-slate-800 to-slate-900' },
        { id: 2, type: 'Mastercard World Elite', number: '**** **** **** 2291', expiry: '05/27', status: 'Locked', color: 'from-indigo-900 to-purple-900' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(34,211,238,0.2)] animate-in fade-in zoom-in duration-300">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-cyan-500/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white">Centro de Tarjetas</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Gestión de activos físicos y virtuales</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cards.map((card) => (
                            <div key={card.id} className={`p-8 rounded-[2rem] bg-gradient-to-br ${card.color} border border-white/10 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer shadow-2xl`}>
                                <div className="absolute top-0 right-0 p-6 opacity-20">
                                    <Zap size={60} fill="currentColor" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-12">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">{card.type}</p>
                                        {card.status === 'Locked' ? <Lock size={16} className="text-rose-400" /> : <ShieldCheck size={16} className="text-emerald-400" />}
                                    </div>
                                    <p className="text-xl font-mono text-white tracking-[0.2em] mb-4">{card.number}</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Vence</p>
                                            <p className="text-xs font-bold text-white">{card.expiry}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${card.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                            {card.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                                <Zap size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">Solicitar Tarjeta Virtual</p>
                                <p className="text-[10px] text-slate-500 font-medium">Emisión instantánea sin costo adicional</p>
                            </div>
                        </div>
                        <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">Solicitar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardsModal;
