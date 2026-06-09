import { FastifyRequest, FastifyReply } from "fastify";
import { dashboardService } from "./dashboard.service";

export const dashboardController = {
  async obterKpis(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await dashboardService.obterKpis());
  },
};
