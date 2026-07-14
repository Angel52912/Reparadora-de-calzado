import type { TicketTaller, EstadoTicket } from '../entities/taller';

export interface ITallerRepository {
  getTickets(): Promise<TicketTaller[]>;
  getTicketById(id: string): Promise<TicketTaller | null>;
  createTicket(ticket: Omit<TicketTaller, 'id_servicio' | 'fecha_recepcion'>): Promise<TicketTaller>;
  updateEstadoTicket(id: string, nuevoEstado: EstadoTicket): Promise<void>;
  updateTicket(id: string, ticket: Partial<TicketTaller>): Promise<void>;
  deleteTicket(id: string): Promise<void>;
}
