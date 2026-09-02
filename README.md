# Clinical Review Workbench

A small full-stack TypeScript application for reviewing fictional clinical
condition candidates. It uses React with Vite, Express, Prisma, and SQLite.

All names and clinical data in this repository are fabricated for development.

## Local setup

Requires Node.js 22 or newer.

```sh
npm install
npm run db:setup
npm run dev
```

The client runs at `http://localhost:5173` and proxies API requests to the
Express server at `http://localhost:3001`.

## Checks

```sh
npm test
npm run typecheck
npm run build
```
