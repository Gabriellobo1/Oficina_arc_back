import { AppError } from "../../lib/AppError";
import { PG, isPgError } from "../../lib/db";
import { z } from "zod";
import { criarClienteSchema, atualizarClienteSchema } from "./clientes.schema";
import { clientesRepository } from "./clientes.repository";

type CriarClienteDto = z.infer<typeof criarClienteSchema>;
type AtualizarClienteDto = z.infer<typeof atualizarClienteSchema>;

export const clientesService = {
  async criar(data: CriarClienteDto) {
    try {
      return await clientesRepository.criar(data);
    } catch (error) {
      if (isPgError(error, PG.UNIQUE_VIOLATION)) {
        throw new AppError("E-mail, CPF ou CNPJ já cadastrado", 409);
      }
      throw error;
    }
  },

  async buscarPorId(id: string) {
    const cliente = await clientesRepository.buscarPorId(id);
    if (!cliente) throw new AppError("Cliente não encontrado", 404);
    return cliente;
  },

  async listar(page: number, limit: number, nome?: string, tipo?: string) {
    const { data, total } = await clientesRepository.listar(page, limit, nome, tipo);
    return { data, meta: { page, limit, total, hasNextPage: page * limit < total } };
  },

  async atualizar(id: string, data: AtualizarClienteDto) {
    await this.buscarPorId(id);
    try {
      return await clientesRepository.atualizar(id, data);
    } catch (error) {
      if (isPgError(error, PG.UNIQUE_VIOLATION)) {
        throw new AppError("E-mail, CPF ou CNPJ já cadastrado", 409);
      }
      throw error;
    }
  },
};
