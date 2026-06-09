import { FastifyRequest, FastifyReply } from "fastify";
import { criarClienteSchema, atualizarClienteSchema, listarClientesSchema } from "./clientes.schema";
import { clientesService } from "./clientes.service";

export const clientesController = {
  async criar(req: FastifyRequest, reply: FastifyReply) {
    const data = criarClienteSchema.parse(req.body);
    return reply.status(201).send(await clientesService.criar(data));
  },

  async buscarPorId(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    return reply.send(await clientesService.buscarPorId(req.params.id));
  },

  async listar(req: FastifyRequest, reply: FastifyReply) {
    const { page, limit, nome, tipo } = listarClientesSchema.parse(req.query);
    return reply.send(await clientesService.listar(page, limit, nome, tipo));
  },

  async atualizar(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = atualizarClienteSchema.parse(req.body);
    return reply.send(await clientesService.atualizar(req.params.id, data));
  },
};
