import React from 'react';
import { Box, Grid } from '@mui/material';
import { Header } from '../components/Header';
import { Card } from '../components/Card';

export const TiendaMenuPage: React.FC = () => {
  return (
    <Box className="fade-in">
      <Header title="Tienda de Abarrotes" backHref="/" />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card to="/tienda-abarrotes/catalogo" icon="menu_book" iconBgColor="#8C261F" iconColor="#fff" title="Catálogo" subtitle="Ver productos" ctaText="Ver" ctaColor="#8C261F" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card to="/tienda-abarrotes/ventas" icon="shopping_cart" iconBgColor="#8C261F" iconColor="#fff" title="Ventas" subtitle="Nueva venta" ctaText="Vender" ctaColor="#8C261F" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card to="/tienda-abarrotes/inventario" icon="inventory" iconBgColor="#8C261F" iconColor="#fff" title="Inventario" subtitle="Gestionar stock" ctaText="Editar" ctaColor="#8C261F" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card to="/tienda-abarrotes/agregar" icon="add_circle" iconBgColor="#8C261F" iconColor="#fff" title="Agregar Producto" subtitle="Nuevo artículo" ctaText="Añadir" ctaColor="#8C261F" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card to="/tienda-abarrotes/historial" icon="history" iconBgColor="#8C261F" iconColor="#fff" title="Historial" subtitle="Ventas realizadas" ctaText="Ver" ctaColor="#8C261F" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
