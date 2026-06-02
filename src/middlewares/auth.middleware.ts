import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../lib/AppError";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}

export async function authorizeGerente(req: FastifyRequest, reply: FastifyReply) {
  await authenticate(req, reply);
  if (req.user.perfil !== "GERENTE") {
    throw new AppError("Acesso negado", 403);
  }
}
