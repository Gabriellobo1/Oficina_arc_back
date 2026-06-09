import { z } from "zod";

export const criarVeiculoSchema = z.object({
  placa: z.string().min(7).max(8).toUpperCase(),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  ano: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  cor: z.string().optional(),
  clienteId: z.string().uuid(),
});
