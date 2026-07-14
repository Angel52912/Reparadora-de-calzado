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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'costo_mano_obra' || name === 'costo_materiales' || name === 'anticipo') ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await tallerUseCases.actualizarTicket(id, {
          nombre_cliente: formData.nombre_cliente,
          telefono: formData.telefono,
          producto: formData.producto,
          servicio_solicitado: formData.servicio_solicitado,
          costo_mano_obra: Number(formData.costo_mano_obra),
          costo_materiales: Number(formData.costo_materiales),
          anticipo: Number(formData.anticipo)
        });
        alert('Ticket actualizado con éxito');
        navigate('/talabarteria/registro-servicios');
      } else {
        const ticketData = {
          ...formData,
          estado: 'Recibido' as EstadoTicket,
          costo_mano_obra: Number(formData.costo_mano_obra),
          costo_materiales: Number(formData.costo_materiales),
          anticipo: Number(formData.anticipo)
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
            name="nombre_cliente"
            label="Nombre del cliente" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.nombre_cliente} 
            onChange={handleInputChange} 
          />
          <TextField 
            name="telefono"
            label="Teléfono" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.telefono} 
            onChange={handleInputChange} 
          />
          <TextField 
            name="producto"
            label="Producto" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.producto} 
            onChange={handleInputChange} 
          />
          <TextField 
            name="servicio_solicitado"
            label="Servicio solicitado" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            multiline 
            rows={2} 
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.servicio_solicitado} 
            onChange={handleInputChange} 
          />
          <TextField 
            name="costo_mano_obra"
            label="Costo mano obra" 
            type="number" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.costo_mano_obra} 
            onChange={handleInputChange} 
          />
          <TextField 
            name="costo_materiales"
            label="Costo materiales" 
            type="number" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.costo_materiales} 
            onChange={handleInputChange} 
          />
          <TextField 
            name="anticipo"
            label="Anticipo" 
            type="number" 
            variant="outlined" 
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 3, '& .MuiInputLabel-root': { top: -4 } }}
            value={formData.anticipo} 
            onChange={handleInputChange} 
          />
          <Button className="btn-primary" sx={{ mt: 2, py: 1.5 }} onClick={handleSubmit}>{id ? "Actualizar Orden" : "Registrar Orden"}</Button>
        </Box>
      </Box>
    </Box>
  );
};
