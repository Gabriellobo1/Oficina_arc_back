import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { criarClienteSchema, atualizarClienteSchema } from "./clientes.schema";

type CriarClienteDto = z.infer<typeof criarClienteSchema>;
type AtualizarClienteDto = z.infer<typeof atualizarClienteSchema>;

export const clientesService = {
  async criar(data: CriarClienteDto) {
    try {
      return await prisma.cliente.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("E-mail, CPF ou CNPJ já cadastrado", 409);
      }
      throw error;
    }
  },

  async buscarPorId(id: string) {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: { veiculos: true },
    });
    if (!cliente) throw new AppError("Cliente não encontrado", 404);
    return cliente;
  },

  async listar(page: number, limit: number, nome?: string, tipo?: string) {
    const where: Prisma.ClienteWhereInput = {
      ...(nome && { nome: { contains: nome } }),
      ...(tipo && { tipo }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.cliente.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { criadoEm: "desc" },
      }),
      prisma.cliente.count({ where }),
    ]);

    return { data, meta: { page, limit, total, hasNextPage: page * limit < total } };
  },

  async atualizar(id: string, data: AtualizarClienteDto) {
    await this.buscarPorId(id);
    return prisma.cliente.update({ where: { id }, data });
  },
};
