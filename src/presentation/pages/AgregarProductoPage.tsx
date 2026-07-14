import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

export const AgregarProductoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    precio_venta: 0,
    stock_actual: 0
  });

  useEffect(() => {
    if (id) {
      tiendaUseCases.getProductoById(id).then(producto => {
        if (producto) {
          setFormData({
            nombre: producto.nombre,
            precio_venta: producto.precio_venta,
            stock_actual: producto.stock_actual
          });
        }
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      if (id) {
        await tiendaUseCases.actualizarProducto(Number(id), {
          nombre: formData.nombre,
          precio_venta: Number(formData.precio_venta),
          stock_actual: Number(formData.stock_actual)
        });
        alert('Producto actualizado con éxito');
        navigate('/tienda-abarrotes/inventario');
      } else {
        await tiendaUseCases.agregarProducto({
          nombre: formData.nombre,
          precio_venta: Number(formData.precio_venta),
          stock_actual: Number(formData.stock_actual)
        });
        alert('Producto agregado con éxito');
        setFormData({ nombre: '', precio_venta: 0, stock_actual: 0 });
      }
    } catch (error) {
      alert('Error al guardar: ' + error);
    }
  };

  return (
    <Box className="fade-in">
      <Header title={id ? "Editar Producto" : "Agregar Producto"} backHref="/tienda-abarrotes" homeHref="/" />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2 }}>
        <Box className="card" sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#8C261F', mb: 1 }}>Detalles del Producto</Typography>
          <TextField 
            label="Nombre del producto" 
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth 
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.nombre} 
            onChange={e => setFormData({...formData, nombre: e.target.value})} 
          />
          <TextField 
            label="Precio de venta" 
            type="number" 
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth 
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.precio_venta} 
            onChange={e => setFormData({...formData, precio_venta: Number(e.target.value)})} 
          />
          <TextField 
            label="Stock Inicial" 
            type="number" 
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth 
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.stock_actual} 
            onChange={e => setFormData({...formData, stock_actual: Number(e.target.value)})} 
          />
          <Button 
            className="btn-primary" 
            sx={{ mt: 2, py: 1.5, backgroundColor: '#1976d2', color: '#FFFFFF', '&:hover': { backgroundColor: '#1565c0' } }} 
            onClick={handleSubmit}
          >
            {id ? "Actualizar Producto" : "Guardar Producto"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
