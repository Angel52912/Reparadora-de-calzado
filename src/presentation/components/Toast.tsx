import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const colors: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
  error:   { bg: '#fff1f2', border: '#ef4444', text: '#991b1b' },
  warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
  info:    { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const c = colors[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        color: c.text,
        borderRadius: 12,
        padding: '12px 20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
        fontFamily: "'Work Sans', sans-serif",
        fontWeight: 600,
        fontSize: 15,
        minWidth: 240,
        maxWidth: '90vw',
        animation: 'toastIn 0.28s cubic-bezier(.22,.68,0,1.2)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{icons[type]}</span>
      <span style={{ flex: 1, whiteSpace: 'normal' }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Cerrar notificación"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: c.text,
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
          marginLeft: 4,
          minWidth: 24,
          minHeight: 24,
        }}
      >
        ×
      </button>
    </div>
  );
};
