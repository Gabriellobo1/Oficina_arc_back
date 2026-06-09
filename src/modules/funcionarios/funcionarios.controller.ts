import { FastifyRequest, FastifyReply } from "fastify";
import { criarFuncionarioSchema, atualizarFuncionarioSchema } from "./funcionarios.schema";
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

  async atualizar(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = atualizarFuncionarioSchema.parse(req.body);
    return reply.send(await funcionariosService.atualizar(req.params.id, data));
  },
};
