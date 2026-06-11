import { AppError } from "../../lib/AppError";
import { z } from "zod";
import { criarPecaSchema, atualizarPecaSchema } from "./pecas.schema";
import { pecasRepository } from "./pecas.repository";

type CriarPecaDto = z.infer<typeof criarPecaSchema>;
type AtualizarPecaDto = z.infer<typeof atualizarPecaSchema>;

export const pecasService = {
  async criar(data: CriarPecaDto) {
    return pecasRepository.criar(data);
  },

  async listar() {
    return pecasRepository.listar();
  },

  async atualizar(id: string, data: AtualizarPecaDto) {
    const peca = await pecasRepository.buscarPorId(id);
    if (!peca) throw new AppError("Peça não encontrada", 404);
    return pecasRepository.atualizar(id, data);
  },

  async abaixoDoMinimo() {
    return pecasRepository.abaixoDoMinimo();
  },
};
