import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  criarAgendamentoSchema,
  atualizarStatusSchema,
  adicionarItemServicoSchema,
  adicionarItemPecaSchema,
  registrarPagamentoSchema,
  registrarAvaliacaoSchema,
} from "./agendamentos.schema";

type CriarDto = z.infer<typeof criarAgendamentoSchema>;
type StatusDto = z.infer<typeof atualizarStatusSchema>;
type ItemServicoDto = z.infer<typeof adicionarItemServicoSchema>;
type ItemPecaDto = z.infer<typeof adicionarItemPecaSchema>;
type PagamentoDto = z.infer<typeof registrarPagamentoSchema>;
type AvaliacaoDto = z.infer<typeof registrarAvaliacaoSchema>;

export const agendamentosService = {
  async criar(data: CriarDto) {
    return prisma.agendamento.create({ data });
  },

  async atualizarStatus(id: string, data: StatusDto) {
    const agendamento = await prisma.agendamento.findUnique({ where: { id } });
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);

    if (data.status === "CONCLUIDO") {
      if (!data.km_saida) throw new AppError("km_saida é obrigatório ao concluir", 400);
      if (data.km_saida < agendamento.km_entrada) {
        throw new AppError("Km de saída não pode ser menor que km de entrada", 400);
      }
    }

    return prisma.agendamento.update({
      where: { id },
      data: {
        status: data.status,
        km_saida: data.km_saida,
        conclusaoEm: data.status === "CONCLUIDO" ? new Date() : undefined,
      },
    });
  },

  async listar(page: number, limit: number, status?: string, data?: string) {
    const where: Prisma.AgendamentoWhereInput = {
      ...(status && { status }),
      ...(data && {
        aberturaEm: {
          gte: new Date(data),
          lt: new Date(new Date(data).setDate(new Date(data).getDate() + 1)),
        },
      }),
    };

    const [registros, total] = await prisma.$transaction([
      prisma.agendamento.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { criadoEm: "desc" },
        include: {
          veiculo: { select: { placa: true, modelo: true } },
          _count: { select: { itensServico: true, itensPeca: true } },
        },
      }),
      prisma.agendamento.count({ where }),
    ]);

    return { data: registros, meta: { page, limit, total, hasNextPage: page * limit < total } };
  },

  async buscarPorId(id: string) {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      include: {
        veiculo: { include: { cliente: true } },
        itensServico: { include: { tipoServico: true, funcionario: true } },
        itensPeca: { include: { peca: true } },
        pagamento: true,
        avaliacao: true,
      },
    });
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    return agendamento;
  },

  async adicionarItemServico(agendamentoId: string, data: ItemServicoDto) {
    const agendamento = await prisma.agendamento.findUnique({ where: { id: agendamentoId } });
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    if (agendamento.status === "CONCLUIDO" || agendamento.status === "CANCELADO") {
      throw new AppError("Não é possível adicionar itens a uma OS encerrada", 400);
    }
    return prisma.itemServico.create({ data: { agendamentoId, ...data } });
  },

  async adicionarItemPeca(agendamentoId: string, data: ItemPecaDto) {
    const agendamento = await prisma.agendamento.findUnique({ where: { id: agendamentoId } });
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    if (agendamento.status === "CONCLUIDO" || agendamento.status === "CANCELADO") {
      throw new AppError("Não é possível adicionar itens a uma OS encerrada", 400);
    }

    const peca = await prisma.peca.findUnique({ where: { id: data.pecaId } });
    if (!peca) throw new AppError("Peça não encontrada", 404);
    if (peca.quantidade < data.quantidade) throw new AppError("Estoque insuficiente", 400);

    return prisma.$transaction([
      prisma.itemPeca.create({ data: { agendamentoId, ...data } }),
      prisma.peca.update({
        where: { id: data.pecaId },
        data: { quantidade: { decrement: data.quantidade } },
      }),
    ]);
  },

  async registrarPagamento(agendamentoId: string, data: PagamentoDto) {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: { pagamento: true },
    });
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    if (agendamento.status !== "CONCLUIDO") {
      throw new AppError("Somente OS com status Concluído podem receber pagamento", 400);
    }
    if (agendamento.pagamento) throw new AppError("OS já possui pagamento registrado", 409);
    return prisma.pagamento.create({ data: { agendamentoId, ...data } });
  },

  async registrarAvaliacao(agendamentoId: string, data: AvaliacaoDto) {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: { avaliacao: true },
    });
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
    if (agendamento.status !== "CONCLUIDO") {
      throw new AppError("Somente OS com status Concluído podem ser avaliadas", 400);
    }
    if (agendamento.avaliacao) throw new AppError("OS já possui avaliação", 409);
    return prisma.avaliacao.create({ data: { agendamentoId, ...data } });
  },
};
