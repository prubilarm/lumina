import React from 'react';
import { motion } from 'framer-motion';
import { Share2, History, FileText, Zap, CreditCard as CardIcon } from 'lucide-react';

const PlasticCard = ({ 
    account, 
    isCredit = false, 
    isBalanceHidden = false, 
    onAction, 
    isRevealed = false,
    cardType: propCardType,
    hideActions = false
}) => {
    const balance = parseFloat(account.balance || 0).toLocaleString('es-CL');
    const displayBalance = isBalanceHidden ? '••••••' : `$${balance}`;
    const accountNumber = account.account_number || '---';
    const cardType = propCardType || (isCredit ? 'Tarjeta de Crédito' : 'Tarjeta de Débito');
    
    // Aesthetic colors based on card type
    const cardStyles = isCredit 
        ? {
            bg: 'bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#0a0a0a]',
            border: 'border-white/10',
            text: 'text-white',
            subtext: 'text-white/40',
            buttonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
            buttonSecondary: 'border border-white/20 hover:bg-white/10 text-white',
            accent: 'text-indigo-400'
        }
        : {
            bg: 'bg-white/90 backdrop-blur-md',
            border: 'border-white/20',
            text: 'text-slate-900',
            subtext: 'text-slate-500',
            buttonPrimary: 'bg-[#3b5998] hover:bg-[#2d4373] text-white shadow-lg shadow-[#3b5998]/20', 
            buttonSecondary: 'border border-[#3b5998] hover:bg-[#3b5998]/5 text-[#3b5998]',
            accent: 'text-slate-400'
        };

    return (
        <div className={`w-full h-full ${cardStyles.bg} ${cardStyles.border} border rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group select-none`}>
            {/* Glossy Overlay for "Futuristic" feel */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none"></div>
            
            {/* Top Row: Account Info & Share */}
            <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-black tracking-tight ${cardStyles.text}`}>
                            {account.name || (isCredit ? 'Lumina Platinum' : 'Cuenta Corriente')}
                        </span>
                        <span className={`text-xs font-medium font-mono ${cardStyles.subtext}`}>
                            {accountNumber}
                        </span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${cardStyles.accent}`}>
                        {cardType}
                    </span>
                </div>
                <button className={`p-2 rounded-full transition-all ${isCredit ? 'hover:bg-white/10 text-white/40' : 'hover:bg-slate-100 text-slate-400'}`}>
                    <Share2 size={18} />
                </button>
            </div>

            {/* Middle Row: Balance & Number */}
            <div className="relative z-10 py-2">
                <div className="flex flex-col">
                    <span className={`text-4xl font-black tracking-tighter ${cardStyles.text}`}>
                        {displayBalance}
                    </span>
                    <span className={`text-xs font-bold mt-1 ${cardStyles.subtext}`}>
                        Saldo disponible
                    </span>
                </div>
                {isRevealed && (
                    <div className="mt-4">
                        <span className={`text-lg font-mono tracking-[0.2em] font-bold ${cardStyles.text}`}>
                            {account.card_number || '4532 6944 8219 2794'}
                        </span>
                    </div>
                )}
            </div>

            {/* Bottom Row: Action Buttons */}
            {!hideActions && (
                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <button 
                        onClick={() => onAction && onAction('movimientos')}
                        className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${cardStyles.buttonPrimary}`}
                    >
                        <History size={16} /> Movimientos
                    </button>
                    <button 
                        onClick={() => onAction && onAction('cartolas')}
                        className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${cardStyles.buttonSecondary}`}
                    >
                        <FileText size={16} /> Cartolas
                    </button>
                </div>
            )}

            {/* Status Section */}
            <div className="relative z-10 flex items-center justify-between mt-2 pt-4 border-t border-current/10 opacity-60">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[8px] font-black uppercase tracking-widest">Servicio Operativo</span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">Cuenta Activa</span>
            </div>

            {/* Card Brand Decorative Icon */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 opacity-[0.03] ${isCredit ? 'text-white' : 'text-slate-900'} pointer-events-none`}>
                {isCredit ? <CardIcon size={160} /> : <Zap size={160} />}
            </div>
        </div>
    );
};

export default PlasticCard;
