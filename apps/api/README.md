# DuoFinder API (NestJS)

## Dev
1. Copy `.env.example` to `.env` and adjust.
2. From repo root:

```bash
pnpm i
pnpm db:up
pnpm --filter @duo/api prisma:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

API runs on `http://localhost:4000`.
