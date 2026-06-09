import { FastifyRequest, FastifyReply } from "fastify";
import { criarPecaSchema, atualizarPecaSchema } from "./pecas.schema";
import { pecasService } from "./pecas.service";

export const pecasController = {
  async criar(req: FastifyRequest, reply: FastifyReply) {
    const data = criarPecaSchema.parse(req.body);
    return reply.status(201).send(await pecasService.criar(data));
  },

  async listar(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await pecasService.listar());
  },

  async atualizar(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = atualizarPecaSchema.parse(req.body);
    return reply.send(await pecasService.atualizar(req.params.id, data));
  },

  async abaixoDoMinimo(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await pecasService.abaixoDoMinimo());
  },
};
