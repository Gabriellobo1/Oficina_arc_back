import { FastifyInstance } from "fastify";
import { veiculosController } from "./veiculos.controller";
import { authenticate } from "../../middlewares/auth.middleware";

export async function veiculosRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);
  app.post("/", veiculosController.criar);
  app.get("/", veiculosController.listarPorCliente);
  app.get("/:placa", veiculosController.buscarPorPlaca);
  app.put("/:id", veiculosController.atualizar);
  app.delete("/:id", veiculosController.remover);
}
