import { LogOut, Landmark, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import { alerts } from '../utils/alerts';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const { isConfirmed } = await alerts.confirm(
      '¿Cerrar Sesión?',
      '¿Estás seguro de que deseas salir del sistema?',
      'Sí, salir'
    );
    if (isConfirmed) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        <Landmark size={28} />
        <span>ATM Premium</span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
          <User size={20} />
          {user?.name}
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: '#fee2e2', color: '#ef4444' }}>
          <LogOut size={18} />
          Salir
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
