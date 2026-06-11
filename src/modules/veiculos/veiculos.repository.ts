import { db } from "../../lib/db";
import { buildUpdateSet } from "../../lib/sql";

type CriarVeiculoData = {
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor?: string;
  clienteId: string;
};

export const veiculosRepository = {
  async criar(data: CriarVeiculoData) {
    const { rows } = await db.query(
      `INSERT INTO "Veiculo" (placa, marca, modelo, ano, cor, "clienteId")
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.placa, data.marca, data.modelo, data.ano, data.cor ?? null, data.clienteId]
    );
    return rows[0];
  },

  async listarPorCliente(clienteId: string) {
    const { rows } = await db.query(
      `SELECT * FROM "Veiculo" WHERE "clienteId" = $1 ORDER BY "criadoEm" DESC`,
      [clienteId]
    );
    return rows;
  },

  async listarTodos() {
    const { rows } = await db.query(
      `SELECT v.*, c.nome AS cliente_nome, c.id AS cliente_id,
              (SELECT COUNT(*)::int FROM "Agendamento" WHERE "veiculoId" = v.id) AS total_agendamentos
       FROM "Veiculo" v
       JOIN "Cliente" c ON c.id = v."clienteId"
       ORDER BY v."criadoEm" DESC`
    );
    return rows;
  },

  async atualizar(id: string, data: Record<string, unknown>) {
    const { clause, values, nextIndex, isEmpty } = buildUpdateSet(data);
    if (isEmpty) {
      const { rows } = await db.query(`SELECT * FROM "Veiculo" WHERE id = $1`, [id]);
      return rows[0] ?? null;
    }
    const { rows } = await db.query(
      `UPDATE "Veiculo" SET ${clause} WHERE id = $${nextIndex} RETURNING *`,
      [...values, id]
    );
    return rows[0] ?? null;
  },

  async remover(id: string) {
    const { rowCount } = await db.query(`DELETE FROM "Veiculo" WHERE id = $1`, [id]);
    return (rowCount ?? 0) > 0;
  },

  async buscarPorPlaca(placa: string) {
    const { rows } = await db.query(`SELECT * FROM "Veiculo" WHERE placa = $1`, [placa]);
    const veiculo = rows[0];
    if (!veiculo) return null;

    const { rows: clienteRows } = await db.query(
      `SELECT id, nome FROM "Cliente" WHERE id = $1`,
      [veiculo.clienteId]
    );
    veiculo.cliente = clienteRows[0] ?? null;

    const { rows: agendamentos } = await db.query(
      `SELECT id, status, "aberturaEm", km_entrada
       FROM "Agendamento"
       WHERE "veiculoId" = $1
       ORDER BY "criadoEm" DESC
       LIMIT 10`,
      [veiculo.id]
    );
    veiculo.agendamentos = agendamentos;

    return veiculo;
  },
};
