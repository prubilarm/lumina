import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Clock } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Ahora';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="notif-icon-success" />;
      case 'error': return <AlertCircle size={16} className="notif-icon-error" />;
      default: return <Info size={16} className="notif-icon-info" />;
    }
  };

  return (
    <div className="notif-container" ref={dropdownRef}>
      <button 
        className={`notif-bell-btn ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h3>Notificaciones</h3>
            <div className="notif-actions">
              <button onClick={markAllAsRead} disabled={unreadCount === 0}>Marcar todo como leído</button>
              <button onClick={clearNotifications} className="clear-btn"><Trash2 size={14} /></button>
            </div>
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={40} strokeWidth={1} />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`notif-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notif-icon">
                    {getIcon(notif.type)}
                  </div>
                  <div className="notif-content">
                    <p className="notif-title">{notif.title}</p>
                    <p className="notif-message">{notif.message}</p>
                    <span className="notif-time">
                      <Clock size={10} /> {formatTime(notif.timestamp)}
                    </span>
                  </div>
                  {!notif.read && <div className="unread-dot" />}
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="notif-footer">
              Ver todas las notificaciones
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
