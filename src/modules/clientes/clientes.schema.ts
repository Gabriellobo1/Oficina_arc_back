import { z } from "zod";

export const criarClienteSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("PF"),
    nome: z.string().min(2),
    email: z.string().email(),
    telefone: z.string().optional(),
    cpf: z.string().length(11),
    endereco: z.string().optional(),
  }),
  z.object({
    tipo: z.literal("PJ"),
    nome: z.string().min(2),
    email: z.string().email(),
    telefone: z.string().optional(),
    cnpj: z.string().length(14),
    endereco: z.string().optional(),
  }),
]);

export const atualizarClienteSchema = z.object({
  nome: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
});

export const listarClientesSchema = z.object({
  nome: z.string().optional(),
  tipo: z.enum(["PF", "PJ"]).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});
