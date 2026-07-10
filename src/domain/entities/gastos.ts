export interface GastoOperativo {
  id_gasto: number;
  concepto: string;
  monto: number;
  tipo_departamento: 'Tienda' | 'Taller';
  fecha_gasto: string;
}
