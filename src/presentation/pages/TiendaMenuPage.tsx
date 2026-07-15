import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';

const tiendaRepository = new TiendaRepository();

export const TiendaMenuPage: React.FC = () => {
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    tiendaRepository.getProductos().then(prods => {
      const bajos = prods.filter(p => p.stock_actual < 5);
      setNotificacionesCount(bajos.length);
    });
  }, []);

  return (
    <Box className="fade-in">
      <Header 
        title="Tienda de Abarrotes" 
        backHref="/" 
        settingsHref="/ajustes" 
        notificacionesHref="/notificaciones"
        notificacionesCount={notificacionesCount}
      />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card to="/tienda-abarrotes/catalogo" icon="menu_book" iconBgColor="#8C261F" iconColor="#fff" title="Catálogo" subtitle="Ver productos" ctaText="Ver" ctaColor="#8C261F" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card to="/tienda-abarrotes/ventas" icon="shopping_cart" iconBgColor="#8C261F" iconColor="#fff" title="Ventas" subtitle="Nueva venta" ctaText="Vender" ctaColor="#8C261F" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card to="/tienda-abarrotes/inventario" icon="inventory" iconBgColor="#8C261F" iconColor="#fff" title="Inventario" subtitle="Gestionar stock" ctaText="Editar" ctaColor="#8C261F" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card to="/tienda-abarrotes/agregar" icon="add_circle" iconBgColor="#8C261F" iconColor="#fff" title="Agregar Producto" subtitle="Nuevo artículo" ctaText="Añadir" ctaColor="#8C261F" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card to="/tienda-abarrotes/historial" icon="history" iconBgColor="#8C261F" iconColor="#fff" title="Historial" subtitle="Ventas realizadas" ctaText="Ver" ctaColor="#8C261F" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
