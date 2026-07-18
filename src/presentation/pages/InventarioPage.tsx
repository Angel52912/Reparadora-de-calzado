import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box, Typography, Paper, IconButton,
  Checkbox, Tooltip, Collapse, Button, Fab
} from '@mui/material';
import { COLORS } from '../context/theme';
// @ts-ignore
import AddIcon from '@mui/icons-material/Add';
// @ts-ignore
import RemoveIcon from '@mui/icons-material/Remove';
// @ts-ignore
import DeleteIcon from '@mui/icons-material/Delete';
// @ts-ignore
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
// @ts-ignore
import EditIcon from '@mui/icons-material/Edit';
// @ts-ignore
import FilterListIcon from '@mui/icons-material/FilterList';
// @ts-ignore
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// @ts-ignore
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { SkeletonCard, EmptyState } from '../components/FeedbackUI';
import { useToast } from '../context/ToastContext';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import type { Producto } from '../../domain/entities/tienda';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

type EstadoStock = 'Con Stock' | 'Bajo Stock' | 'Sin Stock';
const ESTADOS_STOCK: EstadoStock[] = ['Con Stock', 'Bajo Stock', 'Sin Stock'];

const STATUS_STYLE: Record<EstadoStock, { bg: string; color: string }> = {
  'Con Stock':   { bg: COLORS.status.terminado.bg,  color: COLORS.status.terminado.color },
  'Bajo Stock':  { bg: COLORS.status.recibido.bg,   color: COLORS.status.recibido.color },
  'Sin Stock':   { bg: COLORS.status.enProceso.bg,  color: COLORS.status.enProceso.color },
};

// ── Dot de color ───────────────────────────────────────────────────────────
const Dot = ({ color, size = 7 }: { color: string; size?: number }) => (
  <Box component="span" sx={{
    display: 'inline-block', width: size, height: size,
    borderRadius: '50%', background: color, flexShrink: 0,
  }} />
);

// ── Chip de estado de stock en tarjeta ──────────────────────────────────────
const StockChip = ({ estado }: { estado: EstadoStock }) => {
  const s = STATUS_STYLE[estado];
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: 1, py: 0.25,
      borderRadius: 9999,
      background: s.bg,
      border: `1px solid ${s.color}30`,
    }}>
      <Dot color={s.color} />
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: s.color, whiteSpace: 'nowrap' }}>
        {estado}
      </Typography>
    </Box>
  );
};

// ── Selector de filtro tipo pill ──────────────────────────────────────────
const FiltroSelector = ({
  value, productos, onChange,
}: {
  value: EstadoStock | 'Todos';
  productos: Producto[];
  onChange: (v: EstadoStock | 'Todos') => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const color = value === 'Todos' ? COLORS.primary : STATUS_STYLE[value].color;

  const getCount = (val: EstadoStock | 'Todos') => {
    if (val === 'Todos') return productos.length;
    if (val === 'Con Stock') return productos.filter(p => p.stock_actual >= 5).length;
    if (val === 'Bajo Stock') return productos.filter(p => p.stock_actual > 0 && p.stock_actual < 5).length;
    return productos.filter(p => p.stock_actual === 0).length;
  };

  const count = getCount(value);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const opciones: (EstadoStock | 'Todos')[] = ['Todos', ...ESTADOS_STOCK];

  return (
    <Box ref={ref} sx={{ position: 'relative' }}>
      {/* Pill del filtro activo */}
      <Box
        onClick={() => setOpen(o => !o)}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.75,
          px: 1.25, py: 0.5,
          borderRadius: 9999,
          border: `1px solid ${color}40`,
          background: value === 'Todos' ? COLORS.primarySubtle : STATUS_STYLE[value as EstadoStock].bg,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.15s ease',
          '&:hover': { borderColor: color },
        }}
      >
        <FilterListIcon sx={{ fontSize: 13, color, opacity: 0.8 }} />
        <Dot color={color} />
        <Typography sx={{ fontSize: 12, fontWeight: 700, color }}>
          {value === 'Todos' ? 'Todos' : value}
        </Typography>
        <Typography sx={{ fontSize: 11, color: `${color}99`, fontWeight: 500 }}>
          ({count})
        </Typography>
        <Box component="span" sx={{
          fontSize: 10, color, ml: 0.25, lineHeight: 1,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.18s ease',
          display: 'inline-block',
        }}>▾</Box>
      </Box>

      {/* Dropdown compacto */}
      {open && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            zIndex: 1300, minWidth: 160,
            borderRadius: 2, overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
            py: 0.5,
          }}
        >
          {opciones.map(op => {
            const c = op === 'Todos' ? COLORS.primary : STATUS_STYLE[op].color;
            const bg = op === 'Todos' ? COLORS.primarySubtle : STATUS_STYLE[op].bg;
            const n = getCount(op);
            const activo = value === op;
            return (
              <Box
                key={op}
                onClick={() => { onChange(op); setOpen(false); }}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 1.5, py: 0.625,
                  cursor: 'pointer',
                  background: activo ? bg : 'transparent',
                  '&:hover': { background: bg },
                  transition: 'background 0.12s',
                }}
              >
                <Dot color={c} />
                <Typography sx={{ fontSize: 12, fontWeight: activo ? 700 : 500, color: activo ? c : COLORS.inkSecondary, flex: 1 }}>
                  {op}
                </Typography>
                <Typography sx={{ fontSize: 11, color: `${c}99`, fontWeight: 600 }}>
                  {n}
                </Typography>
              </Box>
            );
          })}
        </Paper>
      )}
    </Box>
  );
};

// ── Página principal de Inventario ──────────────────────────────────────────
export const InventarioPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [cambios, setCambios] = useState<Record<number, number>>({});
  
  const [filtroEstado, setFiltroEstado] = useState<EstadoStock | 'Todos'>('Todos');
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());

  const navigate = useNavigate();
  const { showToast } = useToast();

  const cargarProductos = () => {
    setLoading(true);
    tiendaUseCases.getProductos().then(data => {
      setProductos(data);
      const lowStock = data.filter(p => p.stock_actual < 5).length;
      setNotificacionesCount(lowStock);
      setLoading(false);
    });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const getEstadoProducto = (p: Producto): EstadoStock => {
    if (p.stock_actual === 0) return 'Sin Stock';
    if (p.stock_actual < 5) return 'Bajo Stock';
    return 'Con Stock';
  };

  const productosFiltrados = useMemo(() => {
    if (filtroEstado === 'Todos') return productos;
    return productos.filter(p => getEstadoProducto(p) === filtroEstado);
  }, [productos, filtroEstado]);

  const updateStockLocal = (id: number, delta: number) => {
    setProductos(prev => prev.map(p => {
      if (p.id_producto === id) {
        const nuevoStock = Math.max(0, p.stock_actual + delta);
        setCambios(c => ({ ...c, [id]: nuevoStock }));
        return { ...p, stock_actual: nuevoStock };
      }
      return p;
    }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto del inventario?')) {
      try {
        await tiendaUseCases.eliminarProducto(id);
        setProductos(prev => prev.filter(p => p.id_producto !== id));
        showToast('Producto eliminado del inventario.', 'success');
      } catch (error) {
        showToast('Error al eliminar el producto. Intenta de nuevo.', 'error');
      }
    }
  };

  const guardarCambios = async () => {
    try {
      for (const [id, nuevoStock] of Object.entries(cambios)) {
        await tiendaRepository.updateStock(Number(id), nuevoStock);
      }
      setCambios({});
      showToast('Stock actualizado con éxito ✓', 'success');
    } catch (error) {
      showToast('Error al guardar cambios. Intenta de nuevo.', 'error');
    }
  };

  const toggleSeleccion = (id: number) => {
    setSeleccionados(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activarModoSeleccion = () => { setModoSeleccion(true); setSeleccionados(new Set()); };
  const cancelarSeleccion    = () => { setModoSeleccion(false); setSeleccionados(new Set()); };

  const eliminarSeleccionados = async () => {
    if (seleccionados.size === 0) return;
    const plural = seleccionados.size > 1 ? 'los productos seleccionados' : 'el producto seleccionado';
    if (!window.confirm(`¿Eliminar ${plural}? Esta acción no se puede deshacer.`)) return;
    try {
      await Promise.all([...seleccionados].map(id => tiendaUseCases.eliminarProducto(id)));
      setProductos(prev => prev.filter(p => !seleccionados.has(p.id_producto)));
      showToast(`${seleccionados.size} producto(s) eliminado(s).`, 'success');
      cancelarSeleccion();
    } catch {
      showToast('Error al eliminar. Intenta de nuevo.', 'error');
    }
  };

  return (
    <Box className="fade-in">
      <Header 
        title="Tienda de Abarrotes" 
        backHref="/"
         
        notificacionesHref="/notificaciones" 
        notificacionesCount={notificacionesCount}
      />
      <Box sx={{ maxWidth: 768, mx: 'auto', px: 2, pt: 1.5, pb: 12 }}>
        
        {/* ── Barra compacta: filtro + basura ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <FiltroSelector
            value={filtroEstado}
            productos={productos}
            onChange={setFiltroEstado}
          />

          {/* Acciones de selección */}
          <Collapse in={modoSeleccion} orientation="horizontal">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: COLORS.inkSecondary, px: 0.5 }}>
                {seleccionados.size} sel.
              </Typography>
              <Tooltip title="Cancelar">
                <IconButton size="small" onClick={cancelarSeleccion} sx={{ color: COLORS.inkTertiary }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </IconButton>
              </Tooltip>
            </Box>
          </Collapse>

          {/* Botón de papelera */}
          <Tooltip title={modoSeleccion
            ? seleccionados.size > 0 ? `Eliminar ${seleccionados.size}` : 'Selecciona elementos'
            : 'Seleccionar para eliminar'
          }>
            <span>
              <IconButton
                size="small"
                onClick={modoSeleccion ? (seleccionados.size > 0 ? eliminarSeleccionados : undefined) : activarModoSeleccion}
                sx={{
                  color: modoSeleccion && seleccionados.size > 0 ? COLORS.error : COLORS.inkSecondary,
                  opacity: modoSeleccion && seleccionados.size === 0 ? 0.4 : 1,
                  border: '1px solid',
                  borderColor: modoSeleccion && seleccionados.size > 0 ? `${COLORS.error}33` : COLORS.border,
                  borderRadius: 1.5,
                  p: 0.5,
                  transition: 'all 0.18s ease',
                }}
              >
                {modoSeleccion
                  ? <DeleteIcon sx={{ fontSize: 18 }} />
                  : <DeleteSweepIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* ── Lista ── */}
        {loading ? (
          <SkeletonCard />
        ) : productosFiltrados.length === 0 ? (
          <EmptyState
            icon="📦"
            title={filtroEstado === 'Todos' ? 'No hay productos en el inventario' : `Sin productos "${filtroEstado}"`}
            subtitle={filtroEstado === 'Todos' ? 'Agrega un producto desde el menú de la Tienda.' : 'Prueba otro filtro.'}
            actionLabel={filtroEstado !== 'Todos' ? 'Ver todos' : undefined}
            onAction={filtroEstado !== 'Todos' ? () => setFiltroEstado('Todos') : undefined}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {productosFiltrados.map(p => {
              const seleccionado = seleccionados.has(p.id_producto);
              const est = getEstadoProducto(p);
              const s = STATUS_STYLE[est];
              return (
                <Paper
                  key={p.id_producto}
                  className="card"
                  elevation={0}
                  sx={{
                    p: 0,
                    outline: seleccionado ? `2px solid ${COLORS.primary}` : 'none',
                    transition: 'outline 0.12s ease, box-shadow 0.12s ease',
                  }}
                >
                  <Box
                    onClick={() =>
                      modoSeleccion
                        ? toggleSeleccion(p.id_producto)
                        : navigate(`/tienda-abarrotes/editar/${p.id_producto}`)
                    }
                    sx={{
                      px: 1.5, py: 1.25,
                      display: 'flex', alignItems: 'center', gap: 1.25,
                      cursor: 'pointer', userSelect: 'none',
                    }}
                  >
                    {modoSeleccion && (
                      <Checkbox
                        checked={seleccionado}
                        size="small"
                        sx={{ p: 0, color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }}
                        onClick={e => { e.stopPropagation(); toggleSeleccion(p.id_producto); }}
                      />
                    )}

                    {/* Indicador de estado lateral */}
                    <Box sx={{
                      width: 3, alignSelf: 'stretch', borderRadius: 9999,
                      background: s.color, flexShrink: 0, minHeight: 32,
                    }} />

                    {/* Contenido */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: COLORS.ink, lineHeight: 1.4 }} noWrap>
                        {p.nombre}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography sx={{ fontSize: 13, color: COLORS.inkTertiary }}>
                          Precio: <Box component="span" sx={{ fontWeight: 600, color: COLORS.ink }}>${p.precio_venta.toFixed(2)}</Box>
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: COLORS.inkTertiary }}>
                          Stock: <Box component="span" sx={{ fontWeight: 600, color: p.stock_actual < 5 ? COLORS.error : COLORS.ink }}>{p.stock_actual} pzas.</Box>
                        </Typography>
                      </Box>
                    </Box>

                    {/* Acciones e Indicadores */}
                    {modoSeleccion && (
                      <StockChip estado={est} />
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>

      {/* FABs Action Group */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Fab color="primary" onClick={() => navigate('/tienda-abarrotes/historial')} sx={{ background: COLORS.secondary, color: COLORS.ink }}>
          <HistoryIcon />
        </Fab>
        <Fab color="primary" onClick={() => navigate('/tienda-abarrotes/ventas')} sx={{ background: COLORS.secondary, color: COLORS.ink }}>
          <ShoppingCartIcon />
        </Fab>
        <Fab color="primary" onClick={() => navigate('/tienda-abarrotes/agregar')} sx={{ background: COLORS.primary, color: '#fff' }}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};
