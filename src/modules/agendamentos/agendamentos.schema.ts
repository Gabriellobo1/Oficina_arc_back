import { z } from "zod";

export const criarAgendamentoSchema = z.object({
  veiculoId: z.string().uuid(),
  km_entrada: z.number().int().positive(),
  observacoes: z.string().optional(),
});

export const atualizarStatusSchema = z.object({
  status: z.enum(["AGENDADO", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO", "NO_SHOW"]),
  km_saida: z.number().int().positive().optional(),
});

export const listarAgendamentosSchema = z.object({
  status: z.enum(["AGENDADO", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO", "NO_SHOW"]).optional(),
  data: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

export const adicionarItemServicoSchema = z.object({
  tipoServicoId: z.string().uuid(),
  funcionarioId: z.string().uuid(),
  quantidade: z.number().int().positive().default(1),
  preco_unitario: z.number().positive(),
  desconto: z.number().min(0).default(0),
});

export const adicionarItemPecaSchema = z.object({
  pecaId: z.string().uuid(),
  quantidade: z.number().int().positive(),
  preco_unitario: z.number().positive(),
  desconto: z.number().min(0).default(0),
});

export const registrarPagamentoSchema = z.object({
  valor_total: z.number().positive(),
  forma_pagamento: z.enum(["DINHEIRO", "CARTAO_CREDITO", "CARTAO_DEBITO", "PIX", "BOLETO"]),
  parcelas: z.number().int().min(1).default(1),
});

export const registrarAvaliacaoSchema = z.object({
  nota: z.number().int().min(1).max(5),
  comentario: z.string().optional(),
});
