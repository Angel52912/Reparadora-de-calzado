import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, IconButton, Button } from '@mui/material';
// @ts-ignore
import AddIcon from '@mui/icons-material/Add';
// @ts-ignore
import RemoveIcon from '@mui/icons-material/Remove';
// @ts-ignore
import DeleteIcon from '@mui/icons-material/Delete';
// @ts-ignore
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import type { Producto } from '../../domain/entities/tienda';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

export const InventarioPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [cambios, setCambios] = useState<Record<number, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    tiendaUseCases.getProductos().then(data => {
      setProductos(data);
      const lowStock = data.filter(p => p.stock_actual < 5).length;
      setNotificacionesCount(lowStock);
      setLoading(false);
    });
  }, []);

  const updateStockLocal = (id: number, delta: number) => {
    setProductos(prev => prev.map(p => {
      if (p.id_producto === id) {
        const nuevoStock = Math.max(0, p.stock_actual + delta);
        setCambios(c => ({ ...c, [id]: nuevoStock }));
        return { ...p, stock_actual: nuevoStock };
      }
      return p;
    }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto del inventario?')) {
      try {
        await tiendaUseCases.eliminarProducto(id);
        setProductos(prev => prev.filter(p => p.id_producto !== id));
      } catch (error) {
        alert('Error al eliminar el producto: ' + error);
      }
    }
  };

  const guardarCambios = async () => {
    try {
      for (const [id, nuevoStock] of Object.entries(cambios)) {
        await tiendaRepository.updateStock(Number(id), nuevoStock);
      }
      setCambios({});
      alert('Cambios guardados con éxito');
    } catch (error) {
      alert('Error al guardar cambios: ' + error);
    }
  };

  return (
    <Box className="fade-in">
      <Header 
        title="Inventario" 
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
              <Grid item xs={12} key={p.id_producto}>
                <Box className="card" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{p.nombre}</Typography>
                    <Typography sx={{ fontSize: '14px', color: '#57423f' }}>Stock: {p.stock_actual}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => updateStockLocal(p.id_producto, -1)}><RemoveIcon /></IconButton>
                    <Typography sx={{ width: 30, textAlign: 'center' }}>{p.stock_actual}</Typography>
                    <IconButton onClick={() => updateStockLocal(p.id_producto, 1)}><AddIcon /></IconButton>
                    <IconButton onClick={() => navigate(`/tienda-abarrotes/editar/${p.id_producto}`)} color="primary"><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(p.id_producto)} color="error"><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={guardarCambios}
                disabled={Object.keys(cambios).length === 0}
              >
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};
