# MOTIVEX - Developing

A web-based HTS (Home Trading System) platform for Korean equities, US equities, cryptocurrency, and options — all in one place. Built on a microservices architecture with real-money trading as the target.

> **Status:** Active development. No public release yet. Targeting April 2027.

---

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Build](#build)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Requirements

### System

- Node.js >= 20.x
- Go >= 1.22 (matching engine)
- Docker + Docker Compose
- pnpm >= 9.x

### Services (local)

- PostgreSQL 16
- Redis 7
- Apache Kafka 3.x

### Environment

- AWS account (EKS, Secrets Manager, S3)
- API credentials for at least one market connector (see [Configuration](#configuration))

---

## Getting Started

```bash
git clone https://github.com/your-org/motivex.git
cd motivex

cp .env.example .env.local

pnpm install

# Spin up local dependencies
docker compose up -d

# Run database migrations
pnpm db:migrate

# Start dev server
pnpm dev
```

The web app will be available at `http://localhost:3000`.

To run the matching engine separately:

```bash
cd services/matching-engine
go run ./cmd/main.go
```

---

## Build

### Web app

```bash
pnpm build
pnpm start
```

### Matching engine

```bash
cd services/matching-engine
go build -o bin/matching-engine ./cmd/main.go
./bin/matching-engine
```

### Docker

```bash
# Build all services
docker compose -f docker-compose.prod.yml build

# Run
docker compose -f docker-compose.prod.yml up
```

---

## Configuration

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `NEXTAUTH_SECRET` | Auth secret (any random string) |
| `KIS_APP_KEY` / `KIS_APP_SECRET` | Korea Investment & Securities API |
| `UPBIT_ACCESS_KEY` / `UPBIT_SECRET_KEY` | Upbit API |
| `ALPACA_API_KEY` / `ALPACA_SECRET_KEY` | Alpaca (US equities) |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_REGION` | e.g. `ap-northeast-2` |

Market connectors are optional at dev time — mock data is used as fallback when credentials are absent.

---

## Project Structure

```
motivex/
├── app/                    # Next.js 16 App Router
│   ├── (auth)/             # Login, register
│   ├── (trading)/          # Dashboard, stocks, crypto, options, portfolio
│   └── api/                # Route handlers (auth, market, orders, websocket)
├── components/
│   ├── trading/            # Chart, order book, order form, position table
│   ├── dashboard/          # Market overview, watchlist, portfolio summary
│   └── ui/                 # shadcn/ui base components
├── lib/
│   ├── api/                # API clients
│   ├── websocket/          # WebSocket manager
│   ├── store/              # Zustand stores
│   └── utils/
├── services/               # Independently deployed backend services
│   ├── market-data/        # Real-time price ingestion
│   ├── order-service/      # Order management
│   └── matching-engine/    # Go/Rust matching engine
└── scripts/                # DB migrations, seed data
```

---

## Contributing

1. Branch off `main`

```bash
git checkout -b feat/your-feature
```

2. Make changes and write tests. Coverage target is **80%**.

```bash
pnpm test
```

3. Follow the commit convention:

```
feat:     new feature
fix:      bug fix
refactor: code change with no behavior change
test:     add or update tests
docs:     documentation only
chore:    build, config, tooling
```

4. Open a pull request against `main`. CI must pass before merge.

---

## Roadmap

| Phase | Period | Scope |
|---|---|---|
| 1 | Month 1–3 | Licensing & legal (FSC registration, FIU filing) |
| 2 | Month 2–4 | Architecture design, API contracts |
| Sprint 1–2 | Month 3–4 | Core infra: auth, DB schema, WebSocket, CI/CD |
| Sprint 3–4 | Month 5–6 | Market data: price ingestion, order book, OHLCV, news |
| Sprint 5–6 | Month 7–8 | Trading engine: order manager, matching, risk, fees |
| Sprint 7–8 | Month 9–10 | Frontend: dashboard, charts, order UI, portfolio, options |
| 4 | Month 9–11 | Testing & security audit |
| 5 | Month 11–12 | Deployment, monitoring, canary rollout |

---

## License

TBD. All rights reserved until a license is formally chosen.

---

## Contact

For questions about the project, open an issue or reach the core team at `dev@motivex.io`.
