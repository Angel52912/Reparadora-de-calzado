import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';

const tiendaRepository = new TiendaRepository();

export const NotificacionesPage: React.FC = () => {
  const [alertas, setAlertas] = useState<{nombre: string, stock: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStock = async () => {
      try {
        const productos = await tiendaRepository.getProductos();
        // Consideramos stock bajo si hay menos de 5 unidades
        const bajos = productos.filter(p => p.stock_actual < 5);
        setAlertas(bajos);
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
      <Header title="Notificaciones" backHref="/" homeHref="/" />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pb: 10 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : alertas.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <NotificationsActiveIcon sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#57423f' }}>Todo bajo control</Typography>
            <Typography sx={{ color: '#999' }}>No hay alertas de stock en este momento.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ color: '#8C261F', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmberIcon /> Productos con Stock Bajo
            </Typography>
            {alertas.map(p => (
              <Paper key={p.nombre} className="card" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '5px solid #f44336' }}>
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>{p.nombre}</Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>Reponer inventario pronto</Typography>
                </Box>
                <Chip label={`Solo ${p.stock} unidades`} color="error" size="small" />
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
