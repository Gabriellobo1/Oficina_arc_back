import { AppError } from "../../lib/AppError";
import { PG, isPgError } from "../../lib/db";
import { z } from "zod";
import { criarTipoServicoSchema, atualizarTipoServicoSchema } from "./tipo-servico.schema";
import { tipoServicoRepository } from "./tipo-servico.repository";

type CriarDto = z.infer<typeof criarTipoServicoSchema>;
type AtualizarDto = z.infer<typeof atualizarTipoServicoSchema>;

export const tipoServicoService = {
  async criar(data: CriarDto) {
    try {
      return await tipoServicoRepository.criar(data);
    } catch (error) {
      if (isPgError(error, PG.UNIQUE_VIOLATION)) {
        throw new AppError("Já existe um serviço com esse nome", 409);
      }
      throw error;
    }
  },

  async listar() {
    return tipoServicoRepository.listar();
  },

  async buscarPorId(id: string) {
    const tipoServico = await tipoServicoRepository.buscarPorId(id);
    if (!tipoServico) throw new AppError("Tipo de serviço não encontrado", 404);
    return tipoServico;
  },

  async atualizar(id: string, data: AtualizarDto) {
    await this.buscarPorId(id);
    try {
      return await tipoServicoRepository.atualizar(id, data);
    } catch (error) {
      if (isPgError(error, PG.UNIQUE_VIOLATION)) {
        throw new AppError("Já existe um serviço com esse nome", 409);
      }
      throw error;
    }
  },

  async deletar(id: string) {
    await this.buscarPorId(id);
    try {
      await tipoServicoRepository.deletar(id);
    } catch (error) {
      if (isPgError(error, PG.FOREIGN_KEY_VIOLATION)) {
        throw new AppError("Serviço está vinculado a ordens de serviço e não pode ser removido", 409);
      }
      throw error;
    }
  },
};
