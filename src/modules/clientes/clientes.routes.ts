import { FastifyInstance } from "fastify";
import { clientesController } from "./clientes.controller";
import { authenticate } from "../../middlewares/auth.middleware";

export async function clientesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);
  app.post("/", clientesController.criar);
  app.get("/", clientesController.listar);
  app.get("/:id", clientesController.buscarPorId);
  app.put("/:id", clientesController.atualizar);
}
