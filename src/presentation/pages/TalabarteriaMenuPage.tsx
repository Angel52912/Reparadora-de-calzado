import React from 'react';
import { Box, Grid } from '@mui/material';
import { Header } from '../components/Header';
import { Card } from '../components/Card';

export const TalabarteriaMenuPage: React.FC = () => {
  return (
    <Box className="fade-in">
      <Header title="Talabartería" backHref="/" />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card to="/talabarteria/nuevo" icon="add_circle" iconBgColor="#D4A373" iconColor="#2B2B2B" title="Nuevo Servicio" subtitle="Crear orden" ctaText="Registrar" ctaColor="#7d562d" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card to="/talabarteria/registro-servicios" icon="list_alt" iconBgColor="#D4A373" iconColor="#2B2B2B" title="Registro" subtitle="Servicios activos" ctaText="Ver" ctaColor="#7d562d" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
