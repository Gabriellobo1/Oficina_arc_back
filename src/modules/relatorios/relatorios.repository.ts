import { db } from "../../lib/db";

export const relatoriosRepository = {
  async receitaMensal() {
    const { rows } = await db.query(
      `SELECT
         to_char(a."aberturaEm", 'YYYY-MM')              AS mes,
         COUNT(p.id)                                     AS total_os,
         SUM(p.valor_total)                              AS receita_total,
         AVG(p.valor_total)                              AS ticket_medio
       FROM "Agendamento" a
       INNER JOIN "Pagamento" p ON p."agendamentoId" = a.id
       WHERE a.status = 'CONCLUIDO'
         AND a."aberturaEm" >= now() - interval '12 months'
       GROUP BY to_char(a."aberturaEm", 'YYYY-MM')
       ORDER BY mes DESC`
    );
    return rows;
  },

  async rankingServicos() {
    const { rows } = await db.query(
      `SELECT
         ts.nome,
         COUNT(i.id)                                        AS total_execucoes,
         SUM(i.quantidade * i.preco_unitario - i.desconto)  AS faturamento_total
       FROM "ItemServico" i
       INNER JOIN "TipoServico" ts ON ts.id = i."tipoServicoId"
       INNER JOIN "Agendamento"  a ON a.id  = i."agendamentoId"
       WHERE a.status = 'CONCLUIDO'
       GROUP BY ts.id, ts.nome
       ORDER BY total_execucoes DESC
       LIMIT 10`
    );
    return rows;
  },

  async rankingFuncionarios() {
    const { rows } = await db.query(
      `SELECT
         f.nome,
         f.cargo,
         COUNT(DISTINCT i."agendamentoId")                  AS total_os,
         SUM(i.quantidade * i.preco_unitario - i.desconto)  AS faturamento_gerado
       FROM "ItemServico" i
       INNER JOIN "Funcionario" f ON f.id = i."funcionarioId"
       INNER JOIN "Agendamento"  a ON a.id = i."agendamentoId"
       WHERE a.status = 'CONCLUIDO'
       GROUP BY f.id, f.nome, f.cargo
       ORDER BY faturamento_gerado DESC`
    );
    return rows;
  },

  async notaMediaPorFuncionario() {
    const { rows } = await db.query(
      `SELECT
         f.nome,
         f.cargo,
         COUNT(av.id)  AS total_avaliacoes,
         AVG(av.nota)  AS nota_media
       FROM "Avaliacao" av
       INNER JOIN "Agendamento"  a ON a.id  = av."agendamentoId"
       INNER JOIN "ItemServico"  i ON i."agendamentoId" = a.id
       INNER JOIN "Funcionario"  f ON f.id  = i."funcionarioId"
       GROUP BY f.id, f.nome, f.cargo
       ORDER BY nota_media DESC`
    );
    return rows;
  },
};
