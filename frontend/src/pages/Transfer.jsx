import { useState, useEffect } from 'react';
import api from '../services/api';
import { Send, CheckCircle2 } from 'lucide-react';
import { alerts } from '../utils/alerts';
import { useNotifications } from '../context/NotificationContext';

const Transfer = () => {
  const [fromAccount, setFromAccount] = useState(null);
  const [targetAccount, setTargetAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const { data } = await api.get('/accounts/me');
        setFromAccount(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (parseFloat(amount) > parseFloat(fromAccount.balance)) {
      return alerts.error('Saldo Insuficiente', 'No tienes fondos suficientes para esta operación.');
    }

    const { isConfirmed } = await alerts.confirm(
      '¿Confirmar Transferencia?',
      `Estás a punto de enviar $${parseFloat(amount).toLocaleString()} a la cuenta ${targetAccount}.`
    );

    if (!isConfirmed) return;

    try {
      await api.post('/transactions/transfer', {
        fromAccountId: fromAccount.id,
        toAccountNumber: targetAccount,
        amount
      });

      addNotification({
        title: 'Transferencia Exitosa',
        message: `Has enviado $${parseFloat(amount).toLocaleString()} a la cuenta ${targetAccount}.`,
        type: 'success'
      });

      alerts.success('Tracción Completada', 'El dinero ha sido enviado correctamente.');
      setSuccess(true);
      setAmount('');
      setTargetAccount('');
    } catch (err) {
      alerts.error('Error en la Transferencia', err.response?.data?.message || 'Error en la transferencia');
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Transferir Dinero</h1>

      {success ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', marginBottom: '1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>¡Transferencia Exitosa!</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>El dinero ha sido enviado correctamente a la cuenta destino.</p>
          <button className="btn btn-primary" onClick={() => setSuccess(false)}>Realizar otra transferencia</button>
        </div>
      ) : (
        <div className="card">
          <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Cuenta de Destino</label>
              <input 
                className="input" 
                placeholder="Número de cuenta (ej: 1000000002)" 
                value={targetAccount}
                onChange={(e) => setTargetAccount(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Monto a Transferir</label>
              <input 
                className="input" 
                type="number"
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                Saldo disponible: ${parseFloat(fromAccount?.balance).toLocaleString()}
              </p>
            </div>

            <button type="submit" className="btn btn-primary">
              <Send size={18} /> Confirmar Transferencia
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Transfer;
