import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { criarFuncionarioSchema } from "./funcionarios.schema";

type CriarDto = z.infer<typeof criarFuncionarioSchema>;

export const funcionariosService = {
  async criar(data: CriarDto) {
    const { email, senha, ...funcionarioData } = data;

    return prisma.$transaction(async (tx) => {
      let usuarioId: string | undefined;

      if (email && senha) {
        const existente = await tx.usuario.findUnique({ where: { email } });
        if (existente) throw new AppError("E-mail já cadastrado", 409);

        const senha_hash = await bcrypt.hash(senha, 10);
        const usuario = await tx.usuario.create({
          data: { email, senha_hash, perfil: "ATENDENTE" },
        });
        usuarioId = usuario.id;
      }

      return tx.funcionario.create({ data: { ...funcionarioData, usuarioId } });
    });
  },

  async listar() {
    return prisma.funcionario.findMany({
      include: { usuario: { select: { email: true, perfil: true } } },
      orderBy: { nome: "asc" },
    });
  },

  async buscarPorId(id: string) {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id },
      include: { usuario: { select: { email: true, perfil: true } } },
    });
    if (!funcionario) throw new AppError("Funcionário não encontrado", 404);
    return funcionario;
  },
};
