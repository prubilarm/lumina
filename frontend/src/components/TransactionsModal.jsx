import React from 'react';
import { X, History as HistoryIcon, ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react';

const TransactionsModal = ({ isOpen, onClose, transactions, accounts }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-4xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(34,211,238,0.2)] animate-in fade-in zoom-in duration-300 flex flex-col max-h-[85vh]">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-cyan-500/5 to-transparent shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                            <HistoryIcon size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white">Historial de Movimientos</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Registro completo de transacciones en cadena</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-6 border-b border-white/5 bg-white/[0.01] shrink-0">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por ID, fecha o descripción..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID / Fecha</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Descripción</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-all">
                                    <td className="px-6 py-6">
                                        <p className="text-xs font-black text-white">#{tx.id.toString().substring(0, 8)}</p>
                                        <p className="text-[10px] text-slate-500 font-bold mt-1">
                                            {new Date(tx.created_at).toLocaleString('es-CL')}
                                        </p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                tx.type === 'withdraw' || (tx.sender_id && tx.sender_id === accounts[0]?.id) ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                                            }`}>
                                                {tx.type === 'withdraw' || (tx.sender_id && tx.sender_id === accounts[0]?.id) ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{tx.description || 'Transacción Lumina'}</p>
                                                <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{tx.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-6 text-right font-black text-sm ${
                                        tx.type === 'withdraw' || (tx.sender_id && tx.sender_id === accounts[0]?.id) ? 'text-white' : 'text-emerald-400'
                                    }`}>
                                        {tx.type === 'withdraw' || (tx.sender_id && tx.sender_id === accounts[0]?.id) ? '-' : '+'}${parseFloat(tx.amount).toLocaleString('es-CL')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionsModal;
