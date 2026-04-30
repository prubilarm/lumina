import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CreditCard, User, Wallet, ShieldCheck, Zap, Lock, Info, AlertTriangle, Plus, Users, Trash2 } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const TransferModal = ({ isOpen, onClose, onSuccess, accounts = [] }) => {
    const [step, setStep] = useState(1); 
    const [transferType, setTransferType] = useState(''); 
    const [destinationCard, setDestinationCard] = useState('');
    const [recipient, setRecipient] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [senderAccount, setSenderAccount] = useState('');
    
    // Contacts State
    const [savedRecipients, setSavedRecipients] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newName, setNewName] = useState('');
    const [shouldSave, setShouldSave] = useState(true);

    // Auto-select account with most funds on open
    useEffect(() => {
        if (isOpen && accounts.length > 0) {
            const bestAccount = [...accounts].sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))[0];
            setSenderAccount(bestAccount.account_number);
            fetchRecipients();
        }
    }, [isOpen, accounts]);

    const fetchRecipients = async () => {
        try {
            const res = await api.get('/recipients');
            setSavedRecipients(res.data);
        } catch (err) {
            console.error('Error fetching recipients:', err);
        }
    };

    if (!isOpen) return null;

    const reset = () => {
        setStep(1);
        setTransferType('');
        setDestinationCard('');
        setRecipient(null);
        setAmount('');
        setDescription('');
        setPassword('');
        setLoading(false);
        setIsAddingNew(false);
        setNewName('');
        setShouldSave(true);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSelectSaved = async (contact) => {
        setLoading(true);
        try {
            // Check if it's a card number or account number (our system handles both)
            const res = await api.get(`/transactions/recipient/${contact.account_number}`);
            setRecipient({
                ...res.data,
                id: contact.id // Keep the recipient record ID
            });
            setDestinationCard(contact.account_number);
            setStep(4);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error con el contacto',
                text: 'No se pudo validar los datos del contacto guardado.',
                background: '#0f172a',
                color: '#f8fafc'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleValidateNew = async () => {
        if (!destinationCard) return;
        setLoading(true);
        try {
            const res = await api.get(`/transactions/recipient/${destinationCard}`);
            setRecipient(res.data);
            setStep(4);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Destinatario no encontrado',
                text: err.response?.data?.message || 'Verifique el número de tarjeta.',
                background: '#0f172a',
                color: '#f8fafc'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleContinueFromStep2 = () => {
        if (transferType === 'own') {
            const otherAccount = accounts.find(a => a.account_number !== senderAccount);
            if (otherAccount) {
                setRecipient({
                    name: 'Mi Cuenta Propia',
                    account_number: otherAccount.account_number,
                    bank: 'Lumina Bank'
                });
                setStep(4);
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin otras cuentas',
                    text: 'No tienes otras cuentas propias a las que transferir.',
                    background: '#0f172a',
                    color: '#f8fafc'
                });
            }
        } else {
            setStep(3); // Go to third party selection/add
        }
    };

    const handleExecuteTransfer = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        
        const { value: pass } = await Swal.fire({
            title: 'Autorización de Seguridad',
            text: 'Por seguridad, ingrese su clave secreta para autorizar la transferencia.',
            input: 'password',
            inputPlaceholder: 'Clave secreta',
            showCancelButton: true,
            confirmButtonText: 'Autorizar',
            confirmButtonColor: '#0ea5e9',
            background: '#0f172a',
            color: '#f8fafc',
            customClass: {
                input: 'bg-white/5 border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50'
            }
        });

        if (!pass) return;

        setLoading(true);
        try {
            // 1. Verify Password
            await api.post('/auth/verify-password', { password: pass });

            // 2. Save Contact if requested and new
            if (isAddingNew && shouldSave && newName) {
                await api.post('/recipients', {
                    name: newName,
                    account_number: destinationCard,
                    bank_name: 'Lumina Bank'
                });
            }

        // 3. Perform Transfer
        const numericAmount = parseFloat(amount);
        if (numericAmount < 10) {
            Swal.fire({ icon: 'warning', title: 'Monto insuficiente', text: 'La transferencia mínima es de $10 pesos.', background: '#0f172a', color: '#f8fafc' });
            setLoading(false);
            return;
        }

        const response = await api.post('/transactions/transfer', {
            amount: numericAmount,
            receiver_card_number: transferType === 'third' ? destinationCard : undefined,
                receiver_account_number: transferType === 'own' ? recipient.account_number : undefined,
                description,
                sender_account_number: senderAccount
            });

            const tx = response.data.transaction;

            Swal.fire({
                title: 'Transferencia Realizada con Éxito',
                html: `
                  <div class="text-left space-y-4 p-4 bg-white/5 border border-white/10 rounded-2xl mt-4">
                    <div class="flex justify-between items-center border-b border-white/5 pb-3">
                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nº de Operación</span>
                        <span class="text-[10px] font-mono text-cyan-400 font-bold">${String(tx.id).includes('-') ? tx.id.split('-')[0].toUpperCase() : tx.id}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white/5 pb-3">
                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monto Transferido</span>
                        <span class="text-lg font-black text-white">$${parseFloat(amount).toLocaleString('es-CL')}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white/5 pb-3">
                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Destinatario</span>
                        <span class="text-xs font-bold text-slate-300">${recipient.name}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha y Hora</span>
                        <span class="text-[10px] font-bold text-slate-500">${new Date(tx.created_at).toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                  <p class="text-[8px] text-slate-600 mt-4 uppercase font-black tracking-widest text-center">Este comprobante sirve como respaldo legal de su operación.</p>
                `,
                icon: 'success',
                background: '#05070A',
                color: '#f8fafc',
                confirmButtonColor: '#0ea5e9',
                confirmButtonText: 'Cerrar Comprobante',
                customClass: {
                    popup: 'rounded-[2.5rem] border border-white/10 shadow-2xl'
                }
            });
            onSuccess();
            handleClose();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error en la operación',
                text: err.response?.data?.message || 'No se pudo completar la transferencia.',
                background: '#0f172a',
                color: '#f8fafc'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = async (id, e) => {
        e.stopPropagation();
        const result = await Swal.fire({
            title: '¿Eliminar contacto?',
            text: "No podrás deshacer esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#0f172a',
            color: '#f8fafc'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/recipients/${id}`);
                fetchRecipients();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const selectedAccData = accounts.find(a => a.account_number === senderAccount);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020408]/90 backdrop-blur-md">
            <div className="w-full max-w-xl bg-[#05070A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(34,211,238,0.2)] animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-cyan-500/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter text-white">Transferencia Lumina</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Protocolo de Movimiento de Fondos</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex justify-between mb-10 px-4">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                    step >= s ? 'bg-cyan-500 text-[#020408] shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/5 text-slate-600'
                                }`}>
                                    {s}
                                </div>
                                {s < 4 && <div className={`w-10 h-px ${step > s ? 'bg-cyan-500' : 'bg-white/5'}`}></div>}
                            </div>
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 text-center">Seleccione Tipo de Transferencia</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => { setTransferType('own'); setStep(2); }}
                                    className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all group flex flex-col items-center gap-4 text-center"
                                >
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                        <Wallet size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Mis Cuentas</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Traspaso interno</p>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => { setTransferType('third'); setStep(2); }}
                                    className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all group flex flex-col items-center gap-4 text-center"
                                >
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">A Terceros</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Otros destinatarios</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold mb-4">
                                <ArrowLeft size={14} /> Volver
                            </button>
                            
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Origen de Fondos</label>
                                <select 
                                    value={senderAccount}
                                    onChange={(e) => setSenderAccount(e.target.value)}
                                    className="w-full bg-white/10 border border-cyan-500/30 rounded-2xl py-4 px-6 text-sm text-white focus:border-cyan-500 outline-none transition-all appearance-none"
                                >
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.account_number} className="bg-[#0f172a]">
                                            {acc.account_number.startsWith('SAV') ? 'Ahorros' : 'Corriente'} - {acc.account_number} (${parseFloat(acc.balance).toLocaleString('es-CL')})
                                        </option>
                                    ))}
                                </select>
                                {selectedAccData && parseFloat(selectedAccData.balance) === 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 font-bold uppercase">
                                        <AlertTriangle size={14} /> Esta cuenta no tiene fondos suficientes.
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleContinueFromStep2}
                                disabled={selectedAccData && parseFloat(selectedAccData.balance) === 0}
                                className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/10 flex items-center justify-center gap-3 mt-4"
                            >
                                Continuar <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-center mb-2">
                                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold">
                                    <ArrowLeft size={14} /> Volver
                                </button>
                                <button 
                                    onClick={() => setIsAddingNew(!isAddingNew)}
                                    className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    {isAddingNew ? <Users size={14} /> : <Plus size={14} />}
                                    {isAddingNew ? 'Ver Mis Contactos' : 'Nuevo Destinatario'}
                                </button>
                            </div>

                            {!isAddingNew ? (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Seleccionar Contacto</label>
                                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                                        {savedRecipients.length > 0 ? (
                                            savedRecipients.map(contact => (
                                                <button 
                                                    key={contact.id}
                                                    onClick={() => handleSelectSaved(contact)}
                                                    className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 rounded-2xl transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                                                            {contact.name.charAt(0)}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold text-white">{contact.name}</p>
                                                            <p className="text-[10px] text-slate-500 font-mono">{contact.account_number}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Seleccionar</span>
                                                        <Trash2 
                                                            size={14} 
                                                            className="text-slate-600 hover:text-red-400 transition-colors" 
                                                            onClick={(e) => handleDeleteContact(contact.id, e)}
                                                        />
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                                <Users className="mx-auto text-slate-700 mb-4" size={32} />
                                                <p className="text-xs font-bold text-slate-500">No tienes contactos guardados todavía.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Destinatario</label>
                                            <input 
                                                type="text" 
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                placeholder="Ej: Juan Perez"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Número de Tarjeta o Cuenta</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                                <input 
                                                    type="text" 
                                                    value={destinationCard}
                                                    onChange={(e) => setDestinationCard(e.target.value)}
                                                    placeholder="4532 XXXX XXXX XXXX"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-3 cursor-pointer group p-2">
                                            <input 
                                                type="checkbox" 
                                                checked={shouldSave} 
                                                onChange={(e) => setShouldSave(e.target.checked)}
                                                className="hidden"
                                            />
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${shouldSave ? 'bg-cyan-500 border-cyan-500' : 'border-white/10 bg-white/5'}`}>
                                                {shouldSave && <ShieldCheck size={12} className="text-[#020408]" />}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Guardar en mis contactos</span>
                                        </label>
                                    </div>

                                    <button 
                                        onClick={handleValidateNew}
                                        disabled={loading || !destinationCard || !newName}
                                        className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/10 flex items-center justify-center gap-3"
                                    >
                                        {loading ? 'Validando...' : 'Validar y Continuar'} <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 4 && recipient && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-[2rem] p-8 space-y-6">
                                <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirmación de Destino</p>
                                        <p className="text-lg font-black text-white">{isAddingNew ? newName : recipient.name}</p>
                                        <p className="text-[10px] text-slate-500 font-mono">{destinationCard}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Wallet size={16} className="text-cyan-400" />
                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Saldo Origen</span>
                                    </div>
                                    <span className="text-sm font-black text-white">
                                        ${parseFloat(selectedAccData?.balance || 0).toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Monto a Transferir (CLP)</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-400 font-black">$</span>
                                        <input 
                                            type="number" 
                                            value={amount}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val.startsWith('-')) {
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Monto no válido',
                                                        text: 'No se permiten montos negativos.',
                                                        timer: 2000,
                                                        showConfirmButton: false,
                                                        background: '#0f172a',
                                                        color: '#f8fafc'
                                                    });
                                                    return;
                                                }
                                                setAmount(val);
                                            }}
                                            placeholder="0"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-10 pr-6 text-2xl font-black text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => setStep(transferType === 'third' ? 3 : 2)}
                                    className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Corregir
                                </button>
                                <button 
                                    onClick={handleExecuteTransfer}
                                    disabled={loading || !amount}
                                    className="flex-[2] py-5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Procesando...' : 'Autorizar Transferencia'} <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center gap-3 text-slate-600">
                    <Info size={14} />
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]">Operación cifrada • Lumina Secure Transaction Protocol</p>
                </div>
            </div>
        </div>
    );
};

export default TransferModal;

