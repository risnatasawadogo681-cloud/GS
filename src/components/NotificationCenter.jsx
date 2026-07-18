import React from 'react';
import { Bell, X, Info, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';

export function ToastContainer({ toasts = [], onCloseToast }) {
  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '350px',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        const icons = {
          info: <Info size={18} className="text-info" style={{ color: 'var(--status-info)' }} />,
          success: <CheckCircle size={18} style={{ color: 'var(--status-success)' }} />,
          warning: <AlertTriangle size={18} style={{ color: 'var(--status-warning)' }} />,
          message: <MessageSquare size={18} style={{ color: 'var(--accent-purple)' }} />
        };

        return (
          <div
            key={toast.id}
            className="glass-panel"
            style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              pointerEvents: 'auto',
              borderLeft: `4px solid ${
                toast.type === 'success' ? 'var(--status-success)' :
                toast.type === 'warning' ? 'var(--status-warning)' :
                toast.type === 'message' ? 'var(--accent-purple)' : 'var(--status-info)'
              }`,
              animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              borderRadius: '8px'
            }}
          >
            <div style={{ marginTop: '2px' }}>{icons[toast.type] || icons.info}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => onCloseToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function NotificationCenter({ notifications = [], onClearAll, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '400px', right: '20px', position: 'absolute', top: '70px', margin: 0, height: '500px', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
            <Bell size={18} style={{ color: 'var(--accent-purple)' }} /> Notifications
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
          {notifications.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Aucune notification récente.
            </div>
          ) : (
            notifications.map((notif, idx) => (
              <div 
                key={idx} 
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{notif.title}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{notif.time || "À l'instant"}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>{notif.message}</div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <button 
            onClick={onClearAll} 
            className="btn-secondary" 
            style={{ width: '100%', marginTop: '12px', fontSize: '0.8rem', padding: '8px' }}
          >
            Tout effacer
          </button>
        )}
      </div>
    </div>
  );
}
