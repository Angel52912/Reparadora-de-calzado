import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Paper, Chip, IconButton } from '@mui/material';
// @ts-ignore
import DeleteIcon from '@mui/icons-material/Delete';
// @ts-ignore
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';
import type { TicketTaller } from '../../domain/entities/taller';

const tallerRepository = new TallerRepository();
const tallerUseCases = new TallerUseCases(tallerRepository);

export const RegistroServiciosPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketTaller[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    tallerUseCases.getTickets().then(data => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await tallerUseCases.eliminarTicket(String(id));
        setTickets(prev => prev.filter(t => t.id_servicio !== id));
      } catch (error) {
        alert('Error al eliminar el servicio: ' + error);
      }
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Recibido': return 'default';
      case 'En Proceso': return 'primary';
      case 'Terminado': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box className="fade-in">
      <Header title="Registro de Servicios" backHref="/talabarteria" homeHref="/" />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pb: 10 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2}>
            {tickets.map(t => (
              <Grid item xs={12} key={t.id_servicio}>
                <Paper className="card" sx={{ p: 0 }}>
                  <Box onClick={() => navigate(`/talabarteria/servicio/${t.id_servicio}`)} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{t.producto} - {t.nombre_cliente}</Typography>
                      <Typography sx={{ fontSize: '13px', color: '#57423f' }}>{t.servicio_solicitado}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                    <Chip label={t.estado} color={getStatusColor(t.estado) as any} size="small" />
                    <IconButton onClick={() => navigate(`/talabarteria/editar/${t.id_servicio}`)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={(e) => handleDelete(e, t.id_servicio)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
