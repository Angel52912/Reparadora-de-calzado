import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Grid } from '@mui/material';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import type { Producto } from '../../domain/entities/tienda';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

export const VentasPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<{producto: Producto, cantidad: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await tiendaUseCases.getProductos();
      setProductos(data);
      const bajos = data.filter(p => p.stock_actual < 5);
      setNotificacionesCount(bajos.length);
      setLoading(false);
    };
    fetchData();
  }, []);

  const addToCart = (producto: Producto) => {
    setCarrito(prev => {
      const existing = prev.find(item => item.producto.id_producto === producto.id_producto);
      
      // Si ya existe en el carrito
      if (existing) {
        if (existing.cantidad < producto.stock_actual) {
          return prev.map(item => item.producto.id_producto === producto.id_producto 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
          );
        }
        // Si ya alcanzó el stock, no hacemos nada más que avisar
        return prev;
      }
      
      // Si no existe, agregamos solo si hay stock
      return producto.stock_actual > 0 
        ? [...prev, { producto, cantidad: 1 }] 
        : prev;
    });
  };

  const removeFromCart = (producto: Producto) => {
    setCarrito(prev => {
      const existing = prev.find(item => item.producto.id_producto === producto.id_producto);
      if (existing) {
        // Si la cantidad es mayor a 1, restamos
        if (existing.cantidad > 1) {
          return prev.map(item => item.producto.id_producto === producto.id_producto 
            ? { ...item, cantidad: item.cantidad - 1 } 
            : item
          );
        }
        // Si es 1, eliminamos el item
        return prev.filter(item => item.producto.id_producto !== producto.id_producto);
      }
      return prev;
    });
  };

  const totalVenta = carrito.reduce((acc, item) => acc + (item.producto.precio_venta * item.cantidad), 0);

  const registrarVenta = async () => {
    try {
      await tiendaUseCases.registrarVenta({ total: totalVenta }, carrito);
      alert('Venta registrada con éxito');
      setCarrito([]);
      // Recargar productos para actualizar stock
      const nuevosProductos = await tiendaUseCases.getProductos();
      setProductos(nuevosProductos);
    } catch (error) {
      alert('Error al registrar la venta: ' + error);
    }
  };

  return (
    <Box className="fade-in">
      <Header 
        title="Nueva Venta" 
        backHref="/tienda-abarrotes" 
        settingsHref="/ajustes" 
        notificacionesHref="/notificaciones"
        notificacionesCount={notificacionesCount}
      />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pb: 10 }}>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2}>
            {/* Sección de Selección */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#57423f', mb: 2 }}>Seleccionar Productos</Typography>
            </Grid>
            {productos.map(p => (
              <Grid item xs={12} sm={6} key={p.id_producto}>
                <Box className="card" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{p.nombre}</Typography>
                    <Typography sx={{ fontSize: '14px' }}>Stock: {p.stock_actual}</Typography>
                  </Box>
                  <Button className="btn-secondary" onClick={() => addToCart(p)}>Agregar</Button>
                </Box>
              </Grid>
            ))}

            {/* Carrito */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: '#57423f', mb: 2 }}>Carrito</Typography>
              {carrito.map(item => (
                <Box key={item.producto.id_producto} className="card" sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>{item.producto.nombre} x {item.cantidad}</Typography>
                  <Box>
                    <Button size="small" onClick={() => removeFromCart(item.producto)}>-</Button>
                    <Button size="small" onClick={() => addToCart(item.producto)}>+</Button>
                  </Box>
                  <Typography>${(item.producto.precio_venta * item.cantidad).toFixed(2)}</Typography>
                </Box>
              ))}
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8C261F', mb: 2 }}>Total: ${totalVenta.toFixed(2)}</Typography>
                <Button className="btn-primary" sx={{ px: 4, py: 1.5 }} onClick={registrarVenta} disabled={carrito.length === 0}>
                  Confirmar Venta
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};
