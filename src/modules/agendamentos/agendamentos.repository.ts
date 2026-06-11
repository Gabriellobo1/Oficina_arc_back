import { db } from "../../lib/db";
import { buildUpdateSet } from "../../lib/sql";

type CriarData = {
  veiculoId: string;
  km_entrada: number;
  aberturaEm?: Date;
  observacoes?: string;
};

type ItemServicoData = {
  tipoServicoId: string;
  funcionarioId: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
};

type ItemPecaData = {
  pecaId: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
};

type PagamentoData = {
  valor_total: number;
  forma_pagamento: string;
  parcelas: number;
};

type AvaliacaoData = { nota: number; comentario?: string };

export type AgendamentoRow = {
  id: string;
  veiculoId: string;
  status: string;
  km_entrada: number;
  km_saida: number | null;
  aberturaEm: Date;
  conclusaoEm: Date | null;
  observacoes: string | null;
  criadoEm: Date;
};

export const agendamentosRepository = {
  async criar(data: CriarData) {
    const { rows } = await db.query(
      `INSERT INTO "Agendamento" ("veiculoId", km_entrada, "aberturaEm", observacoes)
       VALUES ($1, $2, COALESCE($3, now()), $4)
       RETURNING *`,
      [data.veiculoId, data.km_entrada, data.aberturaEm ?? null, data.observacoes ?? null]
    );
    return rows[0];
  },

  async buscarPorId(id: string) {
    const { rows } = await db.query<AgendamentoRow>(`SELECT * FROM "Agendamento" WHERE id = $1`, [id]);
    return rows[0] ?? null;
  },

  async atualizarStatus(id: string, fields: Record<string, unknown>) {
    const { clause, values, nextIndex } = buildUpdateSet(fields);
    const { rows } = await db.query(
      `UPDATE "Agendamento" SET ${clause} WHERE id = $${nextIndex} RETURNING *`,
      [...values, id]
    );
    return rows[0];
  },

  async listar(page: number, limit: number, status?: string, data?: string) {
    const filtros: string[] = [];
    const params: unknown[] = [];

    if (status) {
      params.push(status);
      filtros.push(`a.status = $${params.length}`);
    }
    if (data) {
      const inicio = new Date(data);
      const fim = new Date(new Date(data).setDate(inicio.getDate() + 1));
      params.push(inicio);
      filtros.push(`a."aberturaEm" >= $${params.length}`);
      params.push(fim);
      filtros.push(`a."aberturaEm" < $${params.length}`);
    }
    const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";

    const { rows: totalRows } = await db.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM "Agendamento" a ${where}`,
      params
    );
    const total = totalRows[0].total;

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;
    const { rows } = await db.query(
      `SELECT a.*,
              v.placa AS veiculo_placa,
              v.modelo AS veiculo_modelo,
              (SELECT COUNT(*)::int FROM "ItemServico" WHERE "agendamentoId" = a.id) AS count_servico,
              (SELECT COUNT(*)::int FROM "ItemPeca"    WHERE "agendamentoId" = a.id) AS count_peca
       FROM "Agendamento" a
       JOIN "Veiculo" v ON v.id = a."veiculoId"
       ${where}
       ORDER BY a."criadoEm" DESC
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      [...params, limit, (page - 1) * limit]
    );

    const data_ = rows.map((row) => {
      const { veiculo_placa, veiculo_modelo, count_servico, count_peca, ...agendamento } = row;
      return {
        ...agendamento,
        veiculo: { placa: veiculo_placa, modelo: veiculo_modelo },
        _count: { itensServico: count_servico, itensPeca: count_peca },
      };
    });

    return { data: data_, total };
  },

  async buscarCompleto(id: string) {
    const base = await this.buscarPorId(id);
    if (!base) return null;
    const agendamento: Record<string, unknown> = { ...base };

    const { rows: veiculoRows } = await db.query(
      `SELECT v.*, to_jsonb(c.*) AS cliente
       FROM "Veiculo" v
       JOIN "Cliente" c ON c.id = v."clienteId"
       WHERE v.id = $1`,
      [base.veiculoId]
    );
    agendamento.veiculo = veiculoRows[0] ?? null;

    const { rows: itensServico } = await db.query(
      `SELECT i.*, to_jsonb(ts.*) AS "tipoServico", to_jsonb(f.*) AS funcionario
       FROM "ItemServico" i
       JOIN "TipoServico" ts ON ts.id = i."tipoServicoId"
       JOIN "Funcionario" f  ON f.id  = i."funcionarioId"
       WHERE i."agendamentoId" = $1
       ORDER BY i."criadoEm" ASC`,
      [id]
    );
    agendamento.itensServico = itensServico;

    const { rows: itensPeca } = await db.query(
      `SELECT ip.*, to_jsonb(p.*) AS peca
       FROM "ItemPeca" ip
       JOIN "Peca" p ON p.id = ip."pecaId"
       WHERE ip."agendamentoId" = $1
       ORDER BY ip."criadoEm" ASC`,
      [id]
    );
    agendamento.itensPeca = itensPeca;

    const { rows: pagamento } = await db.query(
      `SELECT * FROM "Pagamento" WHERE "agendamentoId" = $1`,
      [id]
    );
    agendamento.pagamento = pagamento[0] ?? null;

    const { rows: avaliacao } = await db.query(
      `SELECT * FROM "Avaliacao" WHERE "agendamentoId" = $1`,
      [id]
    );
    agendamento.avaliacao = avaliacao[0] ?? null;

    return agendamento;
  },

  async adicionarItemServico(agendamentoId: string, data: ItemServicoData) {
    const { rows } = await db.query(
      `INSERT INTO "ItemServico"
         ("agendamentoId", "tipoServicoId", "funcionarioId", quantidade, preco_unitario, desconto)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [agendamentoId, data.tipoServicoId, data.funcionarioId, data.quantidade, data.preco_unitario, data.desconto]
    );
    return rows[0];
  },

  async adicionarItemPeca(agendamentoId: string, data: ItemPecaData) {
    return db.withTransaction(async (tx) => {
      const itemPeca = await tx(
        `INSERT INTO "ItemPeca"
           ("agendamentoId", "pecaId", quantidade, preco_unitario, desconto)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [agendamentoId, data.pecaId, data.quantidade, data.preco_unitario, data.desconto]
      );

      const peca = await tx(
        `UPDATE "Peca" SET quantidade = quantidade - $1 WHERE id = $2 RETURNING *`,
        [data.quantidade, data.pecaId]
      );

      return [itemPeca.rows[0], peca.rows[0]];
    });
  },

  async pagamentoExiste(agendamentoId: string) {
    const { rows } = await db.query(`SELECT 1 FROM "Pagamento" WHERE "agendamentoId" = $1`, [agendamentoId]);
    return rows.length > 0;
  },

  async criarPagamento(agendamentoId: string, data: PagamentoData) {
    const { rows } = await db.query(
      `INSERT INTO "Pagamento" ("agendamentoId", valor_total, forma_pagamento, parcelas)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [agendamentoId, data.valor_total, data.forma_pagamento, data.parcelas]
    );
    return rows[0];
  },

  async avaliacaoExiste(agendamentoId: string) {
    const { rows } = await db.query(`SELECT 1 FROM "Avaliacao" WHERE "agendamentoId" = $1`, [agendamentoId]);
    return rows.length > 0;
  },

  async criarAvaliacao(agendamentoId: string, data: AvaliacaoData) {
    const { rows } = await db.query(
      `INSERT INTO "Avaliacao" ("agendamentoId", nota, comentario)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [agendamentoId, data.nota, data.comentario ?? null]
    );
    return rows[0];
  },
};
