import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, CircularProgress, Divider, Tooltip,
} from '@mui/material';
// @ts-ignore
import EditIcon from '@mui/icons-material/Edit';
// @ts-ignore
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Header } from '../components/Header';
import { EmptyState } from '../components/FeedbackUI';
import { useToast } from '../context/ToastContext';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import type { TicketTaller, EstadoTicket } from '../../domain/entities/taller';

const tallerRepository = new TallerRepository();
const tallerUseCases   = new TallerUseCases(tallerRepository);
const tiendaRepository = new TiendaRepository();

// Flujo ordenado de estados (Abandonado es opcional/lateral)
const FLUJO_ESTADOS: EstadoTicket[] = ['Recibido', 'En Proceso', 'Terminado', 'Entregado'];
const ESTADO_ABANDONADO: EstadoTicket = 'Abandonado';

const STATUS_STYLE: Record<EstadoTicket, { bg: string; color: string; border: string; emoji: string }> = {
  'Recibido':   { bg: '#FFF3E0', color: '#E65100', border: '#E6510033', emoji: '📥' },
  'En Proceso': { bg: '#E3F2FD', color: '#1565C0', border: '#1565C033', emoji: '⚙️' },
  'Terminado':  { bg: '#E8F5E9', color: '#2E7D32', border: '#2E7D3233', emoji: '✅' },
  'Entregado':  { bg: '#EDE7F6', color: '#4527A0', border: '#4527A033', emoji: '🎁' },
  'Abandonado': { bg: '#F5F5F5', color: '#616161', border: '#61616133', emoji: '🚫' },
};

// Fila de información con label y valor
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 0.75 }}>
    <Typography sx={{ fontSize: 13, color: '#57423f', fontWeight: 600, minWidth: 120 }}>{label}</Typography>
    <Typography sx={{ fontSize: 14, color: '#202020', textAlign: 'right', flex: 1 }}>{value}</Typography>
  </Box>
);

// ── Stepper visual de estados ──────────────────────────────────────────────
const EstadoStepper = ({
  estadoActual,
  saving,
  onCambiar,
}: {
  estadoActual: EstadoTicket;
  saving: boolean;
  onCambiar: (e: EstadoTicket) => void;
}) => {
  const idxActual = FLUJO_ESTADOS.indexOf(estadoActual);
  const esAbandonado = estadoActual === ESTADO_ABANDONADO;

  return (
    <Box>
      {/* Flujo principal: Recibido → En Proceso → Terminado → Entregado */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          pb: 0.5,
        }}
      >
        {FLUJO_ESTADOS.map((e, idx) => {
          const s = STATUS_STYLE[e];
          const activo   = estadoActual === e;
          const completado = !esAbandonado && idxActual > idx;
          const futuro   = !activo && !completado;

          return (
            <React.Fragment key={e}>
              {/* Nodo del estado */}
              <Tooltip title={activo ? 'Estado actual' : `Cambiar a "${e}"`} arrow>
                <Box
                  component="button"
                  onClick={() => !saving && !activo && onCambiar(e)}
                  disabled={saving || activo}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    border: 'none',
                    background: 'none',
                    cursor: activo ? 'default' : saving ? 'not-allowed' : 'pointer',
                    p: 0,
                    flexShrink: 0,
                    transition: 'opacity 0.18s',
                    opacity: saving && !activo ? 0.5 : 1,
                    '&:focus-visible': { outline: `2px solid ${s.color}`, borderRadius: 2 },
                  }}
                >
                  {/* Círculo del paso */}
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: activo ? s.color : completado ? s.bg : '#F5F5F5',
                      border: `2.5px solid ${activo ? s.color : completado ? s.color : '#E0E0E0'}`,
                      transition: 'all 0.22s ease',
                      boxShadow: activo ? `0 0 0 4px ${s.color}22` : 'none',
                      position: 'relative',
                    }}
                  >
                    {saving && activo ? (
                      <CircularProgress size={18} sx={{ color: '#fff' }} />
                    ) : completado ? (
                      <CheckCircleIcon sx={{ fontSize: 22, color: s.color }} />
                    ) : (
                      <Typography sx={{ fontSize: 18, lineHeight: 1 }}>{s.emoji}</Typography>
                    )}
                  </Box>

                  {/* Etiqueta */}
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: activo ? 800 : 500,
                      color: activo ? s.color : completado ? s.color : '#9E9E9E',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      letterSpacing: activo ? '0.02em' : 0,
                      maxWidth: 64,
                      lineHeight: 1.2,
                    }}
                  >
                    {e}
                  </Typography>
                </Box>
              </Tooltip>

              {/* Conector entre pasos */}
              {idx < FLUJO_ESTADOS.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    minWidth: 16,
                    borderRadius: 9999,
                    background: completado || (activo && idx < FLUJO_ESTADOS.length - 1)
                      ? STATUS_STYLE[FLUJO_ESTADOS[idx]].color
                      : '#E0E0E0',
                    mx: 0.5,
                    transition: 'background 0.3s ease',
                    alignSelf: 'flex-start',
                    mt: '20px',   // centrar respecto al círculo de 44px
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* ── Estado Abandonado ── separado abajo */}
      <Box sx={{ mt: 2 }}>
        <Tooltip
          title={esAbandonado ? 'Estado actual' : 'Marcar como Abandonado'}
          arrow
        >
          <Box
            component="button"
            onClick={() => !saving && !esAbandonado && onCambiar(ESTADO_ABANDONADO)}
            disabled={saving || esAbandonado}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              border: `1.5px dashed ${esAbandonado ? STATUS_STYLE.Abandonado.color : '#BDBDBD'}`,
              borderRadius: 9999,
              px: 2,
              py: 0.75,
              background: esAbandonado ? STATUS_STYLE.Abandonado.bg : 'transparent',
              color: esAbandonado ? STATUS_STYLE.Abandonado.color : '#9E9E9E',
              fontWeight: 700,
              fontSize: 13,
              cursor: esAbandonado ? 'default' : saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              opacity: saving && !esAbandonado ? 0.5 : 1,
              '&:hover:not(:disabled)': {
                background: STATUS_STYLE.Abandonado.bg,
                color: STATUS_STYLE.Abandonado.color,
                borderColor: STATUS_STYLE.Abandonado.color,
              },
              '&:focus-visible': { outline: '2px solid #616161', borderRadius: 9999 },
            }}
          >
            {saving && esAbandonado
              ? <CircularProgress size={14} sx={{ color: '#616161' }} />
              : <Typography sx={{ fontSize: 16 }}>🚫</Typography>
            }
            Abandonado
          </Box>
        </Tooltip>
      </Box>

      <Typography sx={{ fontSize: 12, color: '#9E9E9E', mt: 1.5, lineHeight: 1.5 }}>
        Toca un estado para actualizar sin salir de esta pantalla.
      </Typography>
    </Box>
  );
};

// ── Página principal ──────────────────────────────────────────────────────
export const DetalleServicioPage: React.FC = () => {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [ticket, setTicket]               = useState<TicketTaller | null>(null);
  const [loading, setLoading]             = useState(true);
  const [savingEstado, setSavingEstado]   = useState(false);
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    tiendaRepository.getProductos().then(productos => {
      setNotificacionesCount(productos.filter(p => p.stock_actual < 5).length);
    });
    if (id) {
      tallerUseCases.getTicketById(id).then(data => {
        setTicket(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleCambiarEstado = async (nuevoEstado: EstadoTicket) => {
    if (!id || !ticket || ticket.estado === nuevoEstado) return;
    setSavingEstado(true);
    try {
      await tallerUseCases.actualizarEstadoTicket(id, nuevoEstado);
      setTicket(prev => prev ? { ...prev, estado: nuevoEstado } : prev);
      showToast(`Estado actualizado: ${nuevoEstado}`, 'success');
    } catch (error) {
      showToast('Error al actualizar el estado.', 'error');
      console.error('[DetalleServicioPage] handleCambiarEstado:', error);
    } finally {
      setSavingEstado(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#8C261F' }} />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <EmptyState
        icon="🔍"
        title="Servicio no encontrado"
        subtitle="El ticket que buscas no existe o fue eliminado."
        actionLabel="Volver al registro"
        onAction={() => navigate('/talabarteria/registro-servicios')}
      />
    );
  }

  const estadoStyle = STATUS_STYLE[ticket.estado];
  const restante    = ticket.costo_total - ticket.anticipo;
  const fechaTexto  = ticket.fecha_ingreso
    ? new Date(ticket.fecha_ingreso).toLocaleDateString('es-MX', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : '—';

  return (
    <Box className="fade-in">
      <Header
        title="Detalle del Servicio"
        onBack={() => navigate(-1)}
        settingsHref="/ajustes"
        notificacionesHref="/notificaciones"
        notificacionesCount={notificacionesCount}
      />

      <Box sx={{ maxWidth: 640, mx: 'auto', p: 2, pb: 12 }}>

        {/* ── Encabezado del ticket ── */}
        <Paper className="card" elevation={0} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#202020', lineHeight: 1.2 }}>
                {ticket.producto}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#57423f', mt: 0.5 }}>
                Ticket #{ticket.id_servicio} · {fechaTexto}
              </Typography>
            </Box>
            {/* Badge de estado actual */}
            <Box sx={{
              background: estadoStyle.bg,
              color: estadoStyle.color,
              border: `1.5px solid ${estadoStyle.border}`,
              borderRadius: 9999,
              px: 1.5, py: 0.5,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              ml: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}>
              <span style={{ fontSize: 14 }}>{estadoStyle.emoji}</span>
              {ticket.estado}
            </Box>
          </Box>

          <Divider sx={{ my: 1.5, borderColor: '#D4A37322' }} />

          {/* ── Datos del cliente ── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#D4A373', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
            Cliente
          </Typography>
          <InfoRow label="Nombre"   value={ticket.nombre_cliente} />
          <InfoRow label="Teléfono" value={ticket.telefono || 'No proporcionado'} />

          <Divider sx={{ my: 1.5, borderColor: '#D4A37322' }} />

          {/* ── Descripción del servicio ── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#D4A373', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
            Servicio
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#202020', lineHeight: 1.6 }}>
            {ticket.servicio_solicitado}
          </Typography>

          <Divider sx={{ my: 1.5, borderColor: '#D4A37322' }} />

          {/* ── Costos ── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#D4A373', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
            Costos
          </Typography>
          <Box sx={{ background: '#FEF9F0', borderRadius: 2, p: 2 }}>
            <InfoRow label="Mano de obra"  value={`$${ticket.costo_mano_obra.toFixed(2)}`} />
            <InfoRow label="Materiales"    value={`$${ticket.costo_materiales.toFixed(2)}`} />
            <Divider sx={{ my: 0.75, borderColor: '#D4A37333' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, color: '#202020' }}>Total</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 15, color: '#8C261F' }}>
                ${ticket.costo_total.toFixed(2)}
              </Typography>
            </Box>
            <InfoRow label="Anticipo"  value={`$${ticket.anticipo.toFixed(2)}`} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: restante > 0 ? '#ba1a1a' : '#2E7D32' }}>
                Restante
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: restante > 0 ? '#ba1a1a' : '#2E7D32' }}>
                ${restante.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ── Stepper dinámico de estado ── */}
        <Paper className="card" elevation={0} sx={{ p: 3, mb: 2 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#D4A373', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 2 }}>
            Actualizar Estado
          </Typography>
          <EstadoStepper
            estadoActual={ticket.estado}
            saving={savingEstado}
            onCambiar={handleCambiarEstado}
          />
        </Paper>

        {/* ── Botón editar datos ── */}
        <Button
          onClick={() => navigate(`/talabarteria/editar/${ticket.id_servicio}`)}
          startIcon={<EditIcon />}
          fullWidth
          sx={{
            borderRadius: 9999,
            py: 1.5,
            fontWeight: 700,
            fontSize: 14,
            border: '1.5px solid #D4A37366',
            color: '#57423f',
            background: 'transparent',
            '&:hover': { background: '#FEF9F0', borderColor: '#D4A373' },
            minHeight: 48,
          }}
          aria-label="Editar todos los datos del servicio"
        >
          Editar datos del servicio
        </Button>

      </Box>
    </Box>
  );
};
