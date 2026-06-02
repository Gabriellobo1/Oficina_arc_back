import { FastifyInstance } from "fastify";
import { agendamentosController } from "./agendamentos.controller";
import { authenticate } from "../../middlewares/auth.middleware";

export async function agendamentosRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);
  app.post("/", agendamentosController.criar);
  app.get("/", agendamentosController.listar);
  app.get("/:id", agendamentosController.buscarPorId);
  app.patch("/:id/status", agendamentosController.atualizarStatus);
  app.post("/:id/itens-servico", agendamentosController.adicionarItemServico);
  app.post("/:id/itens-peca", agendamentosController.adicionarItemPeca);
  app.post("/:id/pagamento", agendamentosController.registrarPagamento);
  app.post("/:id/avaliacao", agendamentosController.registrarAvaliacao);
}
