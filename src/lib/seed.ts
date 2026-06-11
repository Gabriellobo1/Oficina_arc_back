import bcrypt from "bcryptjs";
import { pool } from "./db";

async function main() {
  await pool.query(
    `INSERT INTO "Usuario" (email, senha_hash, perfil)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING`,
    ["gerente@oficina.com", await bcrypt.hash("admin123", 10), "GERENTE"]
  );

  await pool.query(
    `INSERT INTO "Usuario" (email, senha_hash, perfil)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING`,
    ["atendente@oficina.com", await bcrypt.hash("atend123", 10), "ATENDENTE"]
  );

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
    await pool.query(
      `INSERT INTO "TipoServico" (nome, descricao, preco_base, tempo_estimado)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (nome) DO NOTHING`,
      [tipo.nome, tipo.descricao, tipo.preco_base, tipo.tempo_estimado]
    );
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
    await pool.query(
      `INSERT INTO "Peca" (nome, preco_unitario, quantidade, quantidade_minima, fornecedor)
       SELECT $1, $2, $3, $4, $5
       WHERE NOT EXISTS (SELECT 1 FROM "Peca" WHERE nome = $1)`,
      [peca.nome, peca.preco_unitario, peca.quantidade, peca.quantidade_minima, peca.fornecedor]
    );
  }

  console.log("Seed concluído.");
  console.log("Usuários:");
  console.log("  Gerente:   gerente@oficina.com  / admin123");
  console.log("  Atendente: atendente@oficina.com / atend123");
  console.log(`Tipos de serviço: ${tiposServico.length}`);
  console.log(`Peças: ${pecas.length} (incluindo itens abaixo do estoque mínimo)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => pool.end());
