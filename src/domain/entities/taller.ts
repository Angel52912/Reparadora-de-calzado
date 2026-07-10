export type EstadoTicket = 'Recibido' | 'En Proceso' | 'Terminado' | 'Entregado' | 'Abandonado';

export interface TicketTaller {
  id_servicio: number;
  nombre_cliente: string;
  telefono?: string;
  producto: string;
  servicio_solicitado: string;
  estado: EstadoTicket;
  costo_mano_obra: number;
  costo_materiales: number;
  costo_total: number;
  anticipo: number;
  fecha_recepcion: string;
}
