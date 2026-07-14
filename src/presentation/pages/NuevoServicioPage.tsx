import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';
import type { EstadoTicket } from '../../domain/entities/taller';

const tallerRepository = new TallerRepository();
const tallerUseCases = new TallerUseCases(tallerRepository);

export const NuevoServicioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    telefono: '',
    producto: '',
    servicio_solicitado: '',
    costo_mano_obra: 0,
    costo_materiales: 0,
    anticipo: 0
  });

  useEffect(() => {
    if (id) {
      tallerUseCases.getTicketById(id).then(ticket => {
        if (ticket) {
          setFormData({
            nombre_cliente: ticket.nombre_cliente,
            telefono: ticket.telefono,
            producto: ticket.producto,
            servicio_solicitado: ticket.servicio_solicitado,
            costo_mano_obra: ticket.costo_mano_obra,
            costo_materiales: ticket.costo_materiales,
            anticipo: ticket.anticipo
          });
        }
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      if (id) {
        await tallerUseCases.actualizarTicket(id, {
          ...formData,
          costo_total: Number(formData.costo_mano_obra) + Number(formData.costo_materiales)
        });
        alert('Ticket actualizado con éxito');
        navigate('/talabarteria/registro-servicios');
      } else {
        const { costo_total, ...ticketData } = {
          ...formData,
          estado: 'Recibido' as EstadoTicket,
          costo_total: Number(formData.costo_mano_obra) + Number(formData.costo_materiales)
        };
        await tallerUseCases.crearTicket(ticketData);
        alert('Ticket registrado con éxito');
        setFormData({ nombre_cliente: '', telefono: '', producto: '', servicio_solicitado: '', costo_mano_obra: 0, costo_materiales: 0, anticipo: 0 });
      }
    } catch (error) {
      alert('Error al guardar: ' + error);
    }
  };

  return (
    <Box className="fade-in">
      <Header title={id ? "Editar Servicio" : "Nuevo Servicio"} backHref="/talabarteria" homeHref="/" />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2 }}>
        <Box className="card" sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField 
            label="Nombre del cliente" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.nombre_cliente} 
            onChange={e => setFormData({...formData, nombre_cliente: e.target.value})} 
          />
          <TextField 
            label="Teléfono" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.telefono} 
            onChange={e => setFormData({...formData, telefono: e.target.value})} 
          />
          <TextField 
            label="Producto" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.producto} 
            onChange={e => setFormData({...formData, producto: e.target.value})} 
          />
          <TextField 
            label="Servicio solicitado" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            multiline 
            rows={2} 
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.servicio_solicitado} 
            onChange={e => setFormData({...formData, servicio_solicitado: e.target.value})} 
          />
          <TextField 
            label="Costo mano obra" 
            type="number" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.costo_mano_obra} 
            onChange={e => setFormData({...formData, costo_mano_obra: Number(e.target.value)})} 
          />
          <TextField 
            label="Costo materiales" 
            type="number" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.costo_materiales} 
            onChange={e => setFormData({...formData, costo_materiales: Number(e.target.value)})} 
          />
          <TextField 
            label="Anticipo" 
            type="number" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.anticipo} 
            onChange={e => setFormData({...formData, anticipo: Number(e.target.value)})} 
          />
          <Button className="btn-primary" sx={{ mt: 2, py: 1.5 }} onClick={handleSubmit}>{id ? "Actualizar Orden" : "Registrar Orden"}</Button>
        </Box>
      </Box>
    </Box>
  );
};
