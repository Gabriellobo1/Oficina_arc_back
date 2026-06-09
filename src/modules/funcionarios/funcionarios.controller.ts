import { FastifyRequest, FastifyReply } from "fastify";
import { criarFuncionarioSchema } from "./funcionarios.schema";
import { funcionariosService } from "./funcionarios.service";

export const funcionariosController = {
  async criar(req: FastifyRequest, reply: FastifyReply) {
    const data = criarFuncionarioSchema.parse(req.body);
    return reply.status(201).send(await funcionariosService.criar(data));
  },

  async listar(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await funcionariosService.listar());
  },

  async buscarPorId(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    return reply.send(await funcionariosService.buscarPorId(req.params.id));
  },
};
