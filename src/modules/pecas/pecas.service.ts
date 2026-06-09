import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";
import { z } from "zod";
import { criarPecaSchema, atualizarPecaSchema } from "./pecas.schema";

type CriarPecaDto = z.infer<typeof criarPecaSchema>;
type AtualizarPecaDto = z.infer<typeof atualizarPecaSchema>;

export const pecasService = {
  async criar(data: CriarPecaDto) {
    return prisma.peca.create({ data });
  },

  async listar() {
    return prisma.peca.findMany({ orderBy: { nome: "asc" } });
  },

  async atualizar(id: string, data: AtualizarPecaDto) {
    const peca = await prisma.peca.findUnique({ where: { id } });
    if (!peca) throw new AppError("Peça não encontrada", 404);
    return prisma.peca.update({ where: { id }, data });
  },

  async abaixoDoMinimo() {
    return prisma.$queryRaw`
      SELECT id, nome, fornecedor, quantidade, quantidade_minima,
             (quantidade_minima - quantidade) as deficit
      FROM "Peca"
      WHERE quantidade < quantidade_minima
      ORDER BY deficit DESC
    `;
  },
};
