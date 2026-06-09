import { z } from "zod";

export const criarPecaSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
  preco_unitario: z.number().positive(),
  quantidade: z.number().int().min(0),
  quantidade_minima: z.number().int().min(0),
  fornecedor: z.string().optional(),
});
