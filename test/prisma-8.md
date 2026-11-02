# Prisma 8 with SQLite

This project uses a local SQLite database. Use Node.js 22.18+, 24.11+, or 26+ as required by the Prisma 8 SQLite runtime.

## Data contract

The contract source is [`src/prisma/contract.ts`](src/prisma/contract.ts). The generated `src/prisma/generated/contract.json` and `contract.d.ts` files power runtime validation and TypeScript types; regenerate them after editing the source:

```bash
npm run contract:emit
```

SQLite has no schemas, so query models directly from `db.orm`:

```typescript
import { db } from "./src/prisma/db";

const categories = await db.orm.Category.select("id", "name").all();
```

## Database setup

The default database is `books.db` in the project root. Set `DATABASE_PATH` in `.env` to use another file.

```bash
npm run db:init
npm run dev
```

After changing the contract, create and apply a migration:

```bash
npm run contract:emit
npm run migration:plan -- --name describe-the-change
npm run db:migrate
```

The app starts with a new, empty SQLite database. PostgreSQL data is not copied, and the previous PostgreSQL database and migration history are left untouched. Composer's PostgreSQL deployment is no longer configured for this local SQLite setup.
