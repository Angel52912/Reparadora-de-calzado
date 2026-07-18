import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import { COLORS } from '../context/theme';
import type { Producto } from '../../domain/entities/tienda';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

export const CatalogoPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    tiendaUseCases.getProductos().then(data => {
      setProductos(data);
      const lowStock = data.filter(p => p.stock_actual < 5).length;
      setNotificacionesCount(lowStock);
      setLoading(false);
    });
  }, []);

  return (
    <Box className="fade-in">
      <Header 
        title="Catálogo" 
        onBack={() => navigate(-1)} 
        settingsHref="/ajustes" 
        notificacionesHref="/notificaciones" 
        notificacionesCount={notificacionesCount}
      />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pb: 10 }}>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2}>
            {productos.map(p => (
              <Grid item xs={12} sm={6} key={p.id_producto}>
                {/* Aplicando estilo .card del css legacy mediante className */}
                <Box className="card" sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: COLORS.ink }}>{p.nombre}</Typography>
                    <Typography sx={{ fontSize: '14px', color: COLORS.inkSecondary }}>Stock: {p.stock_actual}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: COLORS.primary, fontSize: '18px' }}>
                    ${Number(p.precio_venta).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
