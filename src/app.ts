import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { ZodError } from "zod";
import { env } from "./lib/env";
import { AppError } from "./lib/AppError";
import { authRoutes } from "./modules/auth/auth.routes";
import { clientesRoutes } from "./modules/clientes/clientes.routes";
import { veiculosRoutes } from "./modules/veiculos/veiculos.routes";
import { funcionariosRoutes } from "./modules/funcionarios/funcionarios.routes";
import { agendamentosRoutes } from "./modules/agendamentos/agendamentos.routes";
import { pecasRoutes } from "./modules/pecas/pecas.routes";
import { relatoriosRoutes } from "./modules/relatorios/relatorios.routes";

export const app = Fastify({ logger: env.NODE_ENV === "development" });

app.register(cors, {
  origin: env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: env.JWT_EXPIRES_IN },
});

app.register(swagger, {
  openapi: {
    info: {
      title: "Oficina Mecânica API",
      description: "API REST para sistema de agendamento de manutenção veicular",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
});

app.register(swaggerUi, { routePrefix: "/api/docs" });

app.register(authRoutes, { prefix: "/api/auth" });
app.register(clientesRoutes, { prefix: "/api/clientes" });
app.register(veiculosRoutes, { prefix: "/api/veiculos" });
app.register(funcionariosRoutes, { prefix: "/api/funcionarios" });
app.register(agendamentosRoutes, { prefix: "/api/agendamentos" });
app.register(pecasRoutes, { prefix: "/api/pecas" });
app.register(relatoriosRoutes, { prefix: "/api/relatorios" });

app.setErrorHandler((error, _req, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }
  if (error instanceof ZodError) {
    return reply.status(422).send({
      message: "Dados inválidos",
      errors: error.flatten().fieldErrors,
    });
  }
  app.log.error(error);
  return reply.status(500).send({ message: "Erro interno do servidor" });
});
