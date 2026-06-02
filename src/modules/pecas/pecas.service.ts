import { prisma } from "../../lib/prisma";
import { z } from "zod";
import { criarPecaSchema } from "./pecas.schema";

type CriarPecaDto = z.infer<typeof criarPecaSchema>;

export const pecasService = {
  async criar(data: CriarPecaDto) {
    return prisma.peca.create({ data });
  },

  async listar() {
    return prisma.peca.findMany({ orderBy: { nome: "asc" } });
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
