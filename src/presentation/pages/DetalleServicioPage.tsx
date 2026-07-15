import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Button, CircularProgress } from '@mui/material';
import { Header } from '../components/Header';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import type { TicketTaller, EstadoTicket } from '../../domain/entities/taller';

const tallerRepository = new TallerRepository();
const tallerUseCases = new TallerUseCases(tallerRepository);
const tiendaRepository = new TiendaRepository();

export const DetalleServicioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketTaller | null>(null);
  const [loading, setLoading] = useState(true);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoTicket | ''>('');
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    tiendaRepository.getProductos().then(productos => {
      const lowStock = productos.filter(p => p.stock_actual < 5).length;
      setNotificacionesCount(lowStock);
    });
    
    if (id) {
      tallerUseCases.getTicketById(id).then(data => {
        setTicket(data);
        if (data) setNuevoEstado(data.estado);
        setLoading(false);
      });
    }
  }, [id]);

  const handleUpdateEstado = async () => {
    if (id && nuevoEstado) {
      await tallerUseCases.actualizarEstadoTicket(id, nuevoEstado);
      navigate('/talabarteria/registro-servicios');
    }
  };

  if (loading) return <CircularProgress />;
  if (!ticket) return <Typography>Servicio no encontrado.</Typography>;

  return (
    <Box>
      <Header 
        title="Detalle del Servicio" 
        onBack={() => navigate(-1)} 
        settingsHref="/ajustes" 
        notificacionesHref="/notificaciones" 
        notificacionesCount={notificacionesCount}
      />
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">{ticket.producto}</Typography>
          <Typography sx={{ mt: 1 }}><strong>Cliente:</strong> {ticket.nombre_cliente}</Typography>
          <Typography><strong>Teléfono:</strong> {ticket.telefono || 'No proporcionado'}</Typography>
          <Typography sx={{ mt: 1 }}><strong>Servicio:</strong> {ticket.servicio_solicitado}</Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography><strong>Costo Mano de Obra:</strong> ${ticket.costo_mano_obra.toFixed(2)}</Typography>
            <Typography><strong>Costo Materiales:</strong> ${ticket.costo_materiales.toFixed(2)}</Typography>
            <Typography sx={{ mt: 1, fontWeight: 'bold' }}><strong>Costo Total:</strong> ${ticket.costo_total.toFixed(2)}</Typography>
            <Typography><strong>Anticipo:</strong> ${ticket.anticipo.toFixed(2)}</Typography>
            <Typography><strong>Restante:</strong> ${(ticket.costo_total - ticket.anticipo).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value as EstadoTicket)}>
                <MenuItem value="Recibido">Recibido</MenuItem>
                <MenuItem value="En Proceso">En Proceso</MenuItem>
                <MenuItem value="Terminado">Terminado</MenuItem>
                <MenuItem value="Entregado">Entregado</MenuItem>
                <MenuItem value="Abandonado">Abandonado</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpdateEstado}>Actualizar Estado</Button>
        </Paper>
      </Box>
    </Box>
  );
};
