# Observabilidade — Grafana Cloud

O PokeManager envia logs e métricas direto para a sua conta **Grafana Cloud**
(a mesma que aparece em `https://<sua-conta>.grafana.net`).

## Como funciona

- **Logs**: o backend envia (via `loki-logback-appender`) direto pro Loki da
  sua conta Cloud, autenticado.
- **Métricas**: o backend expõe `/actuator/prometheus`. Como o Grafana Cloud
  não alcança o seu PC, um agente leve chamado **Grafana Alloy** (rodando no
  Docker) lê essas métricas e as **envia** (`remote_write`) pra nuvem.
- **Grafana**: você usa direto a interface da sua conta Cloud. Não tem mais
  Grafana rodando localmente.

## Passo 1 — Pegar as credenciais na sua conta Grafana Cloud

Acesse [grafana.com](https://grafana.com/), faça login e vá em
**"My Account"** → clique no card do seu stack (o mesmo nome que aparece
em `grafanacloud-xxxxx`).

### Prometheus (métricas)
Na página do stack, procure o bloco **"Prometheus"** → **"Details"**. Lá tem:
- **Remote Write Endpoint** → copie para `GC_PROMETHEUS_URL`
- **Username / Instance ID** → copie para `GC_PROMETHEUS_USER`

### Loki (logs)
Mesma página, bloco **"Loki"** → **"Details"**:
- **URL** (push) → copie para `GC_LOKI_URL`
- **Username / Instance ID** → copie para `GC_LOKI_USER`

### Token de acesso (senha dos dois acima)
Vá em **Administration → Users and access → Access Policies** (ou "API Keys",
dependendo da versão) → **Create access policy**:
- Marque os escopos `metrics:write` e `logs:write`
- Crie e copie o token gerado → `GC_API_KEY`

Guarde o token em lugar seguro — ele só é exibido uma vez.

## Passo 2 — Configurar o projeto

```bash
cd backend
cp .env.example .env
# edite o .env e cole os 5 valores que você acabou de copiar
```

## Passo 3 — Rodar

```bash
# sobe Postgres + Alloy (agente de métricas)
docker compose up -d

# sobe o backend normalmente
./mvnw spring-boot:run
```

Em ~15-30s as métricas já devem aparecer na sua conta Cloud, e os logs vão
chegando conforme o backend gera atividade.

## Passo 4 — Importar os dashboards prontos

Os dois dashboards que preparei estão em `observability/dashboards-para-importar/`.
Pra usá-los na sua conta:

1. No Grafana Cloud, vá em **Dashboards → New → Import**
2. Clique em **"Upload dashboard JSON file"** e selecione
   `spring-boot-metrics.json` (métricas) ou `logs-and-errors.json` (logs)
3. Na tela seguinte, escolha o seu datasource **Prometheus** (ou **Loki**,
   pro dashboard de logs) quando pedido
4. Clique em **Import**

## Testando

Force um erro qualquer no backend (ex: chamar um endpoint com ID inexistente)
e depois confira o dashboard "PokeManager - Logs e Erros" — ou vá direto em
**Drilldown → Logs**, filtre por `application = pokemanager`.

## Importante sobre custos

Isso tudo roda dentro do plano **Free** da Grafana Cloud (10k séries de
métricas, 50 GB de logs/mês, retenção de 14 dias — sem cartão de crédito).
Um projeto desse porte não chega nem perto desses limites.
