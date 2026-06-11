CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS "Avaliacao"   CASCADE;
DROP TABLE IF EXISTS "Pagamento"   CASCADE;
DROP TABLE IF EXISTS "ItemPeca"    CASCADE;
DROP TABLE IF EXISTS "ItemServico" CASCADE;
DROP TABLE IF EXISTS "Agendamento" CASCADE;
DROP TABLE IF EXISTS "Peca"        CASCADE;
DROP TABLE IF EXISTS "TipoServico" CASCADE;
DROP TABLE IF EXISTS "Funcionario" CASCADE;
DROP TABLE IF EXISTS "Veiculo"     CASCADE;
DROP TABLE IF EXISTS "Cliente"     CASCADE;
DROP TABLE IF EXISTS "Usuario"     CASCADE;

CREATE TABLE "Usuario" (
    "id"         text         PRIMARY KEY DEFAULT gen_random_uuid(),
    "email"      text         NOT NULL UNIQUE,
    "senha_hash" text         NOT NULL,
    "perfil"     text         NOT NULL DEFAULT 'ATENDENTE',
    "criadoEm"   timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE "Cliente" (
    "id"        text         PRIMARY KEY DEFAULT gen_random_uuid(),
    "nome"      text         NOT NULL,
    "email"     text         NOT NULL UNIQUE,
    "telefone"  text,
    "tipo"      text         NOT NULL,
    "cpf"       text         UNIQUE,
    "cnpj"      text         UNIQUE,
    "endereco"  text,
    "criadoEm"  timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE "Veiculo" (
    "id"         text         PRIMARY KEY DEFAULT gen_random_uuid(),
    "placa"      text         NOT NULL UNIQUE,
    "marca"      text         NOT NULL,
    "modelo"     text         NOT NULL,
    "ano"        integer      NOT NULL,
    "cor"        text,
    "clienteId"  text         NOT NULL REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "criadoEm"   timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE "Funcionario" (
    "id"             text         PRIMARY KEY DEFAULT gen_random_uuid(),
    "nome"           text         NOT NULL,
    "cargo"          text         NOT NULL,
    "especialidade"  text,
    "salario"        numeric(10,2) NOT NULL,
    "telefone"       text,
    "data_admissao"  timestamptz,
    "ativo"          boolean      NOT NULL DEFAULT true,
    "usuarioId"      text         UNIQUE REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "criadoEm"       timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE "TipoServico" (
    "id"             text          PRIMARY KEY DEFAULT gen_random_uuid(),
    "nome"           text          NOT NULL UNIQUE,
    "descricao"      text,
    "preco_base"     numeric(10,2) NOT NULL,
    "tempo_estimado" integer       NOT NULL,
    "criadoEm"       timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE "Peca" (
    "id"                text          PRIMARY KEY DEFAULT gen_random_uuid(),
    "nome"              text          NOT NULL,
    "descricao"         text,
    "preco_unitario"    numeric(10,2) NOT NULL,
    "quantidade"        integer       NOT NULL DEFAULT 0,
    "quantidade_minima" integer       NOT NULL DEFAULT 0,
    "fornecedor"        text,
    "criadoEm"          timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE "Agendamento" (
    "id"          text         PRIMARY KEY DEFAULT gen_random_uuid(),
    "veiculoId"   text         NOT NULL REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "status"      text         NOT NULL DEFAULT 'AGENDADO',
    "km_entrada"  integer      NOT NULL,
    "km_saida"    integer,
    "aberturaEm"  timestamptz  NOT NULL DEFAULT now(),
    "conclusaoEm" timestamptz,
    "observacoes" text,
    "criadoEm"    timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE "ItemServico" (
    "id"             text          PRIMARY KEY DEFAULT gen_random_uuid(),
    "agendamentoId"  text          NOT NULL REFERENCES "Agendamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "tipoServicoId"  text          NOT NULL REFERENCES "TipoServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "funcionarioId"  text          NOT NULL REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "quantidade"     integer       NOT NULL DEFAULT 1,
    "preco_unitario" numeric(10,2) NOT NULL,
    "desconto"       numeric(10,2) NOT NULL DEFAULT 0,
    "criadoEm"       timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE "ItemPeca" (
    "id"             text          PRIMARY KEY DEFAULT gen_random_uuid(),
    "agendamentoId"  text          NOT NULL REFERENCES "Agendamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "pecaId"         text          NOT NULL REFERENCES "Peca"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "quantidade"     integer       NOT NULL DEFAULT 1,
    "preco_unitario" numeric(10,2) NOT NULL,
    "desconto"       numeric(10,2) NOT NULL DEFAULT 0,
    "criadoEm"       timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE "Pagamento" (
    "id"              text          PRIMARY KEY DEFAULT gen_random_uuid(),
    "agendamentoId"   text          NOT NULL UNIQUE REFERENCES "Agendamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "valor_total"     numeric(10,2) NOT NULL,
    "forma_pagamento" text          NOT NULL,
    "parcelas"        integer       NOT NULL DEFAULT 1,
    "status"          text          NOT NULL DEFAULT 'PENDENTE',
    "criadoEm"        timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE "Avaliacao" (
    "id"            text         PRIMARY KEY DEFAULT gen_random_uuid(),
    "agendamentoId" text         NOT NULL UNIQUE REFERENCES "Agendamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "nota"          integer      NOT NULL,
    "comentario"    text,
    "criadoEm"      timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX "idx_veiculo_clienteId"      ON "Veiculo"("clienteId");
CREATE INDEX "idx_agendamento_veiculoId"  ON "Agendamento"("veiculoId");
CREATE INDEX "idx_agendamento_status"     ON "Agendamento"("status");
CREATE INDEX "idx_agendamento_aberturaEm" ON "Agendamento"("aberturaEm");
CREATE INDEX "idx_itemservico_agendamentoId" ON "ItemServico"("agendamentoId");
CREATE INDEX "idx_itemservico_tipoServicoId" ON "ItemServico"("tipoServicoId");
CREATE INDEX "idx_itemservico_funcionarioId" ON "ItemServico"("funcionarioId");
CREATE INDEX "idx_itempeca_agendamentoId"  ON "ItemPeca"("agendamentoId");
CREATE INDEX "idx_itempeca_pecaId"         ON "ItemPeca"("pecaId");
