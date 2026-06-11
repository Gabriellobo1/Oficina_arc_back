import { FastifyRequest, FastifyReply } from "fastify";
import { criarVeiculoSchema, atualizarVeiculoSchema } from "./veiculos.schema";
import { veiculosService } from "./veiculos.service";

export const veiculosController = {
  async criar(req: FastifyRequest, reply: FastifyReply) {
    const data = criarVeiculoSchema.parse(req.body);
    return reply.status(201).send(await veiculosService.criar(data));
  },

  async listarPorCliente(
    req: FastifyRequest<{ Querystring: { clienteId: string } }>,
    reply: FastifyReply
  ) {
    const { clienteId } = req.query;
    if (clienteId) {
      return reply.send(await veiculosService.listarPorCliente(clienteId));
    }
    return reply.send(await veiculosService.listarTodos());
  },

  async buscarPorPlaca(req: FastifyRequest<{ Params: { placa: string } }>, reply: FastifyReply) {
    return reply.send(await veiculosService.buscarPorPlaca(req.params.placa));
  },

  async atualizar(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = atualizarVeiculoSchema.parse(req.body);
    return reply.send(await veiculosService.atualizar(req.params.id, data));
  },

  async remover(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await veiculosService.remover(req.params.id);
    return reply.status(204).send();
  },
};
