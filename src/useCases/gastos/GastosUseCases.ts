import type { IGastosRepository } from '../../domain/repositories/IGastosRepository';
import type { GastoOperativo } from '../../domain/entities/gastos';

export class GastosUseCases {
  constructor(private gastosRepository: IGastosRepository) {}

  async getGastos(): Promise<GastoOperativo[]> {
    return this.gastosRepository.getGastos();
  }

  async registrarGasto(gasto: Omit<GastoOperativo, 'id' | 'created_at'>): Promise<GastoOperativo> {
    // Aquí se podrían añadir validaciones de negocio.
    return this.gastosRepository.addGasto(gasto);
  }
}
