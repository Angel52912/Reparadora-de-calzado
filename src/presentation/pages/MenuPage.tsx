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
import { COLORS } from '../context/theme';

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
        settingsHref="/ajustes"
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

        {/* ── Estadísticas ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
          }}
        >
          {/* Stat: Productos */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              textAlign: 'center',
              borderRadius: '16px',
              background: '#fff',
              border: '1px solid rgba(212,163,115,0.22)',
              boxShadow: '0 2px 8px rgba(36,25,23,0.06)',
              transition: 'all 0.22s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(36,25,23,0.10)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 30, sm: 34 },
                fontWeight: 800,
                color: COLORS.primary,
                letterSpacing: '-1px',
                lineHeight: 1.1,
                fontFamily: "'Quicksand', 'Inter', sans-serif",
              }}
            >
              {numSales !== null ? numSales : '—'}
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: COLORS.inkTertiary,
                mt: 0.5,
              }}
            >
              Productos en tienda
            </Typography>
          </Box>

          {/* Stat: Servicios activos */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              textAlign: 'center',
              borderRadius: '16px',
              background: '#fff',
              border: '1px solid rgba(212,163,115,0.22)',
              boxShadow: '0 2px 8px rgba(36,25,23,0.06)',
              transition: 'all 0.22s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(36,25,23,0.10)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 30, sm: 34 },
                fontWeight: 800,
                color: COLORS.secondary,
                letterSpacing: '-1px',
                lineHeight: 1.1,
                fontFamily: "'Quicksand', 'Inter', sans-serif",
              }}
            >
              {activeServices !== null ? activeServices : '—'}
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: COLORS.inkTertiary,
                mt: 0.5,
              }}
            >
              Servicios activos
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
