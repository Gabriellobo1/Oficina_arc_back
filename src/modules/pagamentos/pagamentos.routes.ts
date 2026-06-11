import { FastifyInstance } from "fastify";
import { db } from "../../lib/db";
import { authenticate } from "../../middlewares/auth.middleware";

export async function pagamentosRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  app.get("/", async (_req, reply) => {
    const { rows } = await db.query(
      `SELECT p.id,
              p."agendamentoId",
              p.valor_total,
              p.forma_pagamento,
              p.parcelas,
              p.status,
              p."criadoEm",
              a.status AS agendamento_status,
              v.placa  AS veiculo_placa,
              v.marca  AS veiculo_marca,
              v.modelo AS veiculo_modelo,
              c.nome   AS cliente_nome
       FROM "Pagamento" p
       JOIN "Agendamento" a ON a.id = p."agendamentoId"
       JOIN "Veiculo" v     ON v.id = a."veiculoId"
       JOIN "Cliente" c     ON c.id = v."clienteId"
       ORDER BY p."criadoEm" DESC`
    );
    return reply.send(rows);
  });
}
