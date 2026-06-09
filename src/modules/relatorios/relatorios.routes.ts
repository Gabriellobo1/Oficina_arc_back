import { FastifyInstance } from "fastify";
import { relatoriosController } from "./relatorios.controller";
import { authorizeGerente } from "../../middlewares/auth.middleware";

export async function relatoriosRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authorizeGerente);
  app.get("/receita-mensal", relatoriosController.receitaMensal);
  app.get("/ranking-servicos", relatoriosController.rankingServicos);
  app.get("/ranking-funcionarios", relatoriosController.rankingFuncionarios);
  app.get("/nota-media-funcionarios", relatoriosController.notaMediaPorFuncionario);
}
