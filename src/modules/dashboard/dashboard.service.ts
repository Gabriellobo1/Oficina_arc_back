import { prisma } from "../../lib/prisma";

export const dashboardService = {
  async obterKpis() {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const inicioMesAnterior = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
    const fimMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0, 23, 59, 59);

    const [
      totalClientes,
      osPorStatus,
      pagamentosMes,
      pagamentosMesAnterior,
      notaMedia,
      osRecentes,
    ] = await prisma.$transaction([
      prisma.cliente.count(),

      prisma.agendamento.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      prisma.pagamento.aggregate({
        where: { criadoEm: { gte: inicioMes } },
        _sum: { valor_total: true },
        _count: { id: true },
      }),

      prisma.pagamento.aggregate({
        where: { criadoEm: { gte: inicioMesAnterior, lte: fimMesAnterior } },
        _sum: { valor_total: true },
      }),

      prisma.avaliacao.aggregate({
        _avg: { nota: true },
      }),

      prisma.agendamento.findMany({
        take: 5,
        orderBy: { criadoEm: "desc" },
        include: {
          veiculo: {
            select: {
              modelo: true,
              marca: true,
              cliente: { select: { nome: true } },
            },
          },
          pagamento: { select: { valor_total: true } },
        },
      }),
    ]);

    const pecasAbaixoMinimo = await prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(*) as total FROM "Peca" WHERE quantidade < quantidade_minima
    `;

    const receitaMes = Number(pagamentosMes._sum.valor_total ?? 0);
    const receitaMesAnterior = Number(pagamentosMesAnterior._sum.valor_total ?? 0);
    const variacaoReceita =
      receitaMesAnterior > 0
        ? ((receitaMes - receitaMesAnterior) / receitaMesAnterior) * 100
        : 0;

    const statusMap: Record<string, number> = {};
    for (const s of osPorStatus) {
      statusMap[s.status] = s._count.status;
    }

    return {
      totalClientes,
      osPorStatus: statusMap,
      osAbertas: (statusMap["AGENDADO"] ?? 0) + (statusMap["EM_ANDAMENTO"] ?? 0),
      receitaMes,
      receitaMesAnterior,
      variacaoReceita: Number(variacaoReceita.toFixed(1)),
      totalOsMes: pagamentosMes._count.id,
      pecasAbaixoMinimo: Number(pecasAbaixoMinimo[0]?.total ?? 0),
      notaMedia: notaMedia._avg.nota ? Number(notaMedia._avg.nota.toFixed(1)) : null,
      osRecentes: osRecentes.map((os) => ({
        id: os.id,
        status: os.status,
        clienteNome: os.veiculo.cliente.nome,
        veiculo: `${os.veiculo.marca} ${os.veiculo.modelo}`,
        aberturaEm: os.aberturaEm,
        total: os.pagamento ? Number(os.pagamento.valor_total) : 0,
      })),
    };
  },
};
