import { FastifyRequest, FastifyReply } from "fastify";
import {
  criarAgendamentoSchema,
  atualizarStatusSchema,
  listarAgendamentosSchema,
  adicionarItemServicoSchema,
  adicionarItemPecaSchema,
  registrarPagamentoSchema,
  registrarAvaliacaoSchema,
} from "./agendamentos.schema";
import { agendamentosService } from "./agendamentos.service";

type Params = { id: string };

export const agendamentosController = {
  async criar(req: FastifyRequest, reply: FastifyReply) {
    const data = criarAgendamentoSchema.parse(req.body);
    return reply.status(201).send(await agendamentosService.criar(data));
  },

  async atualizarStatus(req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    const data = atualizarStatusSchema.parse(req.body);
    return reply.send(await agendamentosService.atualizarStatus(req.params.id, data));
  },

  async listar(req: FastifyRequest, reply: FastifyReply) {
    const { page, limit, status, data } = listarAgendamentosSchema.parse(req.query);
    return reply.send(await agendamentosService.listar(page, limit, status, data));
  },

  async buscarPorId(req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    return reply.send(await agendamentosService.buscarPorId(req.params.id));
  },

  async adicionarItemServico(req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    const data = adicionarItemServicoSchema.parse(req.body);
    return reply.status(201).send(await agendamentosService.adicionarItemServico(req.params.id, data));
  },

  async adicionarItemPeca(req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    const data = adicionarItemPecaSchema.parse(req.body);
    return reply.status(201).send(await agendamentosService.adicionarItemPeca(req.params.id, data));
  },

  async registrarPagamento(req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    const data = registrarPagamentoSchema.parse(req.body);
    return reply.status(201).send(await agendamentosService.registrarPagamento(req.params.id, data));
  },

  async registrarAvaliacao(req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    const data = registrarAvaliacaoSchema.parse(req.body);
    return reply.status(201).send(await agendamentosService.registrarAvaliacao(req.params.id, data));
  },
};
