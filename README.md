# DuoFinder (Monorepo)

MVP de "encontrar duos" (tipo Tinder) para League of Legends.

- **apps/web**: Next.js (App Router)
- **apps/api**: NestJS + Prisma
- **db**: Postgres via Docker Compose
- **packages/shared**: tipos/constantes compartilhados

## Rodar (dev)

```bash
pnpm i
pnpm db:up
pnpm --filter @duo/api prisma:generate
pnpm db:migrate
pnpm db:seed

# em outro terminal
pnpm dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:4000`

## Regras de privacidade (core)
- O `nickname` **não** aparece no feed nem em "likes recebidos".
- O `nickname` só aparece no endpoint de **match**: `GET /matches/:id`.
