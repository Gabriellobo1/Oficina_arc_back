import { db } from "../../lib/db";
import { buildUpdateSet } from "../../lib/sql";

type CriarClienteData = {
  nome: string;
  email: string;
  telefone?: string;
  tipo: string;
  cpf?: string;
  cnpj?: string;
  endereco?: string;
};

export const clientesRepository = {
  async criar(data: CriarClienteData) {
    const { rows } = await db.query(
      `INSERT INTO "Cliente" (nome, email, telefone, tipo, cpf, cnpj, endereco)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.nome, data.email, data.telefone ?? null, data.tipo, data.cpf ?? null, data.cnpj ?? null, data.endereco ?? null]
    );
    return rows[0];
  },

  async buscarPorId(id: string) {
    const { rows } = await db.query(`SELECT * FROM "Cliente" WHERE id = $1`, [id]);
    const cliente = rows[0];
    if (!cliente) return null;
    const { rows: veiculos } = await db.query(
      `SELECT * FROM "Veiculo" WHERE "clienteId" = $1 ORDER BY "criadoEm" DESC`,
      [id]
    );
    cliente.veiculos = veiculos;
    return cliente;
  },

  async listar(page: number, limit: number, nome?: string, tipo?: string) {
    const filtros: string[] = [];
    const params: unknown[] = [];

    if (nome) {
      params.push(`%${nome}%`);
      filtros.push(`nome ILIKE $${params.length}`);
    }
    if (tipo) {
      params.push(tipo);
      filtros.push(`tipo = $${params.length}`);
    }
    const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";

    const { rows: totalRows } = await db.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM "Cliente" ${where}`,
      params
    );
    const total = totalRows[0].total;

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;
    const { rows: data } = await db.query(
      `SELECT * FROM "Cliente" ${where}
       ORDER BY "criadoEm" DESC
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      [...params, limit, (page - 1) * limit]
    );

    return { data, total };
  },

  async atualizar(id: string, data: Record<string, unknown>) {
    const { clause, values, nextIndex, isEmpty } = buildUpdateSet(data);
    if (isEmpty) return this.buscarPorId(id);
    const { rows } = await db.query(
      `UPDATE "Cliente" SET ${clause} WHERE id = $${nextIndex} RETURNING *`,
      [...values, id]
    );
    return rows[0];
  },
};
