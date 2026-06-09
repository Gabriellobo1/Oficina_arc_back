import { FastifyInstance } from "fastify";
import { tipoServicoController } from "./tipo-servico.controller";
import { authenticate, authorizeGerente } from "../../middlewares/auth.middleware";

type Params = { Params: { id: string } };

export async function tipoServicoRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [authenticate] }, tipoServicoController.listar);
  app.post("/", { preHandler: [authorizeGerente] }, tipoServicoController.criar);
  app.get<Params>("/:id", { preHandler: [authenticate] }, tipoServicoController.buscarPorId);
  app.put<Params>("/:id", { preHandler: [authorizeGerente] }, tipoServicoController.atualizar);
  app.delete<Params>("/:id", { preHandler: [authorizeGerente] }, tipoServicoController.deletar);
}
