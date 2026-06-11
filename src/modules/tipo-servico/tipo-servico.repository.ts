import { db } from "../../lib/db";
import { buildUpdateSet } from "../../lib/sql";

type CriarTipoServicoData = {
  nome: string;
  descricao?: string;
  preco_base: number;
  tempo_estimado: number;
};

export const tipoServicoRepository = {
  async criar(data: CriarTipoServicoData) {
    const { rows } = await db.query(
      `INSERT INTO "TipoServico" (nome, descricao, preco_base, tempo_estimado)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.nome, data.descricao ?? null, data.preco_base, data.tempo_estimado]
    );
    return rows[0];
  },

  async listar() {
    const { rows } = await db.query(`SELECT * FROM "TipoServico" ORDER BY nome ASC`);
    return rows;
  },

  async buscarPorId(id: string) {
    const { rows } = await db.query(`SELECT * FROM "TipoServico" WHERE id = $1`, [id]);
    return rows[0] ?? null;
  },

  async atualizar(id: string, data: Record<string, unknown>) {
    const { clause, values, nextIndex, isEmpty } = buildUpdateSet(data);
    if (isEmpty) return this.buscarPorId(id);
    const { rows } = await db.query(
      `UPDATE "TipoServico" SET ${clause} WHERE id = $${nextIndex} RETURNING *`,
      [...values, id]
    );
    return rows[0];
  },

  async deletar(id: string) {
    await db.query(`DELETE FROM "TipoServico" WHERE id = $1`, [id]);
  },
};
