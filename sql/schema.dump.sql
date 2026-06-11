-- ============================================================================
-- DUMP CONSOLIDADO DO ESQUEMA (gerado automaticamente via pg_dump --schema-only)
-- ----------------------------------------------------------------------------
-- Este arquivo é o retrato canônico da estrutura do banco em PostgreSQL,
-- exportado direto do servidor. A versão escrita/comentada à mão fica em
-- sql/schema.sql (use aquela como fonte de verdade; este dump é material de
-- apoio para conferência/apresentação).
-- Regenerar:
--   docker exec oficina_postgres pg_dump -U oficina --schema-only \
--     --no-owner --no-privileges oficina > sql/schema.dump.sql
-- ============================================================================

--
-- PostgreSQL database dump
--

\restrict lpHwpTY4VZlLwgVPJxFFpcq1ufm5hf6sS1V1tkfNqlu101XSKUZFrwLz32O1q6N

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Agendamento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Agendamento" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    "veiculoId" text NOT NULL,
    status text DEFAULT 'AGENDADO'::text NOT NULL,
    km_entrada integer NOT NULL,
    km_saida integer,
    "aberturaEm" timestamp with time zone DEFAULT now() NOT NULL,
    "conclusaoEm" timestamp with time zone,
    observacoes text,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: Avaliacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Avaliacao" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    "agendamentoId" text NOT NULL,
    nota integer NOT NULL,
    comentario text,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: Cliente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Cliente" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    email text NOT NULL,
    telefone text,
    tipo text NOT NULL,
    cpf text,
    cnpj text,
    endereco text,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: Funcionario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Funcionario" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    cargo text NOT NULL,
    especialidade text,
    salario numeric(10,2) NOT NULL,
    telefone text,
    data_admissao timestamp with time zone,
    ativo boolean DEFAULT true NOT NULL,
    "usuarioId" text,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ItemPeca; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ItemPeca" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    "agendamentoId" text NOT NULL,
    "pecaId" text NOT NULL,
    quantidade integer DEFAULT 1 NOT NULL,
    preco_unitario numeric(10,2) NOT NULL,
    desconto numeric(10,2) DEFAULT 0 NOT NULL,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ItemServico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ItemServico" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    "agendamentoId" text NOT NULL,
    "tipoServicoId" text NOT NULL,
    "funcionarioId" text NOT NULL,
    quantidade integer DEFAULT 1 NOT NULL,
    preco_unitario numeric(10,2) NOT NULL,
    desconto numeric(10,2) DEFAULT 0 NOT NULL,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: Pagamento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Pagamento" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    "agendamentoId" text NOT NULL,
    valor_total numeric(10,2) NOT NULL,
    forma_pagamento text NOT NULL,
    parcelas integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'PENDENTE'::text NOT NULL,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: Peca; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Peca" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    preco_unitario numeric(10,2) NOT NULL,
    quantidade integer DEFAULT 0 NOT NULL,
    quantidade_minima integer DEFAULT 0 NOT NULL,
    fornecedor text,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TipoServico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TipoServico" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    preco_base numeric(10,2) NOT NULL,
    tempo_estimado integer NOT NULL,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: Usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Usuario" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    senha_hash text NOT NULL,
    perfil text DEFAULT 'ATENDENTE'::text NOT NULL,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: Veiculo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Veiculo" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    placa text NOT NULL,
    marca text NOT NULL,
    modelo text NOT NULL,
    ano integer NOT NULL,
    cor text,
    "clienteId" text NOT NULL,
    "criadoEm" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: Agendamento Agendamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Agendamento"
    ADD CONSTRAINT "Agendamento_pkey" PRIMARY KEY (id);


--
-- Name: Avaliacao Avaliacao_agendamentoId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Avaliacao"
    ADD CONSTRAINT "Avaliacao_agendamentoId_key" UNIQUE ("agendamentoId");


--
-- Name: Avaliacao Avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Avaliacao"
    ADD CONSTRAINT "Avaliacao_pkey" PRIMARY KEY (id);


--
-- Name: Cliente Cliente_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_cnpj_key" UNIQUE (cnpj);


--
-- Name: Cliente Cliente_cpf_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_cpf_key" UNIQUE (cpf);


--
-- Name: Cliente Cliente_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_email_key" UNIQUE (email);


--
-- Name: Cliente Cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY (id);


--
-- Name: Funcionario Funcionario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Funcionario"
    ADD CONSTRAINT "Funcionario_pkey" PRIMARY KEY (id);


--
-- Name: Funcionario Funcionario_usuarioId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Funcionario"
    ADD CONSTRAINT "Funcionario_usuarioId_key" UNIQUE ("usuarioId");


--
-- Name: ItemPeca ItemPeca_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ItemPeca"
    ADD CONSTRAINT "ItemPeca_pkey" PRIMARY KEY (id);


--
-- Name: ItemServico ItemServico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ItemServico"
    ADD CONSTRAINT "ItemServico_pkey" PRIMARY KEY (id);


--
-- Name: Pagamento Pagamento_agendamentoId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pagamento"
    ADD CONSTRAINT "Pagamento_agendamentoId_key" UNIQUE ("agendamentoId");


--
-- Name: Pagamento Pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pagamento"
    ADD CONSTRAINT "Pagamento_pkey" PRIMARY KEY (id);


--
-- Name: Peca Peca_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Peca"
    ADD CONSTRAINT "Peca_pkey" PRIMARY KEY (id);


--
-- Name: TipoServico TipoServico_nome_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TipoServico"
    ADD CONSTRAINT "TipoServico_nome_key" UNIQUE (nome);


--
-- Name: TipoServico TipoServico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TipoServico"
    ADD CONSTRAINT "TipoServico_pkey" PRIMARY KEY (id);


--
-- Name: Usuario Usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_email_key" UNIQUE (email);


--
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id);


--
-- Name: Veiculo Veiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Veiculo"
    ADD CONSTRAINT "Veiculo_pkey" PRIMARY KEY (id);


--
-- Name: Veiculo Veiculo_placa_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Veiculo"
    ADD CONSTRAINT "Veiculo_placa_key" UNIQUE (placa);


--
-- Name: idx_agendamento_aberturaEm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_agendamento_aberturaEm" ON public."Agendamento" USING btree ("aberturaEm");


--
-- Name: idx_agendamento_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_agendamento_status ON public."Agendamento" USING btree (status);


--
-- Name: idx_agendamento_veiculoId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_agendamento_veiculoId" ON public."Agendamento" USING btree ("veiculoId");


--
-- Name: idx_itempeca_agendamentoId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_itempeca_agendamentoId" ON public."ItemPeca" USING btree ("agendamentoId");


--
-- Name: idx_itempeca_pecaId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_itempeca_pecaId" ON public."ItemPeca" USING btree ("pecaId");


--
-- Name: idx_itemservico_agendamentoId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_itemservico_agendamentoId" ON public."ItemServico" USING btree ("agendamentoId");


--
-- Name: idx_itemservico_funcionarioId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_itemservico_funcionarioId" ON public."ItemServico" USING btree ("funcionarioId");


--
-- Name: idx_itemservico_tipoServicoId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_itemservico_tipoServicoId" ON public."ItemServico" USING btree ("tipoServicoId");


--
-- Name: idx_veiculo_clienteId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_veiculo_clienteId" ON public."Veiculo" USING btree ("clienteId");


--
-- Name: Agendamento Agendamento_veiculoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Agendamento"
    ADD CONSTRAINT "Agendamento_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES public."Veiculo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Avaliacao Avaliacao_agendamentoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Avaliacao"
    ADD CONSTRAINT "Avaliacao_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES public."Agendamento"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Funcionario Funcionario_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Funcionario"
    ADD CONSTRAINT "Funcionario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ItemPeca ItemPeca_agendamentoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ItemPeca"
    ADD CONSTRAINT "ItemPeca_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES public."Agendamento"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ItemPeca ItemPeca_pecaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ItemPeca"
    ADD CONSTRAINT "ItemPeca_pecaId_fkey" FOREIGN KEY ("pecaId") REFERENCES public."Peca"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ItemServico ItemServico_agendamentoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ItemServico"
    ADD CONSTRAINT "ItemServico_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES public."Agendamento"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ItemServico ItemServico_funcionarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ItemServico"
    ADD CONSTRAINT "ItemServico_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES public."Funcionario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ItemServico ItemServico_tipoServicoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ItemServico"
    ADD CONSTRAINT "ItemServico_tipoServicoId_fkey" FOREIGN KEY ("tipoServicoId") REFERENCES public."TipoServico"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Pagamento Pagamento_agendamentoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pagamento"
    ADD CONSTRAINT "Pagamento_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES public."Agendamento"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Veiculo Veiculo_clienteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Veiculo"
    ADD CONSTRAINT "Veiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES public."Cliente"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict lpHwpTY4VZlLwgVPJxFFpcq1ufm5hf6sS1V1tkfNqlu101XSKUZFrwLz32O1q6N

