import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
// @ts-ignore
import InventoryIcon from '@mui/icons-material/Inventory';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { COLORS } from '../context/theme';

const tiendaRepository = new TiendaRepository();

export const NotificacionesPage: React.FC = () => {
  const [alertas, setAlertas] = useState<{nombre: string, stock: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStock = async () => {
      try {
        const productos = await tiendaRepository.getProductos();
        const bajos = productos.filter(p => p.stock_actual < 5);
        setAlertas(bajos.map(p => ({ nombre: p.nombre, stock: p.stock_actual })));
      } catch (error) {
        console.error('Error cargando notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    checkStock();
  }, []);

  return (
    <Box className="fade-in">
      <Header
        title="Notificaciones"
        onBack={() => navigate(-1)}
        settingsHref="/ajustes"
        notificacionesHref="/notificaciones"
        notificacionesCount={alertas.length}
      />

      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pb: 10 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: COLORS.primary }} />
          </Box>
        ) : alertas.length === 0 ? (
          /* Estado vacío elegante */
          <Box sx={{ textAlign: 'center', mt: 8, px: 2 }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2.5,
              background: 'rgba(212,163,115,0.12)',
              border: '1px solid rgba(212,163,115,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <NotificationsNoneIcon sx={{ fontSize: 36, color: COLORS.secondary }} />
            </Box>
            <Typography sx={{
              fontSize: 19, fontWeight: 700, color: COLORS.ink,
              fontFamily: "'Quicksand', 'Inter', sans-serif",
              letterSpacing: '-0.2px', mb: 0.75,
            }}>
              Todo bajo control
            </Typography>
            <Typography sx={{ color: COLORS.inkTertiary, fontSize: 14, lineHeight: 1.55 }}>
              No hay alertas de stock en este momento.
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Cabecera de sección */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'rgba(186,26,26,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <InventoryIcon sx={{ fontSize: 20, color: COLORS.error }} />
              </Box>
              <Box>
                <Typography sx={{
                  fontSize: 16, fontWeight: 700, color: COLORS.ink,
                  fontFamily: "'Quicksand', 'Inter', sans-serif",
                }}>
                  Productos con Stock Bajo
                </Typography>
                <Typography sx={{ fontSize: 12, color: COLORS.inkTertiary }}>
                  {alertas.length} producto{alertas.length !== 1 ? 's' : ''} requiere{alertas.length === 1 ? '' : 'n'} reposición
                </Typography>
              </Box>
            </Box>

            {/* Lista de alertas */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {alertas.map((p, i) => (
                <Paper
                  key={p.nombre}
                  elevation={0}
                  className="card"
                  sx={{
                    p: 0,
                    overflow: 'hidden',
                    animationDelay: `${i * 0.06}s`,
                  }}
                >
                  <Box sx={{
                    px: 2, py: 1.5,
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    borderLeft: `3px solid ${COLORS.error}`,
                  }}>
                    {/* Ícono */}
                    <Box sx={{
                      width: 38, height: 38, borderRadius: '10px',
                      background: 'rgba(186,26,26,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span className="material-symbols-outlined fill" style={{ fontSize: 20, color: COLORS.error }}>
                        warning
                      </span>
                    </Box>

                    {/* Información */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLORS.ink, mb: 0.25 }} noWrap>
                        {p.nombre}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: COLORS.inkTertiary }}>
                        Reponer inventario pronto
                      </Typography>
                    </Box>

                    {/* Badge de stock */}
                    <Chip
                      label={p.stock === 0 ? 'Sin stock' : `${p.stock} ud.`}
                      size="small"
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        background: p.stock === 0 ? 'rgba(186,26,26,0.12)' : 'rgba(186,26,26,0.08)',
                        color: COLORS.error,
                        border: `1px solid ${COLORS.error}33`,
                        height: 26,
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
