import { relatoriosRepository } from "./relatorios.repository";

export const relatoriosService = {
  async receitaMensal() {
    return relatoriosRepository.receitaMensal();
  },

  async rankingServicos() {
    return relatoriosRepository.rankingServicos();
  },

  async rankingFuncionarios() {
    return relatoriosRepository.rankingFuncionarios();
  },

  async notaMediaPorFuncionario() {
    return relatoriosRepository.notaMediaPorFuncionario();
  },
};
