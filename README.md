# PokéManager

Aplicação full-stack para consulta de uma Pokédex própria: os dados dos Pokémon são sincronizados a partir da [PokéAPI](https://pokeapi.co/) para um banco PostgreSQL local, e então servidos por uma API REST em Spring Boot para um front-end em React.

> Funcionalidades como "Coleção" (marcar Pokémon capturados) e "Times" (montar times e analisar cobertura de tipos) já aparecem na Home mas ainda estão marcadas como **Em breve** — só a Pokédex está funcional no momento.

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
└─────────────┘                        └────────┬───────┘                └──────────────┘
                                                  │
                                                  │ RestClient (HTTP)
                                                  ▼
                                          ┌───────────────┐
                                          │   PokéAPI      │
                                          │ pokeapi.co/api │
                                          └───────────────┘
```

O front-end nunca fala diretamente com a PokéAPI. Um endpoint de sincronização (`POST /api/pokemon/sync`) busca os dados na PokéAPI, normaliza e persiste no Postgres; todas as demais rotas leem exclusivamente do banco local.

## Stack utilizada

### Backend
- **Java 17** + **Spring Boot 4.1.1**
- **Spring Web MVC** — API REST
- **Spring Data JPA** + **Hibernate** — persistência (`ddl-auto: validate`, schema controlado só pelo Flyway)
- **Flyway** (`flyway-database-postgresql`) — migrations versionadas
- **PostgreSQL** — banco relacional
- **Spring Security** — configurado como *stateless*, com todas as rotas liberadas (`permitAll`) por enquanto; existe só para padronizar a cadeia de filtros e futuras extensões (não há autenticação implementada hoje)
- **Spring Validation** — starter incluído para validação de DTOs
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
- **Axios** — cliente HTTP, com proxy de `/api` apontando para `http://localhost:8080` em modo dev
- **Zustand** — gerenciamento de estado (dependência já instalada; ainda sem stores em uso ativo no código atual)
- **oxlint** — linter rápido (`npm run lint`)

## Estrutura de pastas

```
pokemanager/
├── backend/
│   ├── src/main/java/com/projetopokemanager/
│   │   ├── config/          # SecurityConfig, RestClientConfig
│   │   ├── controller/      # PokemonController (REST)
│   │   ├── dto/             # DTOs de request/response da API
│   │   ├── entity/          # Pokemon, Ability, PokemonAbility (+ enum PokemonType)
│   │   ├── exception/       # ResourceNotFoundException, GlobalExceptionHandler
│   │   ├── integration/pokeapi/  # PokeApiClient + DTOs de resposta da PokéAPI
│   │   ├── repository/      # PokemonRepository, AbilityRepository (Spring Data JPA)
│   │   └── service/         # PokemonService, PokemonSyncService, TypeEffectivenessService, TypeChart
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── logback-spring.xml
│   │   └── db/migration/    # V1, V2, V3 — migrations Flyway
│   ├── observability/       # configs do Grafana Alloy, Prometheus, Loki e dashboards prontos
│   ├── docker-compose.yml   # sobe Postgres + Grafana Alloy
│   └── .env.example         # variáveis para observabilidade (Grafana Cloud)
└── frontend/
    ├── src/
    │   ├── api/axios.js         # instância axios com baseURL "/api"
    │   ├── pages/                # Home, Pokedex, PokemonDetail
    │   ├── components/           # Navbar, PokemonCard, StatBar, TypeBadge, TypeEffectPill, EvolutionChain, EvolutionNode
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

O enum `PokemonType` cobre os 18 tipos oficiais (`NORMAL`, `FIRE`, `WATER`, ..., `FAIRY`).

Migrations Flyway (`backend/src/main/resources/db/migration/`):
1. `V1__create_pokemon_table.sql` — cria `pokemon` + índices por nome e tipo primário
2. `V2__create_ability_tables.sql` — cria `ability` e `pokemon_ability`
3. `V3__add_pokemon_evolution.sql` — adiciona `evolves_from_pokemon_id` + índice

### Endpoints da API

Base path: `/api/pokemon`

| Método | Rota                         | Parâmetros                                              | Descrição                                                                 |
|--------|-------------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------|
| GET    | `/api/pokemon`                | `name` (opcional, busca parcial case-insensitive), `type` (opcional, enum `PokemonType`) | Lista/filtra Pokémon já sincronizados                                       |
| GET    | `/api/pokemon/{id}`           | `id` (path)                                                | Retorna um Pokémon pelo id interno (não é o `pokeapiId`)                    |
| GET    | `/api/pokemon/{id}/effectiveness` | `id` (path)                                            | Retorna fraquezas, resistências e imunidades de dano calculadas a partir dos tipos |
| GET    | `/api/pokemon/{id}/evolutions`| `id` (path)                                                | Retorna o Pokémon atual, de quem ele evolui e para quais evolui             |
| POST   | `/api/pokemon/sync`           | `startId` (default `1`), `endId` (default `151`)          | Sincroniza uma faixa de ids da PokéAPI para o banco local (idempotente — ids já existentes são ignorados) |

Erros de "não encontrado" retornam `404` com um corpo padronizado (`ErrorResponseDTO`: timestamp, status, error, message), tratado pelo `GlobalExceptionHandler`.

### Regras de negócio relevantes

- **Sincronização (`PokemonSyncService`)**: para cada id no intervalo, verifica se já existe (`existsByPokeapiId`); se não, busca o Pokémon e a espécie na PokéAPI, monta a entidade (tipos, status, sprite oficial), grava habilidades (criando-as sob demanda) e resolve o `evolvesFrom` a partir do id extraído da URL da espécie anterior.
- **Efetividade de tipos (`TypeEffectivenessService` + `TypeChart`)**: calcula, para cada um dos 18 tipos de ataque, o multiplicador de dano contra o(s) tipo(s) do Pokémon (multiplicando os multiplicadores quando há dois tipos), e separa em fraquezas (`> 1.0`), resistências (`0 < x < 1.0`) e imunidades (`= 0.0`).
- **Segurança**: `SecurityConfig` desliga CSRF, define a sessão como `STATELESS` e libera todas as requisições (`permitAll`) — não há autenticação/autorização implementada hoje.

## Frontend

### Páginas

- **`/` (Home)** — hero com "Destaque do dia" (Pokémon escolhido deterministicamente pelo dia do ano via `getDayOfYear()`) e atalhos para Pokédex, Coleção e Times (as duas últimas desabilitadas).
- **`/pokedex` (Pokedex)** — grid de cards com busca por nome (debounce de 300ms) e filtro por tipo, consumindo `GET /api/pokemon`.
- **`/pokemon/:id` (PokemonDetail)** — detalhe do Pokémon: status, habilidades, efetividade de tipos e cadeia evolutiva.

### Componentes principais

`Navbar`, `PokemonCard`, `StatBar` (barra de status), `TypeBadge` / `TypeEffectPill` (chips coloridos por tipo, cores em `utils/typeColors.js`), `EvolutionChain` / `EvolutionNode` (renderização da linha evolutiva).

### Integração com a API

`src/api/axios.js` cria uma instância do axios com `baseURL: '/api'`. Em desenvolvimento, o Vite (`vite.config.js`) faz proxy de `/api/*` para `http://localhost:8080`, então o front nunca precisa saber a URL real do backend em dev.

## Como rodar o projeto

Pré-requisitos: **Java 17**, **Node.js 18+** (recomendado 20+), **Docker** (para o Postgres) — não é necessário ter Maven nem PostgreSQL instalados globalmente.

### 1. Banco de dados (via Docker)

```bash
cd backend
docker compose up -d postgres
```

Isso sobe um container `pokemanager-db` (Postgres 16) em `localhost:5432`, com banco `pokemanager`, usuário `postgres` e senha `postgres` — valores já configurados por padrão em `application.yml`, então não é preciso alterar nada para rodar localmente.

> O serviço `alloy` do mesmo `docker-compose.yml` é opcional e serve só para observabilidade (métricas/logs para o Grafana Cloud) — veja a seção [Observabilidade](#observabilidade-opcional). Para rodar apenas o banco, use `docker compose up -d postgres` como acima; para subir tudo, `docker compose up -d`.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run        # Linux/macOS
# ou
mvnw.cmd spring-boot:run      # Windows
```

- A API sobe em `http://localhost:8080`.
- O Flyway aplica as migrations automaticamente na inicialização.
- Health check: `GET http://localhost:8080/actuator/health`.

**Popule o banco** (o banco começa vazio — nada aparece na Pokédex até sincronizar):

```bash
curl -X POST "http://localhost:8080/api/pokemon/sync?startId=1&endId=151"
```

Ajuste `startId`/`endId` para sincronizar outras faixas (por padrão, `1` a `151`, a primeira geração).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

- App em `http://localhost:5173` (padrão do Vite).
- Requer o backend rodando em `localhost:8080` para o proxy `/api` funcionar.

Outros scripts disponíveis:

```bash
npm run build     # build de produção (pasta dist/)
npm run preview   # serve o build de produção localmente
npm run lint       # roda o oxlint
```

### 4. Rodando tudo via Docker

Hoje **não existe Dockerfile** para o backend nem para o frontend — o `docker-compose.yml` do projeto sobe apenas a infraestrutura de apoio (Postgres e, opcionalmente, o agente de observabilidade Grafana Alloy). Backend e frontend são executados diretamente na máquina (`mvnw` / `npm run dev`), como descrito acima.

```bash
cd backend
docker compose up -d        # sobe postgres + alloy
docker compose down         # para os containers
docker compose down -v      # para e apaga o volume de dados do Postgres
```

## Observabilidade (opcional)

O backend já expõe métricas Prometheus (`/actuator/prometheus`) e envia logs via Loki Logback Appender. O `docker-compose.yml` inclui um serviço `alloy` (Grafana Alloy) que lê essas métricas do host (`host.docker.internal:8080`) e as envia (*remote write*) para uma conta Grafana Cloud.

Para habilitar isso:

1. Copie `backend/.env.example` para `backend/.env`.
2. Preencha `GC_PROMETHEUS_URL`, `GC_PROMETHEUS_USER`, `GC_LOKI_URL`, `GC_LOKI_USER` e `GC_API_KEY` com as credenciais da sua conta Grafana Cloud (veja `backend/observability/README.md` para o passo a passo de onde encontrar cada valor).
3. Suba o `alloy` junto com o Postgres: `docker compose up -d`.

Dashboards prontos para importar estão em `backend/observability/dashboards-para-importar/` (métricas Spring Boot e logs/erros). Sem esse `.env` preenchido, o backend continua funcionando normalmente — a observabilidade externa apenas fica desativada.

> ⚠️ O arquivo `.env` (com credenciais reais) não deve ser commitado — só `.env.example` deve ir para o repositório.

## Roadmap / limitações conhecidas

- Não há autenticação/autorização (rotas todas públicas).
- As telas "Coleção" (marcar Pokémon capturados) e "Times" (montar times e ver cobertura de tipos) aparecem na Home mas ainda não foram implementadas.
- `POST /api/pokemon/sync` é uma rota administrativa sem proteção — em produção precisaria de algum controle de acesso.
- Não há Dockerfile/imagem própria para backend ou frontend; o deploy hoje é manual (build do JAR / build do Vite).
