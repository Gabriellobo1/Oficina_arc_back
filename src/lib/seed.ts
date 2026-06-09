import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

async function main() {
  await prisma.usuario.upsert({
    where: { email: "gerente@oficina.com" },
    update: {},
    create: {
      email: "gerente@oficina.com",
      senha_hash: await bcrypt.hash("admin123", 10),
      perfil: "GERENTE",
    },
  });

  await prisma.usuario.upsert({
    where: { email: "atendente@oficina.com" },
    update: {},
    create: {
      email: "atendente@oficina.com",
      senha_hash: await bcrypt.hash("atend123", 10),
      perfil: "ATENDENTE",
    },
  });

  const tiposServico = [
    { nome: "Troca de óleo", descricao: "Troca de óleo do motor e filtro", preco_base: 120.0, tempo_estimado: 30 },
    { nome: "Alinhamento e balanceamento", descricao: "Alinhamento das rodas e balanceamento dos pneus", preco_base: 180.0, tempo_estimado: 60 },
    { nome: "Revisão de freios", descricao: "Inspeção e ajuste do sistema de freios", preco_base: 250.0, tempo_estimado: 90 },
    { nome: "Troca de correia dentada", descricao: "Substituição da correia dentada e tensor", preco_base: 450.0, tempo_estimado: 120 },
    { nome: "Diagnóstico eletrônico", descricao: "Leitura de falhas via scanner automotivo", preco_base: 90.0, tempo_estimado: 45 },
    { nome: "Higienização do ar-condicionado", descricao: "Limpeza e recarga do sistema de A/C", preco_base: 200.0, tempo_estimado: 60 },
    { nome: "Troca de velas de ignição", descricao: "Substituição das velas de ignição", preco_base: 160.0, tempo_estimado: 45 },
    { nome: "Regulagem de motor", descricao: "Ajuste completo do motor a combustão", preco_base: 300.0, tempo_estimado: 120 },
    { nome: "Troca de amortecedores", descricao: "Substituição dos amortecedores dianteiros ou traseiros", preco_base: 600.0, tempo_estimado: 180 },
    { nome: "Limpeza de bicos injetores", descricao: "Limpeza ultrassônica dos bicos injetores", preco_base: 280.0, tempo_estimado: 90 },
  ];

  for (const tipo of tiposServico) {
    await prisma.tipoServico.upsert({
      where: { nome: tipo.nome },
      update: {},
      create: tipo,
    });
  }

  const pecas = [
    { nome: "Filtro de óleo", preco_unitario: 35.0, quantidade: 50, quantidade_minima: 10, fornecedor: "AutoPeças Brasil" },
    { nome: "Óleo motor 5W30 (1L)", preco_unitario: 28.0, quantidade: 80, quantidade_minima: 20, fornecedor: "Lubrax" },
    { nome: "Pastilha de freio dianteira", preco_unitario: 120.0, quantidade: 30, quantidade_minima: 8, fornecedor: "Bosch" },
    { nome: "Correia dentada", preco_unitario: 180.0, quantidade: 15, quantidade_minima: 5, fornecedor: "Gates" },
    { nome: "Vela de ignição", preco_unitario: 45.0, quantidade: 60, quantidade_minima: 16, fornecedor: "NGK" },
    { nome: "Filtro de ar", preco_unitario: 55.0, quantidade: 40, quantidade_minima: 10, fornecedor: "Mann Filter" },
    { nome: "Fluido de freio DOT 4 (500ml)", preco_unitario: 32.0, quantidade: 25, quantidade_minima: 8, fornecedor: "Bosch" },
    { nome: "Amortecedor dianteiro", preco_unitario: 380.0, quantidade: 3, quantidade_minima: 4, fornecedor: "Monroe" },
    { nome: "Tensor da correia", preco_unitario: 95.0, quantidade: 12, quantidade_minima: 4, fornecedor: "Gates" },
    { nome: "Filtro de combustível", preco_unitario: 48.0, quantidade: 2, quantidade_minima: 6, fornecedor: "Mann Filter" },
  ];

  for (const peca of pecas) {
    await prisma.peca.upsert({
      where: { id: peca.nome },
      update: {},
      create: peca,
    }).catch(async () => {
      const existente = await prisma.peca.findFirst({ where: { nome: peca.nome } });
      if (!existente) await prisma.peca.create({ data: peca });
    });
  }

  console.log("Seed concluído.");
  console.log("Usuários:");
  console.log("  Gerente:   gerente@oficina.com  / admin123");
  console.log("  Atendente: atendente@oficina.com / atend123");
  console.log(`Tipos de serviço: ${tiposServico.length}`);
  console.log(`Peças: ${pecas.length} (incluindo itens abaixo do estoque mínimo)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
