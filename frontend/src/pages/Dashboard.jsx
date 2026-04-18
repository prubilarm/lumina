import { useState, useEffect } from 'react';
import api from '../services/api';
import { Wallet, ArrowUpCircle, ArrowDownCircle, RefreshCw, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAccount = async () => {
    try {
      const { data } = await api.get('/accounts/me');
      setAccount(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  if (loading) return <p>Cargando datos de cuenta...</p>;

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Hola, {account?.account_number ? 'Bienvenido de nuevo' : 'Cargando...'}</h1>
        <p style={{ color: 'var(--text-light)' }}>Gestiona tu dinero con seguridad y rapidez.</p>
      </header>

      <div className="grid">
        {/* Card de Saldo */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ opacity: 0.8 }}>Saldo Disponible</span>
            <Wallet size={24} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            ${parseFloat(account?.balance).toLocaleString('es-CL')}
          </h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Cuenta N° {account?.account_number}</p>
        </div>

        {/* Acciones Rápidas */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Acciones Rápidas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Link to="/transacciones" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              <ArrowDownCircle size={18} /> Depositar
            </Link>
            <Link to="/transacciones" className="btn btn-primary" style={{ textDecoration: 'none', background: '#f1f5f9', color: 'var(--text)' }}>
              <ArrowUpCircle size={18} /> Retirar
            </Link>
            <Link to="/transferir" className="btn btn-primary" style={{ textDecoration: 'none', gridColumn: 'span 2' }}>
              <RefreshCw size={18} /> Transferir Dinero
            </Link>
          </div>
        </div>

        {/* Historial Corto */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: '700' }}>Últimos Movimientos</h3>
              <Link to="/transacciones" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem' }}>Ver todo</Link>
           </div>
           <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>
             <History size={32} style={{ opacity: 0.2, marginBottom: '0.5rem' }} /><br/>
             Usa el menú de transacciones para ver tu historial completo.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
