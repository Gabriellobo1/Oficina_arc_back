import { z } from "zod";

export const criarTipoServicoSchema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  preco_base: z.number().positive(),
  tempo_estimado: z.number().int().positive(),
});

export const atualizarTipoServicoSchema = z.object({
  nome: z.string().min(2).optional(),
  descricao: z.string().optional(),
  preco_base: z.number().positive().optional(),
  tempo_estimado: z.number().int().positive().optional(),
});
