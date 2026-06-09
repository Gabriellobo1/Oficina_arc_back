import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";
import bcrypt from "bcryptjs";

export const authService = {
  async login(email: string, senha: string) {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new AppError("Credenciais inválidas", 401);

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) throw new AppError("Credenciais inválidas", 401);

    return { id: usuario.id, email: usuario.email, perfil: usuario.perfil };
  },
};
