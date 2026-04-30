import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import PlasticCard from './PlasticCard';

const CardGallery = ({ accounts = [], onAction }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);

    if (!accounts || accounts.length === 0) return null;

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % accounts.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + accounts.length) % accounts.length);
    };

    return (
        <div className="relative w-full flex flex-col items-center">
            {/* Gallery Header Actions */}
            <div className="w-full flex justify-between items-center mb-6 px-4">
                <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Lumina Wealth</p>
                    <h4 className="text-white font-bold text-sm">Mis Productos Digitales</h4>
                </div>
                <button 
                    onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-slate-400 flex items-center gap-2 group"
                >
                    {isBalanceHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        {isBalanceHidden ? 'Mostrar' : 'Ocultar'}
                    </span>
                </button>
            </div>

            {/* Main Carousel Area */}
            <div className="relative w-full h-[340px] flex items-center justify-center overflow-visible">
                <AnimatePresence initial={false} mode="popLayout">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 200, scale: 0.8, rotateY: 45 }}
                        animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, x: -200, scale: 0.8, rotateY: -45 }}
                        transition={{ 
                            type: 'spring', 
                            stiffness: 150, 
                            damping: 20,
                            mass: 1
                        }}
                        style={{ perspective: 2000 }}
                        className="absolute inset-0 z-20 px-4"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.x < -50) handleNext();
                            else if (offset.x > 50) handlePrev();
                        }}
                    >
                        <PlasticCard 
                            account={accounts[activeIndex]} 
                            isCredit={activeIndex === 0} // Assuming first is credit or based on some property
                            isBalanceHidden={isBalanceHidden}
                            onAction={onAction}
                        />
                    </motion.div>

                    {/* Next Card Peek (Decorative) */}
                    <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-full h-[85%] z-10 opacity-20 scale-90 blur-[2px] pointer-events-none hidden lg:block">
                         <div className="w-full h-full bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                             {/* Content of next card would go here, but keeping it empty/blurred for performance */}
                         </div>
                    </div>
                </AnimatePresence>

                {/* Desktop Navigation Arrows */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none z-30">
                    <button 
                        onClick={handlePrev}
                        className="p-4 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white pointer-events-auto transition-all hover:scale-110 active:scale-95 -translate-x-6"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={handleNext}
                        className="p-4 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white pointer-events-auto transition-all hover:scale-110 active:scale-95 translate-x-6"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {accounts.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-700 ${i === activeIndex ? 'w-10 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'w-2 bg-white/10 hover:bg-white/20'}`} 
                    />
                ))}
            </div>
        </div>
    );
};

export default CardGallery;
