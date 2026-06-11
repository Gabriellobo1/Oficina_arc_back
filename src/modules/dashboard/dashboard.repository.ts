import { db } from "../../lib/db";

export const dashboardRepository = {
  async contarClientes() {
    const { rows } = await db.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM "Cliente"`
    );
    return rows[0].total;
  },

  async osPorStatus() {
    const { rows } = await db.query<{ status: string; count: number }>(
      `SELECT status, COUNT(*)::int AS count FROM "Agendamento" GROUP BY status`
    );
    return rows;
  },

  async somaPagamentos(inicio: Date, fim?: Date) {
    const filtro = fim ? `"criadoEm" >= $1 AND "criadoEm" <= $2` : `"criadoEm" >= $1`;
    const params = fim ? [inicio, fim] : [inicio];
    const { rows } = await db.query<{ soma: number; total: number }>(
      `SELECT COALESCE(SUM(valor_total), 0) AS soma, COUNT(id)::int AS total
       FROM "Pagamento"
       WHERE ${filtro}`,
      params
    );
    return rows[0];
  },

  async mediaNota() {
    const { rows } = await db.query<{ media: number | null }>(
      `SELECT AVG(nota) AS media FROM "Avaliacao"`
    );
    return rows[0].media;
  },

  async osRecentes() {
    const { rows } = await db.query(
      `SELECT a.id, a.status, a."aberturaEm",
              c.nome  AS cliente_nome,
              v.marca AS veiculo_marca,
              v.modelo AS veiculo_modelo,
              p.valor_total AS pagamento_valor
       FROM "Agendamento" a
       JOIN "Veiculo" v   ON v.id = a."veiculoId"
       JOIN "Cliente" c   ON c.id = v."clienteId"
       LEFT JOIN "Pagamento" p ON p."agendamentoId" = a.id
       ORDER BY a."criadoEm" DESC
       LIMIT 5`
    );
    return rows;
  },

  async contarPecasAbaixoMinimo() {
    const { rows } = await db.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM "Peca" WHERE quantidade < quantidade_minima`
    );
    return rows[0].total;
  },
};
