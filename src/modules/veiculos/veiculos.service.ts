import { AppError } from "../../lib/AppError";
import { PG, isPgError } from "../../lib/db";
import { z } from "zod";
import { criarVeiculoSchema, atualizarVeiculoSchema } from "./veiculos.schema";
import { veiculosRepository } from "./veiculos.repository";

type CriarVeiculoDto = z.infer<typeof criarVeiculoSchema>;
type AtualizarVeiculoDto = z.infer<typeof atualizarVeiculoSchema>;

export const veiculosService = {
  async criar(data: CriarVeiculoDto) {
    try {
      return await veiculosRepository.criar(data);
    } catch (error) {
      if (isPgError(error, PG.UNIQUE_VIOLATION)) {
        throw new AppError("Placa já cadastrada", 409);
      }
      throw error;
    }
  },

  async listarPorCliente(clienteId: string) {
    return veiculosRepository.listarPorCliente(clienteId);
  },

  async listarTodos() {
    return veiculosRepository.listarTodos();
  },

  async buscarPorPlaca(placa: string) {
    const veiculo = await veiculosRepository.buscarPorPlaca(placa.toUpperCase());
    if (!veiculo) throw new AppError("Veículo não encontrado", 404);
    return veiculo;
  },

  async atualizar(id: string, data: AtualizarVeiculoDto) {
    try {
      const veiculo = await veiculosRepository.atualizar(id, data);
      if (!veiculo) throw new AppError("Veículo não encontrado", 404);
      return veiculo;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (isPgError(error, PG.UNIQUE_VIOLATION)) {
        throw new AppError("Placa já cadastrada", 409);
      }
      throw error;
    }
  },

  async remover(id: string) {
    try {
      const ok = await veiculosRepository.remover(id);
      if (!ok) throw new AppError("Veículo não encontrado", 404);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (isPgError(error, PG.FOREIGN_KEY_VIOLATION)) {
        throw new AppError(
          "Não é possível excluir: o veículo possui ordens de serviço vinculadas",
          409
        );
      }
      throw error;
    }
  },
};
