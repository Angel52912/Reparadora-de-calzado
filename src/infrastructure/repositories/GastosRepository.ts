import { supabase } from './supabaseClient';
import type { IGastosRepository } from '../../domain/repositories/IGastosRepository';
import type { GastoOperativo } from '../../domain/entities/gastos';

export class GastosRepository implements IGastosRepository {
  async getGastos(): Promise<GastoOperativo[]> {
    const { data, error } = await supabase.from('gastos_operativos').select('*');
    if (error) throw error;
    return data as GastoOperativo[];
  }

  async addGasto(gasto: Omit<GastoOperativo, 'id_gasto' | 'fecha_gasto'>): Promise<GastoOperativo> {
    const { data, error } = await supabase.from('gastos_operativos').insert(gasto).select().single();
    if (error) throw error;
    return data as GastoOperativo;
  }
}
