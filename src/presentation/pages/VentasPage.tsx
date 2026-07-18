import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Grid } from '@mui/material';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import { COLORS } from '../context/theme';
import { useToast } from '../context/ToastContext';
import type { Producto } from '../../domain/entities/tienda';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

export const VentasPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<{producto: Producto, cantidad: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const { showToast } = useToast();

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
    if (producto.stock_actual <= 0) {
      showToast('No hay existencias disponibles de este producto.', 'error');
      return;
    }

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
        // Si ya alcanzó el stock, avisamos
        showToast('Se alcanzó el límite de existencias.', 'warning');
        return prev;
      }
      
      // Si no existe, agregamos
      return [...prev, { producto, cantidad: 1 }];
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
      showToast('Venta registrada con éxito ✓', 'success');
      setCarrito([]);
      // Recargar productos para actualizar stock
      const nuevosProductos = await tiendaUseCases.getProductos();
      setProductos(nuevosProductos);
    } catch (error) {
      showToast('Error al registrar la venta. Intenta de nuevo.', 'error');
      console.error('[VentasPage] Error al registrar venta:', error);
    }
  };

  return (
    <Box className="fade-in">
      <Header 
        title="Nueva Venta" 
        backHref="/tienda-abarrotes" 
         
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
              <Typography variant="h6" sx={{ color: COLORS.inkSecondary, mb: 2 }}>Seleccionar Productos</Typography>
            </Grid>
            {productos.map(p => (
              <Grid item xs={12} sm={6} key={p.id_producto}>
                <Box 
                  className="card" 
                  onClick={() => addToCart(p)}
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: COLORS.primary }
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{p.nombre}</Typography>
                    <Typography sx={{ fontSize: '14px' }}>Stock: {p.stock_actual}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>${p.precio_venta.toFixed(2)}</Typography>
                </Box>
              </Grid>
            ))}

            {/* Carrito */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: COLORS.inkSecondary, mb: 2 }}>Carrito</Typography>
              {carrito.map(item => (
                <Box key={item.producto.id_producto} className="card" sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.producto.nombre} x {item.cantidad}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => removeFromCart(item.producto)}
                      sx={{ minWidth: 32, p: 0.5, borderColor: COLORS.inkTertiary, color: COLORS.inkTertiary }}
                    >-</Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => addToCart(item.producto)}
                      sx={{ minWidth: 32, p: 0.5, background: COLORS.primary, color: '#fff' }}
                    >+</Button>
                  </Box>
                  <Typography sx={{ width: 60, textAlign: 'right', flexShrink: 0 }}>
                    ${(item.producto.precio_venta * item.cantidad).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.primary, mb: 2 }}>Total: ${totalVenta.toFixed(2)}</Typography>
                <Button className="btn-primary" sx={{ px: 4, py: 1.5, color: '#fff' }} onClick={registrarVenta} disabled={carrito.length === 0}>
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
