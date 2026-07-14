import { supabase } from './supabaseClient';
import type { ITallerRepository } from '../../domain/repositories/ITallerRepository';
import type { TicketTaller, EstadoTicket } from '../../domain/entities/taller';

export class TallerRepository implements ITallerRepository {
  async getTickets(): Promise<TicketTaller[]> {
    const { data, error } = await supabase.from('taller_tickets').select('*');
    if (error) throw error;
    return data as TicketTaller[];
  }

  async getTicketById(id: string): Promise<TicketTaller | null> {
    const { data, error } = await supabase.from('taller_tickets').select('*').eq('id_servicio', id).single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as TicketTaller;
  }

  async createTicket(ticket: Omit<TicketTaller, 'id_servicio' | 'fecha_recepcion'>): Promise<TicketTaller> {
    const { data, error } = await supabase.from('taller_tickets').insert(ticket).select().single();
    if (error) throw error;
    return data as TicketTaller;
  }

  async updateEstadoTicket(id: string, nuevoEstado: EstadoTicket): Promise<void> {
    const { error } = await supabase.from('taller_tickets').update({ estado: nuevoEstado }).eq('id_servicio', id);
    if (error) throw error;
  }

  async updateTicket(id: string, ticket: Partial<TicketTaller>): Promise<void> {
    const { costo_total, ...dataToUpdate } = ticket;
    const { error } = await supabase.from('taller_tickets').update(dataToUpdate).eq('id_servicio', id);
    if (error) throw error;
  }

  async deleteTicket(id: string): Promise<void> {
    const { error } = await supabase.from('taller_tickets').delete().eq('id_servicio', id);
    if (error) throw error;
  }
}
