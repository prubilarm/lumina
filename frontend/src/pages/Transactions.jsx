import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { ArrowDownCircle, ArrowUpCircle, History, CheckCircle2 } from 'lucide-react';
import { alerts } from '../utils/alerts';
import $ from 'jquery';
import 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';

const Transactions = () => {
  const [account, setAccount] = useState(null);
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const tableRef = useRef();
  const dtInstance = useRef(null);

  const fetchData = async () => {
    try {
      const { data: acc } = await api.get('/accounts/me');
      setAccount(acc);
      const { data: hist } = await api.get(`/transactions/history/${acc.id}`);
      setHistory(hist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Inicializar DataTables cuando los datos cambien
  useEffect(() => {
    if (!loading && history.length > 0 && tableRef.current) {
      if (dtInstance.current) {
        dtInstance.current.destroy();
      }

      dtInstance.current = $(tableRef.current).DataTable({
        language: {
          decimal: "",
          emptyTable: "No hay transacciones disponibles",
          info: "Mostrando _START_ a _END_ de _TOTAL_ movimientos",
          infoEmpty: "Mostrando 0 a 0 de 0 movimientos",
          infoFiltered: "(filtrado de _MAX_ movimientos totales)",
          infoPostFix: "",
          thousands: ",",
          lengthMenu: "Mostrar _MENU_ movimientos",
          loadingRecords: "Cargando...",
          processing: "Procesando...",
          search: "Buscar:",
          zeroRecords: "No se encontraron movimientos coincidentes",
          paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
          }
        },
        order: [[2, 'desc']], // Ordenar por fecha por defecto
        responsive: true,
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50],
        drawCallback: function() {
           // Estilos personalizados para las celdas después de cada renderizado de DT
           $('.dt-type-badge').css({
             'padding': '0.25rem 0.75rem',
             'border-radius': '1rem',
             'font-size': '0.75rem',
             'font-weight': '700',
             'display': 'inline-block'
           });
        }
      });
    }

    return () => {
      if (dtInstance.current) {
        dtInstance.current.destroy();
        dtInstance.current = null;
      }
    };
  }, [history, loading]);

  const handleAction = async (type) => {
    if (!amount || amount <= 0) {
      return alerts.error('Monto Inválido', 'Ingrese un monto válido para la operación.');
    }

    if (type === 'withdraw' && parseFloat(amount) > parseFloat(account.balance)) {
      return alerts.error('Saldo Insuficiente', 'No dispones de fondos suficientes para retirar esa cantidad.');
    }

    const { isConfirmed } = await alerts.confirm(
      `¿Confirmar ${type === 'deposit' ? 'Depósito' : 'Retiro'}?`,
      `Estás a punto de ${type === 'deposit' ? 'depositar' : 'retirar'} $${parseFloat(amount).toLocaleString()}.`
    );

    if (!isConfirmed) return;

    try {
      const endpoint = type === 'deposit' ? '/transactions/deposit' : '/transactions/withdraw';
      await api.post(endpoint, { accountId: account.id, amount });
      setAmount('');
      alerts.success('¡Éxito!', `El ${type === 'deposit' ? 'depósito' : 'retiro'} se realizó correctamente.`);
      fetchData();
    } catch (err) {
      alerts.error('Error', err.response?.data?.message || 'Error en la operación');
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="fade-in">
      <h1 style={{ marginBottom: '2rem' }}>Transacciones</h1>

      {/* alerts handle feedback now */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Formulario */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Operación Rápida</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Monto</label>
              <input 
                type="number" 
                className="input" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => handleAction('deposit')}>
              <ArrowDownCircle size={18} /> Depositar
            </button>
            <button className="btn" style={{ background: '#f1f5f9' }} onClick={() => handleAction('withdraw')}>
              <ArrowUpCircle size={18} /> Retirar
            </button>
          </div>
        </div>

        {/* Historial */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} /> Historial de Movimientos
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table ref={tableRef} className="display" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                   <th style={{ padding: '1rem 0' }}>Tipo</th>
                   <th>Monto</th>
                   <th>Fecha</th>
                   <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {history.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <span className="dt-type-badge" style={{ 
                        background: tx.type.includes('DEPOSIT') || tx.type === 'TRANSFER_IN' ? '#dcfce7' : '#fee2e2',
                        color: tx.type.includes('DEPOSIT') || tx.type === 'TRANSFER_IN' ? '#166534' : '#991b1b'
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {tx.type.includes('DEPOSIT') || tx.type === 'TRANSFER_IN' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: '500' }}>${parseFloat(tx.balance_after).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
