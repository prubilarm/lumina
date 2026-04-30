import React, { useState } from 'react';
import { X, Mail, Key, ShieldCheck, Lock, ArrowRight, Zap, Info } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            Swal.fire({
                icon: 'info',
                title: 'Código Generado',
                text: res.data.message,
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#0ea5e9'
            });
            setStep(2);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'No se pudo procesar la solicitud',
                background: '#0f172a',
                color: '#f8fafc'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, code, newPassword });
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Tu contraseña ha sido restablecida correctamente.',
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#0ea5e9'
            });
            onClose();
            setStep(1);
            setEmail('');
            setCode('');
            setNewPassword('');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Código inválido o error al restablecer',
                background: '#0f172a',
                color: '#f8fafc'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#05070A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-500/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                            <Lock size={20} />
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight">Recuperar Acceso</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <form onSubmit={handleRequestCode} className="space-y-6">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                Ingresa tu correo electrónico registrado para recibir un código de seguridad.
                            </p>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-purple-500/50 outline-none transition-all"
                                        placeholder="usuario@lumina.com"
                                    />
                                </div>
                            </div>
                            <button 
                                disabled={loading || !email}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-500/10 flex items-center justify-center gap-3"
                            >
                                {loading ? 'Procesando...' : 'Obtener Código'} <ArrowRight size={16} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Código de 6 Dígitos</label>
                                    <div className="relative">
                                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                                        <input 
                                            type="text" 
                                            required
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xl font-black tracking-[0.5em] text-white focus:border-purple-500/50 outline-none transition-all"
                                            placeholder="000000"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input 
                                            type="password" 
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-purple-500/50 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Atrás
                                </button>
                                <button 
                                    disabled={loading || !code || !newPassword}
                                    className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Restableciendo...' : 'Cambiar Contraseña'} <Key size={16} />
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center gap-3 text-slate-600">
                    <Info size={14} />
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]">Procedimiento de seguridad verificado por Lumina.</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
