import { FastifyRequest, FastifyReply } from "fastify";
import { criarTipoServicoSchema, atualizarTipoServicoSchema } from "./tipo-servico.schema";
import { tipoServicoService } from "./tipo-servico.service";

type Params = { id: string };

export const tipoServicoController = {
  async criar(req: FastifyRequest, reply: FastifyReply) {
    const data = criarTipoServicoSchema.parse(req.body);
    return reply.status(201).send(await tipoServicoService.criar(data));
  },

  async listar(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await tipoServicoService.listar());
  },

  async buscarPorId(req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    return reply.send(await tipoServicoService.buscarPorId(req.params.id));
  },

  async atualizar(req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    const data = atualizarTipoServicoSchema.parse(req.body);
    return reply.send(await tipoServicoService.atualizar(req.params.id, data));
  },

  async deletar(req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    await tipoServicoService.deletar(req.params.id);
    return reply.status(204).send();
  },
};
