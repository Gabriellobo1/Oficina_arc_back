import { FastifyInstance } from "fastify";
import { authController } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", authController.login);
  app.post("/refresh", { preHandler: [authenticate] }, authController.refresh);
}
