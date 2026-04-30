import React, { useState } from 'react';
import { X, Settings, ShieldLock, User, Mail, Save, Key, AlertCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const SettingsModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    
    // Profile State
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    
    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    if (!isOpen) return null;

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/user/profile', { full_name: fullName, email });
            Swal.fire({
                icon: 'success',
                title: 'Perfil Actualizado',
                text: res.data.message,
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#0ea5e9'
            });
            onUpdate();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'No se pudo actualizar el perfil',
                background: '#0f172a',
                color: '#f8fafc'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden', background: '#0f172a', color: '#f8fafc' });
        }
        
        setLoading(true);
        try {
            const res = await api.put('/user/change-password', { currentPassword, newPassword });
            Swal.fire({
                icon: 'success',
                title: 'Contraseña Cambiada',
                text: res.data.message,
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#0ea5e9'
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'No se pudo cambiar la contraseña',
                background: '#0f172a',
                color: '#f8fafc'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(34,211,238,0.2)] animate-in fade-in zoom-in duration-300">
                <div className="flex">
                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-white/[0.02] border-r border-white/5 p-8 space-y-2">
                        <div className="flex items-center gap-3 mb-10 px-2">
                            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                                <Settings size={20} />
                            </div>
                            <span className="font-black text-white tracking-tight">Ajustes</span>
                        </div>
                        
                        <TabButton 
                            active={activeTab === 'profile'} 
                            onClick={() => setActiveTab('profile')}
                            icon={<User size={18} />}
                            label="Perfil"
                        />
                        <TabButton 
                            active={activeTab === 'security'} 
                            onClick={() => setActiveTab('security')}
                            icon={<ShieldLock size={18} />}
                            label="Seguridad"
                        />
                        <TabButton 
                            active={activeTab === 'preferences'} 
                            onClick={() => setActiveTab('preferences')}
                            icon={<Zap size={18} />}
                            label="Preferencias"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight">
                                    {activeTab === 'profile' ? 'Información del Perfil' : 
                                     activeTab === 'security' ? 'Seguridad de Cuenta' : 'Preferencias'}
                                </h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Configuración del Sistema Lumina</p>
                            </div>
                            <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {activeTab === 'profile' && (
                            <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input 
                                                type="text" 
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    disabled={loading}
                                    className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Guardando...' : 'Guardar Cambios'} <Save size={18} />
                                </button>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handleChangePassword} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña Actual</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input 
                                                type="password" 
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5 my-2"></div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input 
                                                type="password" 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmar Nueva Contraseña</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input 
                                                type="password" 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    disabled={loading || !currentPassword || !newPassword}
                                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Cambiando...' : 'Actualizar Contraseña'} <Key size={18} />
                                </button>
                            </form>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="p-8 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl text-center">
                                    <Zap className="mx-auto text-cyan-400 mb-4" size={32} />
                                    <p className="text-sm font-bold text-white mb-2">Más opciones próximamente</p>
                                    <p className="text-xs text-slate-500">Estamos trabajando en permitirte personalizar colores, notificaciones y límites de cuenta.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
            active 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
        }`}
    >
        <div className={`${active ? 'text-cyan-400' : 'group-hover:text-cyan-500'} transition-colors`}>
            {icon}
        </div>
        <span className="font-bold text-sm">{label}</span>
    </button>
);

export default SettingsModal;
