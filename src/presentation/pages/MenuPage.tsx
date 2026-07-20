import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { SkeletonCard, EmptyState } from '../components/FeedbackUI';
import { useToast } from '../context/ToastContext';
import { useSplash } from '../context/SplashContext';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { COLORS } from '../context/theme';

const tiendaRepository = new TiendaRepository();

export const MenuPage: React.FC = () => {
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { hideSplash } = useSplash();

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pt: 10 }}>
        <SkeletonCard />
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
        
        notificacionesHref="/notificaciones"
        notificacionesCount={notificacionesCount}
      />

      <Box
        className="fade-in"
        sx={{ maxWidth: 768, mx: 'auto', width: '100%', pb: 12, px: 2 }}
      >
        {/* ── Saludo / Hero ── */}
        <Box
          sx={{
            textAlign: 'center',
            py: 5,
            pb: 4,
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 26, sm: 30 },
              fontWeight: 800,
              color: COLORS.ink,
              letterSpacing: '-0.5px',
              fontFamily: "'Quicksand', 'Inter', sans-serif",
              mb: 0.75,
              lineHeight: 1.2,
            }}
          >
            Bienvenido de nuevo
          </Typography>
          <Typography
            sx={{
              color: COLORS.inkTertiary,
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            ¿A qué sistema desea ingresar?
          </Typography>
        </Box>

        {/* ── Tarjetas de módulos ── */}
        <Grid container spacing={2} sx={{ mb: 3 }} className="fade-in-stagger">
          <Grid item xs={12} sm={6}>
            <Card
              to="/talabarteria"
              icon="construction"
              iconBgColor="#C4973B"
              iconColor="#2B2B2B"
              title="Talabartería"
              subtitle="Órdenes & Artesanía"
              ctaText="Acceder"
              ctaColor="#7d562d"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              to="/tienda-abarrotes"
              icon="shopping_basket"
              iconBgColor="#8C261F"
              iconColor="#FFFFFF"
              title="Tienda de Abarrotes"
              subtitle="Inventario & Ventas"
              ctaText="Acceder"
              ctaColor="#8C261F"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
