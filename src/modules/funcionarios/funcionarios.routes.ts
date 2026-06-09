import { FastifyInstance } from "fastify";
import { funcionariosController } from "./funcionarios.controller";
import { authenticate, authorizeGerente } from "../../middlewares/auth.middleware";

export async function funcionariosRoutes(app: FastifyInstance) {
  // Leitura acessível por qualquer usuário autenticado (ServicesTab precisa listar funcionários)
  app.get("/", { preHandler: [authenticate] }, funcionariosController.listar);
  app.get("/:id", { preHandler: [authenticate] }, funcionariosController.buscarPorId);

  // Escrita restrita ao Gerente
  app.post("/", { preHandler: [authorizeGerente] }, funcionariosController.criar);
  app.put("/:id", { preHandler: [authorizeGerente] }, funcionariosController.atualizar);
}
