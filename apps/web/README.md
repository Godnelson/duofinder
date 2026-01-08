# DuoFinder Web (Next.js App Router)

## Dev
Create `.env.local` from `.env.local.example`.

From repo root:

```bash
pnpm i
pnpm dev
```

Web runs on `http://localhost:3000`.

## Auth
Rotas protegidas verificam o cookie `accessToken` e redirecionam para `/login` quando ausente.
