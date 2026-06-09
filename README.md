# Oficina Mecânica — Backend API

API REST para sistema de agendamento de manutenção veicular.

## Stack

- **Runtime:** Node.js 20+
- **Framework:** Fastify
- **Linguagem:** TypeScript
- **ORM:** Prisma 5
- **Banco (dev):** SQLite
- **Banco (prod):** PostgreSQL 16+
- **Auth:** JWT
- **Validação:** Zod
- **Docs:** Swagger UI

## Pré-requisitos

- Node.js 20+
- npm 9+

## Instalação e execução

```bash
# 1. Clonar o repositório
git clone https://github.com/Gabriellobo1/Oficina_arc_back.git
cd Oficina_arc_back

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar o .env com seus valores

# 4. Criar o banco e aplicar migrations
npx prisma migrate dev

# 5. Popular com dados iniciais
npm run db:seed

# 6. Iniciar o servidor
npm run dev
```

O servidor sobe em `http://localhost:3333`.
Swagger UI disponível em `http://localhost:3333/api/docs`.

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexão com o banco | `file:./dev.db` |
| `JWT_SECRET` | Chave secreta do JWT (mín. 32 chars) | `sua_chave_secreta_aqui` |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `7d` |
| `PORT` | Porta do servidor | `3333` |
| `FRONTEND_URL` | URL do frontend (CORS) | `http://localhost:5173` |
| `NODE_ENV` | Ambiente | `development` |

## Migrar para PostgreSQL

1. Alterar `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Atualizar `.env`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/oficina"
```

3. Recriar migrations:
```bash
npx prisma migrate dev --name postgres_init
```

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
| GET | /api/funcionarios | gerente |
| POST | /api/funcionarios | gerente |
| GET | /api/relatorios/receita-mensal | gerente |
| GET | /api/relatorios/ranking-servicos | gerente |
| GET | /api/relatorios/ranking-funcionarios | gerente |
| GET | /api/relatorios/nota-media-funcionarios | gerente |

## Scripts disponíveis

```bash
npm run dev          # Servidor em modo watch
npm run build        # Build para produção
npm run start        # Iniciar build de produção
npm run db:migrate   # Aplicar migrations
npm run db:generate  # Gerar Prisma Client
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Popular banco com dados iniciais
```
