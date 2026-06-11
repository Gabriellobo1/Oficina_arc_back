# Oficina Mecânica — Backend API

API REST para sistema de agendamento de manutenção veicular.

## Stack

- **Runtime:** Node.js 20+
- **Framework:** Fastify
- **Linguagem:** TypeScript
- **Banco de dados:** PostgreSQL 16 (via Docker)
- **Acesso a dados:** SQL puro com o driver [`pg`](https://node-postgres.com/) (sem ORM)
- **Auth:** JWT
- **Validação:** Zod
- **Docs:** Swagger UI

### Arquitetura em camadas

```
HTTP → routes → controller → service (regra de negócio) → repository (SQL) → db (pool pg) → PostgreSQL
```

- `*.controller.ts` — recebe a requisição, valida com Zod e chama o service.
- `*.service.ts` — regra de negócio (validações, fluxos, permissões).
- `*.repository.ts` — **todo o SQL** do módulo (SELECT/INSERT/UPDATE/DELETE).
- `src/lib/db.ts` — pool de conexões, helper de transação (`withTransaction`) e tratamento de tipos.

## Pré-requisitos

- Node.js 20+ e npm 9+
- Docker + Docker Compose (para o PostgreSQL)

## Instalação e execução

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Subir o PostgreSQL (Docker)
docker compose up -d

# 4. Criar as tabelas (aplica sql/schema.sql)
npm run db:setup

# 5. Popular com dados iniciais (seed)
npm run db:seed

# 6. Iniciar o servidor
npm run dev
```

O servidor sobe em `http://localhost:3333`.
Swagger UI disponível em `http://localhost:3333/api/docs`.

> **Porta do banco:** o Docker expõe o PostgreSQL na porta **5433** do host
> (para não conflitar com um Postgres já rodando na 5432). O `.env.example`
> já vem configurado com essa porta.

## Banco de dados (SQL)

Não há ORM: o esquema e as consultas são SQL escrito à mão.

| Onde | O quê |
|---|---|
| [sql/schema.sql](sql/schema.sql) | DDL do banco (CREATE TABLE, FKs, índices) — **fonte de verdade**, aplicado pelo `db:setup` |
| [sql/schema.dump.sql](sql/schema.dump.sql) | Dump consolidado gerado via `pg_dump` (material de apoio) |
| `src/modules/**/*.repository.ts` | Todas as consultas (SELECT/INSERT/UPDATE/DELETE) de cada módulo |
| [src/lib/seed.ts](src/lib/seed.ts) | INSERTs dos dados iniciais |

### Ver o SQL em execução / ao vivo

```bash
# Abrir um console SQL no banco:
docker exec -it oficina_postgres psql -U oficina -d oficina

# Dentro do psql:
\dt                         -- lista as tabelas
\d "Cliente"                -- estrutura de uma tabela
SELECT * FROM "Cliente";    -- consulta os dados
```

Em modo desenvolvimento (`NODE_ENV=development`), o `db.ts` imprime no terminal
cada query SQL executada pela API (prefixo `[SQL]`), útil para demonstrar o que
roda a cada ação.

Para regenerar o dump consolidado:

```bash
docker exec oficina_postgres pg_dump -U oficina --schema-only \
  --no-owner --no-privileges oficina > sql/schema.dump.sql
```

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexão com o PostgreSQL | `postgresql://oficina:oficina@localhost:5433/oficina` |
| `JWT_SECRET` | Chave secreta do JWT (mín. 32 chars) | `sua_chave_secreta_aqui...` |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `7d` |
| `PORT` | Porta do servidor | `3333` |
| `FRONTEND_URL` | URL do frontend (CORS) | `http://localhost:3000` |
| `NODE_ENV` | Ambiente | `development` |

## Usuários padrão (seed)

| E-mail | Senha | Perfil |
|---|---|---|
| gerente@oficina.com | admin123 | GERENTE |
| atendente@oficina.com | atend123 | ATENDENTE |

## Endpoints principais

| Método | Rota | Acesso |
|---|---|---|
| POST | /api/auth/login | público |
| POST | /api/auth/refresh | autenticado |
| POST | /api/clientes | autenticado |
| GET | /api/clientes | autenticado |
| GET | /api/clientes/:id | autenticado |
| PUT | /api/clientes/:id | autenticado |
| POST | /api/veiculos | autenticado |
| GET | /api/veiculos/:placa | autenticado |
| POST | /api/agendamentos | autenticado |
| GET | /api/agendamentos | autenticado |
| PATCH | /api/agendamentos/:id/status | autenticado |
| POST | /api/agendamentos/:id/itens-servico | autenticado |
| POST | /api/agendamentos/:id/itens-peca | autenticado |
| POST | /api/agendamentos/:id/pagamento | autenticado |
| POST | /api/agendamentos/:id/avaliacao | autenticado |
| GET | /api/tipo-servico | autenticado |
| POST | /api/tipo-servico | gerente |
| GET | /api/pecas | autenticado |
| GET | /api/pecas/abaixo-estoque-minimo | autenticado |
| POST | /api/pecas | gerente |
| GET | /api/funcionarios | autenticado |
| POST | /api/funcionarios | gerente |
| GET | /api/relatorios/receita-mensal | gerente |
| GET | /api/relatorios/ranking-servicos | gerente |
| GET | /api/relatorios/ranking-funcionarios | gerente |
| GET | /api/relatorios/nota-media-funcionarios | gerente |

## Scripts disponíveis

```bash
npm run dev        # Servidor em modo watch
npm run build      # Build para produção
npm run start      # Iniciar build de produção
npm run db:setup   # Cria as tabelas aplicando sql/schema.sql
npm run db:seed    # Popula o banco com dados iniciais
```
