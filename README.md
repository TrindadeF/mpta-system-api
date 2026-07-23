# MPTA System — Gestão de Membros de Igreja

Sistema web para cadastro e gestão de membros de igreja: dados pessoais (nome,
data de nascimento, contato), função eclesiástica/ministerial e situação de
membresia. Um administrador pode gerar um **link de cadastro** único e
temporário para que o próprio indivíduo preencha seus dados, sem precisar de
login.

## Stack

- **backend/** — Rails 8 (API-only) + PostgreSQL, autenticação via JWT
- **frontend/** — React + TypeScript + Vite (SPA consumindo a API)

## Como rodar localmente

### Opção 1: Docker Compose (recomendado)

Sobe banco, backend e frontend juntos, sem precisar instalar Ruby/Node/Postgres
na máquina:

```bash
docker compose up
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Postgres: exposto em `localhost:5434` (para acessar com um client externo,
  se quiser)

Na primeira subida, o backend cria o banco, roda as migrations e o seed
automaticamente (idempotente — pode rodar `docker compose up` de novo sem
problema). O código de `backend/` e `frontend/` é montado como volume, então
edições no host refletem nos containers com hot-reload normalmente.

O `db:seed` cria um usuário administrador de desenvolvimento:
`admin@igreja.local` / `senha12345`.

Para derrubar tudo: `docker compose down` (os dados do banco persistem no
volume `db_data`; use `docker compose down -v` para apagar tudo do zero).

### Opção 2: rodando cada parte manualmente

#### Banco de dados

O backend espera um PostgreSQL acessível via as variáveis `DATABASE_HOST`,
`DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` (padrão:
`localhost:5432`, usuário/senha `postgres`/`postgres`). Ajuste conforme seu
ambiente.

#### Backend

```bash
cd backend
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server -p 3000
```

O `db:seed` cria o mesmo usuário administrador de desenvolvimento acima
(ajustável via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

#### Frontend

```bash
cd frontend
cp .env.example .env.local   # ajuste VITE_API_URL se necessário
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Fluxo principal

1. Admin faz login em `/login`.
2. Em **Links de Cadastro**, gera um novo link (válido por 7 dias ou até ser
   usado uma vez).
3. Envia o link (`/cadastro/:token`) para a pessoa, por WhatsApp/email/etc.
4. A pessoa preenche seus próprios dados pessoais sem precisar de conta.
5. O membro cadastrado aparece automaticamente na lista de **Membros** do
   admin, e o link é marcado como utilizado (não pode ser reaproveitado).

Admins também podem cadastrar, editar e remover membros diretamente pelo
painel.
