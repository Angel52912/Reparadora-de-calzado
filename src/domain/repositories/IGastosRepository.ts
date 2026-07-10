import type { GastoOperativo } from '../entities/gastos';

export interface IGastosRepository {
  getGastos(): Promise<GastoOperativo[]>;
  addGasto(gasto: Omit<GastoOperativo, 'id_gasto' | 'fecha_gasto'>): Promise<GastoOperativo>;
}
