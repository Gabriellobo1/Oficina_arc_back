import { FastifyRequest, FastifyReply } from "fastify";
import { relatoriosService } from "./relatorios.service";

export const relatoriosController = {
  async receitaMensal(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await relatoriosService.receitaMensal());
  },

  async rankingServicos(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await relatoriosService.rankingServicos());
  },

  async rankingFuncionarios(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await relatoriosService.rankingFuncionarios());
  },

  async notaMediaPorFuncionario(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await relatoriosService.notaMediaPorFuncionario());
  },
};
