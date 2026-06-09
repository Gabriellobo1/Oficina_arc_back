import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { criarTipoServicoSchema, atualizarTipoServicoSchema } from "./tipo-servico.schema";

type CriarDto = z.infer<typeof criarTipoServicoSchema>;
type AtualizarDto = z.infer<typeof atualizarTipoServicoSchema>;

export const tipoServicoService = {
  async criar(data: CriarDto) {
    try {
      return await prisma.tipoServico.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("Já existe um serviço com esse nome", 409);
      }
      throw error;
    }
  },

  async listar() {
    return prisma.tipoServico.findMany({ orderBy: { nome: "asc" } });
  },

  async buscarPorId(id: string) {
    const tipoServico = await prisma.tipoServico.findUnique({ where: { id } });
    if (!tipoServico) throw new AppError("Tipo de serviço não encontrado", 404);
    return tipoServico;
  },

  async atualizar(id: string, data: AtualizarDto) {
    await this.buscarPorId(id);
    try {
      return await prisma.tipoServico.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("Já existe um serviço com esse nome", 409);
      }
      throw error;
    }
  },

  async deletar(id: string) {
    await this.buscarPorId(id);
    try {
      await prisma.tipoServico.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        throw new AppError("Serviço está vinculado a ordens de serviço e não pode ser removido", 409);
      }
      throw error;
    }
  },
};
