# ห้องสมุดหนังสือ — Books & Catalog CRUD

Next.js + Prisma 8 web app using a local SQLite database, with full CRUD for two tables and cover image upload.

| Table | Fields |
| --- | --- |
| `Category` (catalog) | name (unique), description |
| `Book` | title, author, ISBN, price, published year, description, cover image, category |

Features:

- Categories: add, edit, delete. A category that still has books can't be deleted.
- Books: add, edit, delete, view details, search by title/author/ISBN, filter by category.
- Cover upload: JPG / PNG / WEBP / GIF up to 5 MB, with a live preview. The image is stored in the database (`Book.coverData`), so it also works on hosts without a persistent disk. It's served by `GET /api/books/[id]/cover`.

## Code map

| Path | What it does |
| --- | --- |
| `src/prisma/contract.ts` | Data model (the two tables) |
| `migrations-sqlite/app/` | SQLite migrations |
| `migrations/app/` | Previous PostgreSQL migration history; not used by the SQLite config |
| `src/lib/data.ts` | All database queries |
| `src/app/actions.ts` | Server actions: validation + create / update / delete |
| `src/app/books/`, `src/app/categories/` | Pages |
| `src/app/components/` | Forms, book card, delete button |
| `src/app/api/books/[id]/cover/route.ts` | Serves cover images |

## Run locally

No database server or Docker is needed. Use Node.js 22.18+, 24.11+, or 26+. SQLite stores data in `books.db` in the project root by default.

```bash
npm install
npm run db:init   # first run: create tables and the database marker
npm run dev       # http://localhost:3000
```

To use a different file, set `DATABASE_PATH` in `.env` (see `.env.example`):

```env
DATABASE_PATH="./books.db"
```

SQLite starts with an empty database. Existing PostgreSQL data is not copied or modified; the previous database and migration history remain untouched.

## After changing the data model

```bash
npm run contract:emit
npm run migration:plan
npm run db:migrate
```

The existing Prisma Composer PostgreSQL deployment has been removed from the active configuration; this SQLite setup is for local use.
