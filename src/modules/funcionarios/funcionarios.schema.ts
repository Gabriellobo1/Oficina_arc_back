import { z } from "zod";

export const criarFuncionarioSchema = z.object({
  nome: z.string().min(2),
  cargo: z.string().min(2),
  especialidade: z.string().optional(),
  salario: z.number().positive(),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
});
