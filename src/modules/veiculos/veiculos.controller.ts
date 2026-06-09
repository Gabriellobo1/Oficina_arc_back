import { FastifyRequest, FastifyReply } from "fastify";
import { criarVeiculoSchema } from "./veiculos.schema";
import { veiculosService } from "./veiculos.service";

export const veiculosController = {
  async criar(req: FastifyRequest, reply: FastifyReply) {
    const data = criarVeiculoSchema.parse(req.body);
    return reply.status(201).send(await veiculosService.criar(data));
  },

  async buscarPorPlaca(req: FastifyRequest<{ Params: { placa: string } }>, reply: FastifyReply) {
    return reply.send(await veiculosService.buscarPorPlaca(req.params.placa));
  },
};
