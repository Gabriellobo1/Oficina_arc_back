import { FastifyInstance } from "fastify";
import { funcionariosController } from "./funcionarios.controller";
import { authorizeGerente } from "../../middlewares/auth.middleware";

export async function funcionariosRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authorizeGerente);
  app.post("/", funcionariosController.criar);
  app.get("/", funcionariosController.listar);
  app.get("/:id", funcionariosController.buscarPorId);
}
