import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, TextField, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import type { Venta, DetalleVenta } from '../../domain/entities/tienda';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

export const HistorialVentasPage: React.FC = () => {
  const [historial, setHistorial] = useState<{venta: Venta, detalles: DetalleVenta[]}[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const fetchHistorial = async (start: string, end: string) => {
    setLoading(true);
    // Pass raw YYYY-MM-DD strings, TiendaRepository will append time components
    const data = await tiendaUseCases.getHistorialVentasByDateRange(start, end);
    setHistorial(data);
    setLoading(false);
  };

  useEffect(() => {
    tiendaRepository.getProductos().then(productos => {
      const lowStock = productos.filter(p => p.stock_actual < 5).length;
      setNotificacionesCount(lowStock);
    });

    fetchHistorial(startDate, endDate);
  }, []);

  const handleFilter = () => {
    fetchHistorial(startDate, endDate);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box className="fade-in">
      <style media="print">
        {`
          @media print {
            .no-print { display: none !important; }
            .card { border: 1px solid #ccc !important; box-shadow: none !important; }
            body { padding: 20px; }
          }
        `}
      </style>
      <Header 
        className="no-print"
        title="Historial de Ventas" 
        onBack={() => navigate(-1)} 
        settingsHref="/ajustes" 
        notificacionesHref="/notificaciones" 
        notificacionesCount={notificacionesCount}
      />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pb: 10 }}>
        <Box className="no-print" sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField 
            type="date" 
            label="Desde" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField 
            type="date" 
            label="Hasta" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={handleFilter}>Filtrar</Button>
          <IconButton onClick={handlePrint} color="primary" title="Imprimir / Guardar PDF">
            <PrintIcon />
          </IconButton>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : historial.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: 5, color: '#57423f' }}>No hay ventas registradas en este rango.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {historial.map(({ venta, detalles }) => (
              <Paper key={venta.id_venta} className="card" sx={{ p: 3, borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#8C261F' }}>
                    Venta #{venta.id_venta}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#777' }}>
                    {new Date(venta.fecha_venta).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  {detalles.map(d => (
                    <Box key={d.id_detalle} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <Typography>{d.nombre_producto || `Producto #${d.id_producto}`} x {d.cantidad}</Typography>
                      <Typography>${d.subtotal.toFixed(2)}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eee', pt: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#2B2B2B' }}>
                    Total: ${venta.total.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
