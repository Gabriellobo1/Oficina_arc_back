import { z } from "zod";

export const criarFuncionarioSchema = z.object({
  nome: z.string().min(2),
  cargo: z.string().min(2),
  especialidade: z.string().optional(),
  salario: z.number().positive(),
  telefone: z.string().optional(),
  data_admissao: z.string().datetime({ offset: true }).optional(),
  ativo: z.boolean().default(true),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
});

export const atualizarFuncionarioSchema = criarFuncionarioSchema
  .omit({ email: true, senha: true })
  .partial();
