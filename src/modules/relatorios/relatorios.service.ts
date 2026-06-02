import { prisma } from "../../lib/prisma";

export const relatoriosService = {
  async receitaMensal() {
    return prisma.$queryRaw`
      SELECT
        strftime('%Y-%m', a.aberturaEm) as mes,
        COUNT(p.id)                     as total_os,
        SUM(p.valor_total)              as receita_total,
        AVG(p.valor_total)              as ticket_medio
      FROM "Agendamento" a
      INNER JOIN "Pagamento" p ON p.agendamentoId = a.id
      WHERE a.status = 'CONCLUIDO'
        AND a.aberturaEm >= date('now', '-12 months')
      GROUP BY strftime('%Y-%m', a.aberturaEm)
      ORDER BY mes DESC
    `;
  },

  async rankingServicos() {
    return prisma.$queryRaw`
      SELECT
        ts.nome,
        COUNT(i.id)                                         as total_execucoes,
        SUM(i.quantidade * i.preco_unitario - i.desconto)  as faturamento_total
      FROM "ItemServico" i
      INNER JOIN "TipoServico" ts ON ts.id = i.tipoServicoId
      INNER JOIN "Agendamento" a  ON a.id  = i.agendamentoId
      WHERE a.status = 'CONCLUIDO'
      GROUP BY ts.id, ts.nome
      ORDER BY total_execucoes DESC
      LIMIT 10
    `;
  },

  async rankingFuncionarios() {
    return prisma.$queryRaw`
      SELECT
        f.nome,
        f.cargo,
        COUNT(DISTINCT i.agendamentoId)                    as total_os,
        SUM(i.quantidade * i.preco_unitario - i.desconto)  as faturamento_gerado
      FROM "ItemServico" i
      INNER JOIN "Funcionario" f ON f.id = i.funcionarioId
      INNER JOIN "Agendamento" a ON a.id = i.agendamentoId
      WHERE a.status = 'CONCLUIDO'
      GROUP BY f.id, f.nome, f.cargo
      ORDER BY faturamento_gerado DESC
    `;
  },

  async notaMediaPorFuncionario() {
    return prisma.$queryRaw`
      SELECT
        f.nome,
        f.cargo,
        COUNT(av.id)  as total_avaliacoes,
        AVG(av.nota)  as nota_media
      FROM "Avaliacao" av
      INNER JOIN "Agendamento" a  ON a.id  = av.agendamentoId
      INNER JOIN "ItemServico" i  ON i.agendamentoId = a.id
      INNER JOIN "Funcionario" f  ON f.id  = i.funcionarioId
      GROUP BY f.id, f.nome, f.cargo
      HAVING COUNT(av.id) >= 5
      ORDER BY nota_media DESC
    `;
  },
};
