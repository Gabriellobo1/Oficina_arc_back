import { FastifyInstance } from "fastify";
import { pecasController } from "./pecas.controller";
import { authenticate, authorizeGerente } from "../../middlewares/auth.middleware";

export async function pecasRoutes(app: FastifyInstance) {
  app.get("/abaixo-estoque-minimo", { preHandler: [authenticate] }, pecasController.abaixoDoMinimo);
  app.get("/", { preHandler: [authenticate] }, pecasController.listar);
  app.post("/", { preHandler: [authorizeGerente] }, pecasController.criar);
}
