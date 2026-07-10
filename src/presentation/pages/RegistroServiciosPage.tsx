import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Paper, Chip, ButtonBase } from '@mui/material';
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
              <Grid size={{ xs: 12 }} key={t.id_servicio}>
                <ButtonBase onClick={() => navigate(`/talabarteria/servicio/${t.id_servicio}`)} sx={{ width: '100%', display: 'block', textAlign: 'left' }}>
                  <Paper className="card" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{t.producto} - {t.nombre_cliente}</Typography>
                      <Typography sx={{ fontSize: '13px', color: '#57423f' }}>{t.servicio_solicitado}</Typography>
                    </Box>
                    <Chip label={t.estado} color={getStatusColor(t.estado) as any} size="small" />
                  </Paper>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
