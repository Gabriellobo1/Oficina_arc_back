import { AppError } from "../../lib/AppError";
import { z } from "zod";
import {
  criarAgendamentoSchema,
  atualizarStatusSchema,
  adicionarItemServicoSchema,
  adicionarItemPecaSchema,
  registrarPagamentoSchema,
  registrarAvaliacaoSchema,
} from "./agendamentos.schema";
import { agendamentosRepository } from "./agendamentos.repository";
import { pecasRepository } from "../pecas/pecas.repository";

type CriarDto = z.infer<typeof criarAgendamentoSchema>;
type StatusDto = z.infer<typeof atualizarStatusSchema>;
type ItemServicoDto = z.infer<typeof adicionarItemServicoSchema>;
type ItemPecaDto = z.infer<typeof adicionarItemPecaSchema>;
type PagamentoDto = z.infer<typeof registrarPagamentoSchema>;
type AvaliacaoDto = z.infer<typeof registrarAvaliacaoSchema>;

export const agendamentosService = {
  async criar(data: CriarDto) {
    const { aberturaEm, ...rest } = data;
    return agendamentosRepository.criar({
      ...rest,
      ...(aberturaEm && { aberturaEm: new Date(aberturaEm) }),
    });
  },

  async atualizarStatus(id: string, data: StatusDto) {
    const agendamento = await agendamentosRepository.buscarPorId(id);
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);

    if (data.status === "CONCLUIDO") {
      if (!data.km_saida) throw new AppError("km_saida é obrigatório ao concluir", 400);
      if (data.km_saida < agendamento.km_entrada) {
        throw new AppError("Km de saída não pode ser menor que km de entrada", 400);
      }
    }

    const fields: Record<string, unknown> = { status: data.status };
    if (data.km_saida !== undefined) fields.km_saida = data.km_saida;
    if (data.status === "CONCLUIDO") fields.conclusaoEm = new Date();

    return agendamentosRepository.atualizarStatus(id, fields);
  },

  async listar(page: number, limit: number, status?: string, data?: string) {
    const { data: registros, total } = await agendamentosRepository.listar(page, limit, status, data);
    return { data: registros, meta: { page, limit, total, hasNextPage: page * limit < total } };
  },

  async buscarPorId(id: string) {
    const agendamento = await agendamentosRepository.buscarCompleto(id);
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    return agendamento;
  },

  async adicionarItemServico(agendamentoId: string, data: ItemServicoDto) {
    const agendamento = await agendamentosRepository.buscarPorId(agendamentoId);
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    if (agendamento.status === "CONCLUIDO" || agendamento.status === "CANCELADO") {
      throw new AppError("Não é possível adicionar itens a uma OS encerrada", 400);
    }
    return agendamentosRepository.adicionarItemServico(agendamentoId, data);
  },

  async adicionarItemPeca(agendamentoId: string, data: ItemPecaDto) {
    const agendamento = await agendamentosRepository.buscarPorId(agendamentoId);
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    if (agendamento.status === "CONCLUIDO" || agendamento.status === "CANCELADO") {
      throw new AppError("Não é possível adicionar itens a uma OS encerrada", 400);
    }

    const peca = await pecasRepository.buscarPorId(data.pecaId);
    if (!peca) throw new AppError("Peça não encontrada", 404);
    if (peca.quantidade < data.quantidade) throw new AppError("Estoque insuficiente", 400);

    return agendamentosRepository.adicionarItemPeca(agendamentoId, data);
  },

  async registrarPagamento(agendamentoId: string, data: PagamentoDto) {
    const agendamento = await agendamentosRepository.buscarPorId(agendamentoId);
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    if (agendamento.status !== "CONCLUIDO") {
      throw new AppError("Somente OS com status Concluído podem receber pagamento", 400);
    }
    if (await agendamentosRepository.pagamentoExiste(agendamentoId)) {
      throw new AppError("OS já possui pagamento registrado", 409);
    }
    return agendamentosRepository.criarPagamento(agendamentoId, data);
  },

  async registrarAvaliacao(agendamentoId: string, data: AvaliacaoDto) {
    const agendamento = await agendamentosRepository.buscarPorId(agendamentoId);
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    if (agendamento.status !== "CONCLUIDO") {
      throw new AppError("Somente OS com status Concluído podem ser avaliadas", 400);
    }
    if (await agendamentosRepository.avaliacaoExiste(agendamentoId)) {
      throw new AppError("OS já possui avaliação", 409);
    }
    return agendamentosRepository.criarAvaliacao(agendamentoId, data);
  },
};
