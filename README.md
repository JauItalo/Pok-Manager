# PokéManager

Aplicação full-stack para consulta de uma Pokédex própria: os dados dos Pokémon são sincronizados a partir da [PokéAPI](https://pokeapi.co/) para um banco PostgreSQL local e servidos por uma API REST em Spring Boot para um front-end em React. A aplicação já conta com um módulo completo de **autenticação** (cadastro, login com JWT, verificação de e-mail e redefinição de senha).

> Funcionalidades como "Coleção" (marcar Pokémon capturados) e "Times" (montar times e analisar cobertura de tipos) já aparecem na Home/Navbar mas ainda estão marcadas como **Em breve** — só a Pokédex e a autenticação estão funcionais no momento.

## Sumário

- [Visão geral da arquitetura](#visão-geral-da-arquitetura)
- [Stack utilizada](#stack-utilizada)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Backend](#backend)
- [Frontend](#frontend)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Observabilidade (opcional)](#observabilidade-opcional)
- [Roadmap / limitações conhecidas](#roadmap--limitações-conhecidas)

## Visão geral da arquitetura

```
┌─────────────┐      REST /api/*      ┌────────────────┐      JDBC      ┌──────────────┐
│  React SPA   │ ───────────────────▶ │ Spring Boot API │ ─────────────▶ │  PostgreSQL   │
│ (Vite, 5173) │ ◀─────────────────── │    (8080)       │                │   (5432)      │
└─────────────┘      JWT no header     └────────┬───────┘                └──────────────┘
                                                  │        │
                                    RestClient     │        │ SMTP (verificação / reset)
                                    (PokéAPI)       ▼        ▼
                                          ┌───────────────┐ ┌──────────────┐
                                          │   PokéAPI      │ │  Mailtrap /   │
                                          │ pokeapi.co/api │ │  SMTP server  │
                                          └───────────────┘ └──────────────┘
```

O front-end nunca fala diretamente com a PokéAPI. Um endpoint de sincronização (`POST /api/pokemon/sync`) busca os dados na PokéAPI, normaliza e persiste no Postgres; todas as demais rotas de Pokémon leem exclusivamente do banco local. Autenticação é feita via JWT: o token é emitido no login e enviado pelo front em todo request subsequente (`Authorization: Bearer <token>`).

## Stack utilizada

### Backend
- **Java 17** + **Spring Boot 4.1.1**
- **Spring Web MVC** — API REST
- **Spring Data JPA** + **Hibernate** — persistência (`ddl-auto: validate`, schema controlado só pelo Flyway)
- **Flyway** (`flyway-database-postgresql`) — migrations versionadas
- **PostgreSQL** — banco relacional
- **Spring Security** + **JWT (jjwt 0.12.6)** — autenticação stateless baseada em token (ver seção [Autenticação](#autenticação))
- **Spring Mail** (`spring-boot-starter-mail`) — envio de e-mails de verificação de conta e redefinição de senha
- **Spring Validation** — validação de DTOs (`jakarta.validation`)
- **Spring `RestClient`** — cliente HTTP para consumir a PokéAPI (bean configurado com `baseUrl = https://pokeapi.co/api/v2`)
- **Lombok** — reduz boilerplate (getters/setters/builders)
- **springboot4-dotenv** — carrega variáveis do arquivo `.env` na inicialização
- **Spring Boot Actuator** + **Micrometer Prometheus** — métricas expostas em `/actuator/prometheus`
- **Loki Logback Appender** — envio de logs estruturados para Grafana Loki
- **Maven Wrapper** (`mvnw` / `mvnw.cmd`) — não é necessário ter o Maven instalado globalmente

### Frontend
- **React 19** com **Vite 8** (`@vitejs/plugin-react`)
- **React Router DOM 7** — roteamento client-side
- **Tailwind CSS 4** (via `@tailwindcss/vite`) — estilização utility-first
- **Axios** — cliente HTTP; interceptor de request injeta automaticamente o header `Authorization` com o token JWT armazenado no Zustand
- **Zustand** — `authStore` guarda `token`/`username` e persiste em `localStorage`, mantendo o login entre reloads
- **oxlint** — linter rápido (`npm run lint`)

## Estrutura de pastas

```
pokemanager/
├── backend/
│   ├── src/main/java/com/projetopokemanager/
│   │   ├── config/          # SecurityConfig, AuthenticationConfig, PasswordEncoderConfig, RestClientConfig
│   │   ├── controller/      # PokemonController, AuthController
│   │   ├── dto/             # DTOs de request/response (Pokémon + autenticação)
│   │   ├── entity/          # Pokemon, Ability, PokemonAbility, User, UserToken (+ enums)
│   │   ├── exception/       # exceções de negócio + GlobalExceptionHandler
│   │   ├── integration/pokeapi/  # PokeApiClient + DTOs de resposta da PokéAPI
│   │   ├── repository/      # PokemonRepository, AbilityRepository, UserRepository, UserTokenRepository
│   │   ├── security/        # JwtAuthenticationFilter
│   │   └── service/         # PokemonService, PokemonSyncService, TypeEffectivenessService, TypeChart,
│   │                         # AuthService, JwtService, UserTokenService, EmailService
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── logback-spring.xml
│   │   └── db/migration/    # V1..V5 — migrations Flyway
│   ├── observability/       # configs do Grafana Alloy, Prometheus, Loki e dashboards prontos
│   ├── docker-compose.yml   # sobe Postgres + Grafana Alloy
│   └── .env.example         # variáveis de observabilidade, JWT e e-mail
└── frontend/
    ├── src/
    │   ├── api/axios.js         # instância axios com baseURL "/api" + interceptor JWT
    │   ├── store/authStore.js   # estado de autenticação (Zustand + localStorage)
    │   ├── pages/                # Home, Pokedex, PokemonDetail, Login, Register,
    │   │                          # ForgotPassword, ResetPassword, VerifyEmail
    │   ├── components/           # Navbar, PokemonCard, StatBar, TypeBadge, TypeEffectPill,
    │   │                          # EvolutionChain, EvolutionNode
    │   └── utils/                 # typeColors.js, dayOfYear.js
    └── vite.config.js            # proxy /api -> localhost:8080
```

## Backend

### Modelo de dados

| Tabela            | Descrição                                                                                   |
|--------------------|-----------------------------------------------------------------------------------------------|
| `pokemon`          | Dados principais: `pokeapi_id` (único), nome, `primary_type`/`secondary_type` (enum), altura, peso, os 6 status base (`hp`, `attack`, `defense`, `special_attack`, `special_defense`, `speed`), `image_url` e `evolves_from_pokemon_id` (auto-relacionamento para a cadeia evolutiva) |
| `ability`          | Catálogo de habilidades (nome único), populado sob demanda durante a sincronização           |
| `pokemon_ability`  | Tabela associativa N:N entre `pokemon` e `ability`, com `is_hidden` e `slot`                 |
| `app_user`         | Usuários da aplicação: `username` e `email` únicos, `password` (hash BCrypt) e `enabled` (só vira `true` após confirmar o e-mail) |
| `user_token`       | Tokens de uso único para verificação de e-mail e redefinição de senha (`type`, `expires_at`, `used`) |

O enum `PokemonType` cobre os 18 tipos oficiais (`NORMAL`, `FIRE`, `WATER`, ..., `FAIRY`). O enum `TokenType` cobre `EMAIL_VERIFICATION` e `PASSWORD_RESET`.

Migrations Flyway (`backend/src/main/resources/db/migration/`):
1. `V1__create_pokemon_table.sql` — cria `pokemon` + índices por nome e tipo primário
2. `V2__create_ability_tables.sql` — cria `ability` e `pokemon_ability`
3. `V3__add_pokemon_evolution.sql` — adiciona `evolves_from_pokemon_id` + índice
4. `V4__create_users_table.sql` — cria `app_user`
5. `V5__add_email_verification.sql` — adiciona `enabled` em `app_user` e cria `user_token` + índice pelo token

### Endpoints da API

#### Pokémon — base path `/api/pokemon`

| Método | Rota                         | Auth | Parâmetros                                              | Descrição                                                                 |
|--------|-------------------------------|------|-------------------------------------------------------------|-----------------------------------------------------------------------------|
| GET    | `/api/pokemon`                | pública | `name` (opcional, busca parcial case-insensitive), `type` (opcional, enum `PokemonType`) | Lista/filtra Pokémon já sincronizados                                       |
| GET    | `/api/pokemon/{id}`           | pública | `id` (path)                                                | Retorna um Pokémon pelo id interno (não é o `pokeapiId`)                    |
| GET    | `/api/pokemon/{id}/effectiveness` | pública | `id` (path)                                            | Retorna fraquezas, resistências e imunidades de dano calculadas a partir dos tipos |
| GET    | `/api/pokemon/{id}/evolutions`| pública | `id` (path)                                                | Retorna o Pokémon atual, de quem ele evolui e para quais evolui             |
| POST   | `/api/pokemon/sync`           | **exige JWT** | `startId` (default `1`), `endId` (default `151`)          | Sincroniza uma faixa de ids da PokéAPI para o banco local (idempotente — ids já existentes são ignorados) |

#### Autenticação — base path `/api/auth` (todas públicas)

| Método | Rota                       | Corpo                                                       | Descrição                                                                   |
|--------|------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------|
| POST   | `/api/auth/register`         | `username`, `email`, `password` (mín. 6 chars)                | Cria o usuário (`enabled=false`) e envia e-mail de verificação; retorna `201` com `UserResponseDTO` |
| POST   | `/api/auth/login`             | `username`, `password`                                        | Autentica e retorna `{ token, tokenType: "Bearer", username }`               |
| POST   | `/api/auth/verify-email`      | `token`                                                        | Confirma a conta (`enabled=true`) a partir do token recebido por e-mail      |
| POST   | `/api/auth/forgot-password`   | `email`                                                        | Gera um token de redefinição (válido por 30 min) e envia por e-mail — sempre responde `200`, exista ou não o e-mail, para não vazar quais e-mails estão cadastrados |
| POST   | `/api/auth/reset-password`    | `token`, `newPassword`                                         | Consome o token e define a nova senha                                        |

Erros retornam um corpo padronizado (`ErrorResponseDTO`: timestamp, status, error, message), tratado pelo `GlobalExceptionHandler`:

| Situação                                   | Status |
|--------------------------------------------|--------|
| Pokémon não encontrado                     | 404    |
| Username ou e-mail já cadastrado           | 409    |
| Corpo de request inválido (`@Valid`)       | 400    |
| Token de verificação/reset inválido, expirado ou já usado | 400 |
| Login com credenciais erradas              | 401    |
| Login antes de confirmar o e-mail (conta `enabled=false`) | 403 |

### Autenticação

- **Cadastro**: `POST /api/auth/register` cria o usuário desabilitado (`enabled=false`) e dispara um e-mail com link `FRONTEND_URL/verificar-email?token=...` (token de uso único, válido por 24h).
- **Login**: `POST /api/auth/login` autentica via `AuthenticationManager`/`DaoAuthenticationProvider` (senha com BCrypt) e retorna um JWT assinado (HMAC, `app.jwt.secret`), válido por `app.jwt.expiration-ms` (24h por padrão). Login de conta ainda não confirmada é bloqueado (`403`).
- **Requests autenticados**: o front envia o token no header `Authorization: Bearer <token>`. O `JwtAuthenticationFilter` intercepta cada request, valida o token e popula o `SecurityContext`.
- **Rotas públicas vs protegidas** (`SecurityConfig`): `/api/auth/**` e todo `GET /api/pokemon/**` são públicos; qualquer outra rota (por exemplo `POST /api/pokemon/sync`) exige autenticação.
- **Esqueci minha senha**: `POST /api/auth/forgot-password` gera um token (`PASSWORD_RESET`, válido por 30 min) e envia por e-mail um link `FRONTEND_URL/redefinir-senha?token=...`; `POST /api/auth/reset-password` consome esse token e troca a senha.
- **Tokens de uso único (`UserTokenService`)**: ao gerar um novo token de um tipo, qualquer token anterior do mesmo tipo/usuário é apagado; ao consumir, o token é marcado como `used` e validado quanto a expiração e reuso.

### Outras regras de negócio relevantes

- **Sincronização (`PokemonSyncService`)**: para cada id no intervalo, verifica se já existe (`existsByPokeapiId`); se não, busca o Pokémon e a espécie na PokéAPI, monta a entidade (tipos, status, sprite oficial), grava habilidades (criando-as sob demanda) e resolve o `evolvesFrom` a partir do id extraído da URL da espécie anterior.
- **Efetividade de tipos (`TypeEffectivenessService` + `TypeChart`)**: calcula, para cada um dos 18 tipos de ataque, o multiplicador de dano contra o(s) tipo(s) do Pokémon (multiplicando os multiplicadores quando há dois tipos), e separa em fraquezas (`> 1.0`), resistências (`0 < x < 1.0`) e imunidades (`= 0.0`).

## Frontend

### Páginas

- **`/` (Home)** — hero com "Destaque do dia" (Pokémon escolhido deterministicamente pelo dia do ano via `getDayOfYear()`) e atalhos para Pokédex, Coleção e Times (as duas últimas desabilitadas).
- **`/pokedex` (Pokedex)** — grid de cards com busca por nome (debounce de 300ms) e filtro por tipo, consumindo `GET /api/pokemon`.
- **`/pokemon/:id` (PokemonDetail)** — detalhe do Pokémon: status, habilidades, efetividade de tipos e cadeia evolutiva.
- **`/login` (Login)** — formulário de username/senha; exibe banners de sucesso vindos do cadastro (`justRegistered`) ou de reset de senha (`passwordReset`) via `location.state`.
- **`/cadastro` (Register)** — formulário de criação de conta (username, e-mail, senha).
- **`/esqueci-senha` (ForgotPassword)** — formulário para disparar o e-mail de redefinição.
- **`/redefinir-senha` (ResetPassword)** — lê o `token` da query string e permite definir a nova senha.
- **`/verificar-email` (VerifyEmail)** — lê o `token` da query string e confirma a conta.

### Componentes principais

`Navbar` (mostra "Entrar"/"Criar conta" ou nome do usuário + "Sair", conforme `authStore.isAuthenticated`), `PokemonCard`, `StatBar` (barra de status), `TypeBadge` / `TypeEffectPill` (chips coloridos por tipo, cores em `utils/typeColors.js`), `EvolutionChain` / `EvolutionNode` (renderização da linha evolutiva).

### Integração com a API e estado de autenticação

`src/api/axios.js` cria uma instância do axios com `baseURL: '/api'` e um interceptor de request que lê o token atual de `useAuthStore.getState().token` e injeta o header `Authorization: Bearer <token>` quando ele existe. `src/store/authStore.js` (Zustand) guarda `token`/`username`/`isAuthenticated`, persistindo em `localStorage` (`pokemanager_token`, `pokemanager_username`) para manter o login entre reloads da página. Em desenvolvimento, o Vite (`vite.config.js`) faz proxy de `/api/*` para `http://localhost:8080`.

## Como rodar o projeto

Pré-requisitos: **Java 17**, **Node.js 18+** (recomendado 20+), **Docker** (para o Postgres) — não é necessário ter Maven nem PostgreSQL instalados globalmente.

### 1. Banco de dados (via Docker)

```bash
cd backend
docker compose up -d postgres
```

Isso sobe um container `pokemanager-db` (Postgres 16) em `localhost:5432`, com banco `pokemanager`, usuário `postgres` e senha `postgres` — valores já configurados por padrão em `application.yml`, então não é preciso alterar nada para rodar localmente.

> O serviço `alloy` do mesmo `docker-compose.yml` é opcional e serve só para observabilidade (métricas/logs para o Grafana Cloud) — veja a seção [Observabilidade](#observabilidade-opcional). Para rodar apenas o banco, use `docker compose up -d postgres` como acima; para subir tudo, `docker compose up -d`.

### 2. Configurar variáveis de ambiente do backend

Copie `backend/.env.example` para `backend/.env` e preencha pelo menos:

```dotenv
# Obrigatório: segredo usado para assinar os JWT (mínimo 32 caracteres)
JWT_SECRET=troque-este-valor-por-uma-string-aleatoria-bem-longa-e-secreta

# Obrigatório para cadastro/verificação/reset funcionarem (envio de e-mail).
# Para desenvolvimento, uma conta gratuita no Mailtrap (https://mailtrap.io) funciona bem.
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=seu-username-do-mailtrap
MAIL_PASSWORD=sua-senha-do-mailtrap

# URL do frontend, usada para montar os links dentro dos e-mails (verificação/reset)
FRONTEND_URL=http://localhost:5173
```

`JWT_SECRET`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME` e `MAIL_PASSWORD` **não têm valor default** no `application.yml` — sem eles a aplicação não sobe. As demais variáveis (`GC_*`, de observabilidade) são opcionais.

### 3. Backend

```bash
cd backend
./mvnw spring-boot:run        # Linux/macOS
# ou
mvnw.cmd spring-boot:run      # Windows
```

- A API sobe em `http://localhost:8080`.
- O Flyway aplica as migrations automaticamente na inicialização.
- Health check: `GET http://localhost:8080/actuator/health`.

**Popule o banco de Pokémon** (o banco começa vazio — nada aparece na Pokédex até sincronizar). Essa rota agora exige autenticação, então primeiro registre um usuário, confirme o e-mail e faça login para obter um token:

```bash
# 1. cadastro
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"treinador","email":"voce@exemplo.com","password":"123456"}'

# 2. confirme o e-mail: pegue o link enviado (ex.: no inbox do Mailtrap) e extraia o token da query string,
#    depois chame:
curl -X POST http://localhost:8080/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_DO_EMAIL"}'

# 3. login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"treinador","password":"123456"}'
# -> copie o "token" da resposta

# 4. sincronize os Pokémon usando o token
curl -X POST "http://localhost:8080/api/pokemon/sync?startId=1&endId=151" \
  -H "Authorization: Bearer TOKEN_DO_LOGIN"
```

Ajuste `startId`/`endId` para sincronizar outras faixas (por padrão, `1` a `151`, a primeira geração).

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

- App em `http://localhost:5173` (padrão do Vite).
- Requer o backend rodando em `localhost:8080` para o proxy `/api` funcionar.
- Use as telas `/cadastro` e `/login` para criar conta e autenticar pela interface (equivalente ao passo a passo via `curl` acima).

Outros scripts disponíveis:

```bash
npm run build     # build de produção (pasta dist/)
npm run preview   # serve o build de produção localmente
npm run lint       # roda o oxlint
```

### 5. Rodando tudo via Docker

Hoje **não existe Dockerfile** para o backend nem para o frontend — o `docker-compose.yml` do projeto sobe apenas a infraestrutura de apoio (Postgres e, opcionalmente, o agente de observabilidade Grafana Alloy). Backend e frontend são executados diretamente na máquina (`mvnw` / `npm run dev`), como descrito acima.

```bash
cd backend
docker compose up -d        # sobe postgres + alloy
docker compose down         # para os containers
docker compose down -v      # para e apaga o volume de dados do Postgres
```

## Observabilidade (opcional)

O backend já expõe métricas Prometheus (`/actuator/prometheus`) e envia logs via Loki Logback Appender. O `docker-compose.yml` inclui um serviço `alloy` (Grafana Alloy) que lê essas métricas do host (`host.docker.internal:8080`) e as envia (*remote write*) para uma conta Grafana Cloud.

Para habilitar isso, preencha no `backend/.env` (além das variáveis obrigatórias da seção anterior): `GC_PROMETHEUS_URL`, `GC_PROMETHEUS_USER`, `GC_LOKI_URL`, `GC_LOKI_USER` e `GC_API_KEY` com as credenciais da sua conta Grafana Cloud (veja `backend/observability/README.md` para o passo a passo de onde encontrar cada valor) e suba o `alloy` junto com o Postgres: `docker compose up -d`.

Dashboards prontos para importar estão em `backend/observability/dashboards-para-importar/` (métricas Spring Boot e logs/erros). Sem essas variáveis preenchidas, o backend continua funcionando normalmente — a observabilidade externa apenas fica desativada.

> ⚠️ O arquivo `.env` (com credenciais/segredos reais) não deve ser commitado — só `.env.example` deve ir para o repositório.

## Roadmap / limitações conhecidas

- As telas "Coleção" (marcar Pokémon capturados) e "Times" (montar times e ver cobertura de tipos) aparecem na Navbar/Home mas ainda não foram implementadas.
- Autenticação cobre apenas o essencial: não há papéis/perfis (todo usuário autenticado tem o mesmo `ROLE_USER`), nem refresh token (o JWT expira em 24h e o usuário precisa logar de novo), nem "lembrar-me" configurável.
- `POST /api/pokemon/sync` exige apenas estar autenticado (qualquer usuário logado pode disparar a sincronização) — não há um perfil de administrador separado.
- Não há Dockerfile/imagem própria para backend ou frontend; o deploy hoje é manual (build do JAR / build do Vite).