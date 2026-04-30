import React from 'react';
import { X, TrendingUp, Zap, ArrowUpRight, ShieldCheck, PieChart } from 'lucide-react';

const InvestmentsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const investments = [
        { id: 1, asset: 'Bitcoin', symbol: 'BTC', amount: '0.428', value: '$28,450', change: '+12.4%', color: 'text-orange-400' },
        { id: 2, asset: 'Ethereum', symbol: 'ETH', amount: '4.5', value: '$11,200', change: '+5.2%', color: 'text-indigo-400' },
        { id: 3, asset: 'Lumina Tech Index', symbol: 'LTI', amount: '120.0', value: '$5,600', change: '-2.1%', color: 'text-cyan-400' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-3xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(168,85,247,0.2)] animate-in fade-in zoom-in duration-300">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-500/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white">Lumina Investments</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Mercado de activos globales en tiempo real</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Valor de Cartera</p>
                            <h4 className="text-3xl font-black text-white">$45,250</h4>
                            <p className="text-xs font-bold text-emerald-400 mt-2">+8.4% (Últimos 30 días)</p>
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Asignación</span>
                                    <PieChart size={14} />
                                </div>
                                <div className="mt-4 space-y-3">
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-orange-400" style={{ width: '60%' }}></div>
                                        <div className="h-full bg-indigo-400" style={{ width: '25%' }}></div>
                                        <div className="h-full bg-cyan-400" style={{ width: '15%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-600">
                                        <span>BTC</span>
                                        <span>ETH</span>
                                        <span>Otros</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 space-y-4">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Mis Activos</p>
                            <div className="space-y-3">
                                {investments.map((inv) => (
                                    <div key={inv.id} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black ${inv.color}`}>
                                                {inv.symbol}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{inv.asset}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{inv.amount} {inv.symbol}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-white">{inv.value}</p>
                                            <p className={`text-[10px] font-bold ${inv.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {inv.change}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] text-white shadow-2xl shadow-purple-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                        Explorar Oportunidades <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestmentsModal;
