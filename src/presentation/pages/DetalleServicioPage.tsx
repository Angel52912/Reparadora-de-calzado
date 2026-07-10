import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Chip, Select, MenuItem, FormControl, InputLabel, Button, CircularProgress } from '@mui/material';
import { Header } from '../components/Header';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';
import type { TicketTaller, EstadoTicket } from '../../domain/entities/taller';

const tallerRepository = new TallerRepository();
const tallerUseCases = new TallerUseCases(tallerRepository);

export const DetalleServicioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketTaller | null>(null);
  const [loading, setLoading] = useState(true);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoTicket | ''>('');

  useEffect(() => {
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
      <Header title="Detalle del Servicio" backHref="/talabarteria/registro-servicios" homeHref="/" />
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">{ticket.producto}</Typography>
          <Typography>Cliente: {ticket.nombre_cliente}</Typography>
          <Typography>Servicio: {ticket.servicio_solicitado}</Typography>
          <Typography>Costo Total: ${ticket.costo_total.toFixed(2)}</Typography>
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
