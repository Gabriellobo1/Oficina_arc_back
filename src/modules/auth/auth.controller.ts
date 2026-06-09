import { FastifyRequest, FastifyReply } from "fastify";
import { loginSchema } from "./auth.schema";
import { authService } from "./auth.service";

export const authController = {
  async login(req: FastifyRequest, reply: FastifyReply) {
    const { email, senha } = loginSchema.parse(req.body);
    const payload = await authService.login(email, senha);
    const token = await reply.jwtSign(payload);
    const refresh = await reply.jwtSign(payload, { expiresIn: "30d" });
    return reply.status(200).send({ token, refresh, perfil: payload.perfil });
  },

  async refresh(req: FastifyRequest, reply: FastifyReply) {
    await req.jwtVerify();
    const token = await reply.jwtSign({
      id: req.user.id,
      email: req.user.email,
      perfil: req.user.perfil,
    });
    return reply.status(200).send({ token });
  },
};
