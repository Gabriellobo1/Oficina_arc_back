-- Seed extra: mais variedade de dados (idempotente via NOT EXISTS por chave natural)

-- ===================== CLIENTES =====================
INSERT INTO "Cliente" (nome, email, telefone, tipo, cpf, cnpj, endereco)
SELECT v.nome, v.email, v.telefone, v.tipo, v.cpf, v.cnpj, v.endereco
FROM (VALUES
  ('Maria Silva',                 'maria.silva@gmail.com',     '11987654321', 'PF', '23456789012', NULL::text,         'Rua das Flores, 123 - São Paulo/SP'),
  ('Carlos Oliveira',             'carlos.oliveira@gmail.com', '21987651234', 'PF', '34567890123', NULL,               'Av. Atlântica, 500 - Rio de Janeiro/RJ'),
  ('Ana Souza',                   'ana.souza@hotmail.com',     '31988887777', 'PF', '45678901234', NULL,               'Rua Minas, 45 - Belo Horizonte/MG'),
  ('Pedro Santos',                'pedro.santos@gmail.com',    '41999996666', 'PF', '56789012345', NULL,               'Rua XV de Novembro, 200 - Curitiba/PR'),
  ('Juliana Costa',               'juliana.costa@yahoo.com',   '51988885555', 'PF', '67890123456', NULL,               'Av. Ipiranga, 800 - Porto Alegre/RS'),
  ('Rafael Lima',                 'rafael.lima@gmail.com',     '71977774444', 'PF', '78901234567', NULL,               'Rua Chile, 10 - Salvador/BA'),
  ('Beatriz Fernandes',           'beatriz.f@gmail.com',       '85966663333', 'PF', '89012345678', NULL,               'Av. Beira Mar, 1200 - Fortaleza/CE'),
  ('Transportadora Veloz Ltda',   'contato@veloz.com.br',      '1133224455',  'PJ', NULL,          '12345678000190',   'Rod. Anhanguera km 20 - São Paulo/SP'),
  ('Auto Center Premium ME',      'financeiro@premium.com.br', '1144556677',  'PJ', NULL,          '23456789000181',   'Av. Industrial, 1500 - Guarulhos/SP'),
  ('Frota Rápida Logística',      'frota@rapida.com.br',       '1922334455',  'PJ', NULL,          '34567890000172',   'Rua do Comércio, 300 - Campinas/SP')
) AS v(nome, email, telefone, tipo, cpf, cnpj, endereco)
WHERE NOT EXISTS (SELECT 1 FROM "Cliente" c WHERE c.email = v.email);

-- ===================== VEÍCULOS =====================
INSERT INTO "Veiculo" (placa, marca, modelo, ano, cor, "clienteId")
SELECT v.placa, v.marca, v.modelo, v.ano, v.cor, c.id
FROM (VALUES
  ('DEF2A11', 'Volkswagen', 'Gol',       2018, 'Branco',   'maria.silva@gmail.com'),
  ('GHI3B22', 'Honda',      'Civic',     2021, 'Preto',    'maria.silva@gmail.com'),
  ('JKL4C33', 'Toyota',     'Corolla',   2020, 'Prata',    'carlos.oliveira@gmail.com'),
  ('MNO5D44', 'Hyundai',    'HB20',      2019, 'Vermelho', 'ana.souza@hotmail.com'),
  ('PQR6E55', 'Chevrolet',  'Onix',      2022, 'Cinza',    'pedro.santos@gmail.com'),
  ('STU7F66', 'Fiat',       'Argo',      2020, 'Azul',     'pedro.santos@gmail.com'),
  ('VWX8G77', 'Renault',    'Kwid',      2021, 'Branco',   'juliana.costa@yahoo.com'),
  ('YZA9H88', 'Jeep',       'Renegade',  2019, 'Verde',    'rafael.lima@gmail.com'),
  ('BCD1I99', 'Mercedes',   'Sprinter',  2020, 'Branco',   'contato@veloz.com.br'),
  ('EFG2J00', 'Volkswagen', 'Delivery',  2018, 'Branco',   'contato@veloz.com.br'),
  ('HIJ3K11', 'Ford',       'Ka',        2017, 'Prata',    'financeiro@premium.com.br'),
  ('KLM4N22', 'Fiat',       'Fiorino',   2021, 'Branco',   'frota@rapida.com.br'),
  ('NOP5Q33', 'Renault',    'Master',    2019, 'Branco',   'frota@rapida.com.br'),
  ('RST6U44', 'Nissan',     'Kicks',     2022, 'Laranja',  'beatriz.f@gmail.com')
) AS v(placa, marca, modelo, ano, cor, email)
JOIN "Cliente" c ON c.email = v.email
WHERE NOT EXISTS (SELECT 1 FROM "Veiculo" x WHERE x.placa = v.placa);

-- ===================== FUNCIONÁRIOS =====================
INSERT INTO "Funcionario" (nome, cargo, especialidade, salario, telefone, data_admissao, ativo)
SELECT v.nome, v.cargo, v.especialidade, v.salario, v.telefone, v.data_admissao, v.ativo
FROM (VALUES
  ('José Pereira',     'Mecânico',               'Motor e câmbio',       3500.00, '11955554444', now() - interval '3 years',  true),
  ('Antônio Ferreira', 'Eletricista Automotivo', 'Injeção eletrônica',   3800.00, '11944443333', now() - interval '2 years',  true),
  ('Marcos Rocha',     'Funileiro',              'Lataria',              3200.00, '11933332222', now() - interval '4 years',  true),
  ('Lucas Almeida',    'Pintor',                 'Pintura automotiva',   3300.00, '11922221111', now() - interval '18 months',true),
  ('Fernanda Dias',    'Atendente',              'Atendimento ao cliente',2500.00,'11911110000', now() - interval '1 year',   true),
  ('Roberto Gomes',    'Mecânico',               'Freios e suspensão',   3600.00, '11900009999', now() - interval '5 years',  true),
  ('Camila Nunes',     'Atendente',              'Recepção',             2400.00, '11988887777', now() - interval '8 months', true),
  ('Diego Martins',    'Eletricista Automotivo', 'Ar-condicionado',      3700.00, '11977776666', now() - interval '2 years',  false)
) AS v(nome, cargo, especialidade, salario, telefone, data_admissao, ativo)
WHERE NOT EXISTS (SELECT 1 FROM "Funcionario" f WHERE f.nome = v.nome);

-- ===================== PEÇAS =====================
INSERT INTO "Peca" (nome, preco_unitario, quantidade, quantidade_minima, fornecedor)
SELECT v.nome, v.preco_unitario, v.quantidade, v.quantidade_minima, v.fornecedor
FROM (VALUES
  ('Bateria 60Ah',              420.00, 20,  5,  'Moura'),
  ('Pneu 175/70 R13',           320.00, 24,  8,  'Pirelli'),
  ('Disco de freio dianteiro',  180.00, 18,  6,  'Fremax'),
  ('Correia do alternador',      65.00, 30, 10,  'Contitech'),
  ('Lâmpada H4',                 22.00, 100,30,  'Osram'),
  ('Óleo de câmbio (1L)',        45.00, 40, 12,  'Motul'),
  ('Filtro de cabine',           38.00, 35, 10,  'Tecfil'),
  ('Amortecedor traseiro',      290.00, 10,  4,  'Cofap'),
  ('Kit de embreagem',          650.00,  8,  3,  'LuK'),
  ('Radiador',                  480.00,  6,  2,  'Valeo'),
  ('Sensor de oxigênio',        210.00, 12,  4,  'Bosch'),
  ('Jogo de velas iridium',     180.00, 20,  6,  'Denso'),
  ('Pastilha de freio traseira',110.00, 15,  5,  'TRW'),
  ('Junta do cabeçote',         140.00,  7,  3,  'Sabó')
) AS v(nome, preco_unitario, quantidade, quantidade_minima, fornecedor)
WHERE NOT EXISTS (SELECT 1 FROM "Peca" p WHERE p.nome = v.nome);

-- ===================== TIPOS DE SERVIÇO (extras) =====================
INSERT INTO "TipoServico" (nome, descricao, preco_base, tempo_estimado)
SELECT v.nome, v.descricao, v.preco_base, v.tempo_estimado
FROM (VALUES
  ('Troca de bateria',       'Substituição da bateria e teste do sistema de carga', 90.00,  20),
  ('Troca de pneus',         'Substituição e calibragem dos pneus',                120.00,  40),
  ('Funilaria e pintura',    'Reparo de lataria e repintura',                      800.00, 480),
  ('Recarga de ar-condicionado','Recarga de gás e verificação de vazamentos',      250.00,  60)
) AS v(nome, descricao, preco_base, tempo_estimado)
WHERE NOT EXISTS (SELECT 1 FROM "TipoServico" t WHERE t.nome = v.nome);

-- ===================== OS CONCLUÍDAS (para avaliações/pagamentos) =====================
INSERT INTO "Agendamento" ("veiculoId", status, km_entrada, km_saida, "aberturaEm", "conclusaoEm", observacoes)
SELECT vv.id, 'CONCLUIDO', a.km_ent, a.km_sai, now() - a.dias, now() - a.dias + interval '3 hours', a.marker
FROM (VALUES
  ('DEF2A11', 45000, 45120, interval '25 days', 'seed-os-1'),
  ('JKL4C33', 60000, 60080, interval '20 days', 'seed-os-2'),
  ('MNO5D44', 38000, 38150, interval '15 days', 'seed-os-3'),
  ('PQR6E55', 22000, 22050, interval '12 days', 'seed-os-4'),
  ('YZA9H88', 71000, 71200, interval '8 days',  'seed-os-5'),
  ('HIJ3K11', 99000, 99100, interval '5 days',  'seed-os-6'),
  ('KLM4N22', 54000, 54300, interval '3 days',  'seed-os-7')
) AS a(placa, km_ent, km_sai, dias, marker)
JOIN "Veiculo" vv ON vv.placa = a.placa
WHERE NOT EXISTS (SELECT 1 FROM "Agendamento" x WHERE x.observacoes = a.marker);

-- ===================== AVALIAÇÕES =====================
INSERT INTO "Avaliacao" ("agendamentoId", nota, comentario)
SELECT ag.id, a.nota, a.coment
FROM (VALUES
  ('seed-os-1', 5, 'Atendimento excelente e serviço rápido. Recomendo!'),
  ('seed-os-2', 4, 'Bom serviço, só demorou um pouco mais que o previsto.'),
  ('seed-os-3', 5, 'Equipe muito atenciosa, carro entregue impecável.'),
  ('seed-os-4', 3, 'Resolveram o problema, mas o orçamento veio acima do esperado.'),
  ('seed-os-5', 5, 'Melhor oficina da região, confiança total.'),
  ('seed-os-6', 4, 'Profissionais competentes e preço justo.')
) AS a(marker, nota, coment)
JOIN "Agendamento" ag ON ag.observacoes = a.marker
WHERE NOT EXISTS (SELECT 1 FROM "Avaliacao" x WHERE x."agendamentoId" = ag.id);

-- ===================== PAGAMENTOS =====================
INSERT INTO "Pagamento" ("agendamentoId", valor_total, forma_pagamento, parcelas, status)
SELECT ag.id, p.valor, p.forma, p.parcelas, p.status
FROM (VALUES
  ('seed-os-1', 350.00,  'PIX',            1, 'PAGO'),
  ('seed-os-2', 580.00,  'CARTAO_CREDITO', 3, 'PAGO'),
  ('seed-os-3', 220.00,  'DINHEIRO',       1, 'PAGO'),
  ('seed-os-4', 1200.00, 'CARTAO_CREDITO', 6, 'PENDENTE'),
  ('seed-os-5', 450.00,  'CARTAO_DEBITO',  1, 'PAGO'),
  ('seed-os-7', 890.00,  'BOLETO',         2, 'PENDENTE')
) AS p(marker, valor, forma, parcelas, status)
JOIN "Agendamento" ag ON ag.observacoes = p.marker
WHERE NOT EXISTS (SELECT 1 FROM "Pagamento" x WHERE x."agendamentoId" = ag.id);
