import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { criarVeiculoSchema } from "./veiculos.schema";

type CriarVeiculoDto = z.infer<typeof criarVeiculoSchema>;

export const veiculosService = {
  async criar(data: CriarVeiculoDto) {
    try {
      return await prisma.veiculo.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("Placa já cadastrada", 409);
      }
      throw error;
    }
  },

  async buscarPorPlaca(placa: string) {
    const veiculo = await prisma.veiculo.findUnique({
      where: { placa: placa.toUpperCase() },
      include: {
        cliente: { select: { id: true, nome: true } },
        agendamentos: {
          orderBy: { criadoEm: "desc" },
          take: 10,
          select: { id: true, status: true, aberturaEm: true, km_entrada: true },
        },
      },
    });
    if (!veiculo) throw new AppError("Veículo não encontrado", 404);
    return veiculo;
  },
};
