import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { SkeletonCard, EmptyState } from '../components/FeedbackUI';
import { useToast } from '../context/ToastContext';
import { useSplash } from '../context/SplashContext';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';

const tiendaRepository = new TiendaRepository();
const tallerRepository = new TallerRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);
const tallerUseCases = new TallerUseCases(tallerRepository);

export const MenuPage: React.FC = () => {
  const [numSales, setNumSales] = useState<number | null>(null);
  const [activeServices, setActiveServices] = useState<number | null>(null);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { hideSplash } = useSplash();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sales = await tiendaUseCases.getProductos();
        setNumSales(sales.length);

        const services = await tallerUseCases.getTickets();
        const active = services.filter(s => s.estado !== 'Entregado').length;
        setActiveServices(active);

        const productos = await tiendaRepository.getProductos();
        const bajos = productos.filter(p => p.stock_actual < 5);
        setNotificacionesCount(bajos.length);
      } catch (err) {
        const msg = 'Error al cargar los datos. Verifica tu conexión.';
        setError(msg);
        showToast(msg, 'error');
        console.error('[MenuPage] fetchData error:', err);
      } finally {
        setLoading(false);
        hideSplash();
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pt: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
      </Box>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="No pudimos cargar los datos"
        subtitle={error}
      />
    );
  }

  return (
    <Box>
      <Header 
        title="" 
        settingsHref="/ajustes" 
        notificacionesHref="/notificaciones" 
        notificacionesCount={notificacionesCount}
      />
      <Box className="fade-in" sx={{ maxWidth: 768, mx: 'auto', width: '100%', pb: 28, px: 2 }}>
        <Box sx={{ textAlign: 'center', my: 5 }}>
          <Typography variant="h4" component="h2" sx={{ fontSize: 28, fontWeight: 'bold', color: '#241917', mb: 0.5 }}>
            Bienvenido de nuevo
          </Typography>
          <Typography variant="body1" sx={{ color: '#57423f', fontSize: 17 }}>
            ¿A qué sistema desea ingresar?
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ mb: 4 }} className="fade-in-stagger">
          <Grid item xs={12} sm={6}>
            <Card
              to="/talabarteria"
              icon="construction"
              iconBgColor="#D4A373"
              iconColor="#2B2B2B"
              title="Talabartería"
              subtitle="Órdenes & Artesanía"
              ctaText="Acceder ahora"
              ctaColor="#7d562d"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              to="/tienda-abarrotes"
              icon="shopping_basket"
              iconBgColor="#8C261F"
              iconColor="#FFFFFF"
              title="Tienda de abarrotes"
              subtitle="Inventario & Ventas"
              ctaText="Acceder ahora"
              ctaColor="#8C261F"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            }}>
              <Typography variant="h5" sx={{ fontSize: 24, fontWeight: 'bold', color: '#8C261F' }}>
                {numSales !== null ? numSales : '-'}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#57423f' }}>
                Ventas registradas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            }}>
              <Typography variant="h5" sx={{ fontSize: 24, fontWeight: 'bold', color: '#7d562d' }}>
                {activeServices !== null ? activeServices : '-'}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#57423f' }}>
                Servicios activos
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
