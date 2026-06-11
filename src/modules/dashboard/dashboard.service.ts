import { dashboardRepository } from "./dashboard.repository";

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
      pecasAbaixoMinimo,
    ] = await Promise.all([
      dashboardRepository.contarClientes(),
      dashboardRepository.osPorStatus(),
      dashboardRepository.somaPagamentos(inicioMes),
      dashboardRepository.somaPagamentos(inicioMesAnterior, fimMesAnterior),
      dashboardRepository.mediaNota(),
      dashboardRepository.osRecentes(),
      dashboardRepository.contarPecasAbaixoMinimo(),
    ]);

    const receitaMes = Number(pagamentosMes.soma ?? 0);
    const receitaMesAnterior = Number(pagamentosMesAnterior.soma ?? 0);
    const variacaoReceita =
      receitaMesAnterior > 0
        ? ((receitaMes - receitaMesAnterior) / receitaMesAnterior) * 100
        : 0;

    const statusMap: Record<string, number> = {};
    for (const s of osPorStatus) {
      statusMap[s.status] = s.count;
    }

    return {
      totalClientes,
      osPorStatus: statusMap,
      osAbertas: (statusMap["AGENDADO"] ?? 0) + (statusMap["EM_ANDAMENTO"] ?? 0),
      receitaMes,
      receitaMesAnterior,
      variacaoReceita: Number(variacaoReceita.toFixed(1)),
      totalOsMes: pagamentosMes.total,
      pecasAbaixoMinimo,
      notaMedia: notaMedia != null ? Number(Number(notaMedia).toFixed(1)) : null,
      osRecentes: osRecentes.map((os) => ({
        id: os.id,
        status: os.status,
        clienteNome: os.cliente_nome,
        veiculo: `${os.veiculo_marca} ${os.veiculo_modelo}`,
        aberturaEm: os.aberturaEm,
        total: os.pagamento_valor ? Number(os.pagamento_valor) : 0,
      })),
    };
  },
};
