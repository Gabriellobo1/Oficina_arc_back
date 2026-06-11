import { FastifyInstance } from "fastify";
import { db } from "../../lib/db";
import { authenticate } from "../../middlewares/auth.middleware";

export async function avaliacoesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  app.get("/", async (_req, reply) => {
    const { rows } = await db.query(
      `SELECT av.id,
              av."agendamentoId",
              av.nota,
              av.comentario,
              av."criadoEm",
              v.placa  AS veiculo_placa,
              v.marca  AS veiculo_marca,
              v.modelo AS veiculo_modelo,
              c.nome   AS cliente_nome
       FROM "Avaliacao" av
       JOIN "Agendamento" a ON a.id = av."agendamentoId"
       JOIN "Veiculo" v     ON v.id = a."veiculoId"
       JOIN "Cliente" c     ON c.id = v."clienteId"
       ORDER BY av."criadoEm" DESC`
    );
    return reply.send(rows);
  });
}
