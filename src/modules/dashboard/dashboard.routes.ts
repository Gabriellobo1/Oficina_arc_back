import { FastifyInstance } from "fastify";
import { dashboardController } from "./dashboard.controller";
import { authenticate } from "../../middlewares/auth.middleware";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [authenticate] }, dashboardController.obterKpis);
}
