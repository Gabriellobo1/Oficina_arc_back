import { db } from "../../lib/db";
import { buildUpdateSet } from "../../lib/sql";

type CriarPecaData = {
  nome: string;
  descricao?: string;
  preco_unitario: number;
  quantidade: number;
  quantidade_minima: number;
  fornecedor?: string;
};

export type PecaRow = {
  id: string;
  nome: string;
  descricao: string | null;
  preco_unitario: number;
  quantidade: number;
  quantidade_minima: number;
  fornecedor: string | null;
  criadoEm: Date;
};

export const pecasRepository = {
  async criar(data: CriarPecaData) {
    const { rows } = await db.query(
      `INSERT INTO "Peca" (nome, descricao, preco_unitario, quantidade, quantidade_minima, fornecedor)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.nome, data.descricao ?? null, data.preco_unitario, data.quantidade, data.quantidade_minima, data.fornecedor ?? null]
    );
    return rows[0];
  },

  async listar() {
    const { rows } = await db.query(`SELECT * FROM "Peca" ORDER BY nome ASC`);
    return rows;
  },

  async buscarPorId(id: string) {
    const { rows } = await db.query<PecaRow>(`SELECT * FROM "Peca" WHERE id = $1`, [id]);
    return rows[0] ?? null;
  },

  async atualizar(id: string, data: Record<string, unknown>) {
    const { clause, values, nextIndex, isEmpty } = buildUpdateSet(data);
    if (isEmpty) return this.buscarPorId(id);
    const { rows } = await db.query(
      `UPDATE "Peca" SET ${clause} WHERE id = $${nextIndex} RETURNING *`,
      [...values, id]
    );
    return rows[0];
  },

  async abaixoDoMinimo() {
    const { rows } = await db.query(
      `SELECT id, nome, fornecedor, quantidade, quantidade_minima,
              (quantidade_minima - quantidade) AS deficit
       FROM "Peca"
       WHERE quantidade < quantidade_minima
       ORDER BY deficit DESC`
    );
    return rows;
  },
};
