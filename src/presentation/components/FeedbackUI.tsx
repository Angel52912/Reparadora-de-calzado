import React from 'react';

interface SkeletonCardProps {
  lines?: number;
}

// ── Keyframes de la animación de carga ────────────────────────────────────
const LOADER_STYLE_ID = 'sk-loader-kf';
if (typeof document !== 'undefined' && !document.getElementById(LOADER_STYLE_ID)) {
  const s = document.createElement('style');
  s.id = LOADER_STYLE_ID;
  s.textContent = `
    @keyframes sk-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
    @keyframes sk-pulse-ring {
      0%   { transform: scale(0.88); box-shadow: 0 0 0 0 rgba(140,38,31,0.4); }
      70%  { transform: scale(1);    box-shadow: 0 0 0 16px rgba(140,38,31,0); }
      100% { transform: scale(0.88); box-shadow: 0 0 0 0 rgba(140,38,31,0);   }
    }
  `;
  document.head.appendChild(s);
}

/** Vista de carga: un único elemento centrado con ícono pulsante y texto. */
export const SkeletonCard: React.FC<SkeletonCardProps> = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      padding: '60px 24px',
      animation: 'sk-fade-in 0.3s ease both',
    }}
  >
    <div
      style={{
        width: 58, height: 58,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8C261F 0%, #C0522A 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'sk-pulse-ring 1.6s ease-out infinite',
      }}
    >
      <span
        className="material-symbols-outlined fill"
        style={{ fontSize: 27, color: '#fff', userSelect: 'none' }}
      >
        handyman
      </span>
    </div>
    <p
      style={{
        margin: 0,
        fontFamily: "'Work Sans', system-ui, sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: '#9a7b6f',
        letterSpacing: '0.04em',
        animation: 'sk-fade-in 0.4s ease 0.15s both',
      }}
    >
      Cargando servicios…
    </p>
  </div>
);

/** Empty state amigable cuando no hay datos */
interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      gap: 12,
      animation: 'fadeIn .25s ease',
    }}
  >
    <span style={{ fontSize: 56 }}>{icon}</span>
    <p
      style={{
        fontFamily: "'Work Sans', sans-serif",
        fontWeight: 700,
        fontSize: 18,
        color: '#2B2B2B',
        margin: 0,
      }}
    >
      {title}
    </p>
    {subtitle && (
      <p
        style={{
          fontFamily: "'Work Sans', sans-serif",
          fontSize: 14,
          color: '#57423f',
          margin: 0,
          maxWidth: 280,
        }}
      >
        {subtitle}
      </p>
    )}
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="btn-primary"
        style={{
          marginTop: 8,
          padding: '10px 28px',
          fontSize: 15,
          cursor: 'pointer',
          border: 'none',
          background: '#8C261F',
          color: '#fff',
          borderRadius: 9999,
          fontWeight: 600,
          fontFamily: "'Work Sans', sans-serif",
          minHeight: 44,
          minWidth: 44,
        }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);
