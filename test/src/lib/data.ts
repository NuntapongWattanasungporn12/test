import "server-only";

import { and, or } from "@prisma/orm-sqlite/orm-client";

// Loaded lazily so `next build` never opens a database connection.
async function getDb() {
  const { db } = await import("../prisma/db");
  return db;
}

/** Escape LIKE wildcards so a search for "50%" matches literally. */
function likePattern(text: string) {
  return `%${text.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

// ---------- Categories ----------

export async function listCategories() {
  const db = await getDb();
  return db.orm.Category.select("id", "name", "description", "createdAt")
    .include("books", (books) => books.count())
    .orderBy((c) => c.name.asc())
    .all();
}

export async function getCategory(id: string) {
  const db = await getDb();
  return db.orm.Category.select("id", "name", "description").where({ id }).first();
}

export async function findCategoryByName(name: string) {
  const db = await getDb();
  return db.orm.Category.select("id").where({ name }).first();
}

export async function createCategory(data: { name: string; description: string | null }) {
  const db = await getDb();
  return db.orm.Category.select("id").create(data);
}

export async function updateCategory(id: string, data: { name: string; description: string | null }) {
  const db = await getDb();
  return db.orm.Category.where({ id }).select("id").update(data);
}

export async function countBooksInCategory(categoryId: string) {
  const db = await getDb();
  const { total } = await db.orm.Book.where({ categoryId }).aggregate((a) => ({
    total: a.count(),
  }));
  return total;
}

export async function deleteCategory(id: string) {
  const db = await getDb();
  return db.orm.Category.where({ id }).select("id").delete();
}

// ---------- Books ----------

/** Every Book field except the cover bytes, which can be large. */
const BOOK_FIELDS = [
  "id",
  "title",
  "author",
  "isbn",
  "price",
  "publishedYear",
  "description",
  "coverType",
  "categoryId",
  "createdAt",
  "updatedAt",
] as const;

export async function listBooks(filter: { q?: string; categoryId?: string } = {}) {
  const db = await getDb();
  const q = filter.q?.trim();
  const categoryId = filter.categoryId;

  return db.orm.Book.select(...BOOK_FIELDS)
    .include("category", (c) => c.select("id", "name"))
    .where((b) =>
      and(
        q
          ? or(b.title.like(likePattern(q)), b.author.like(likePattern(q)), b.isbn.like(likePattern(q)))
          : b.id.isNotNull(),
        categoryId ? b.categoryId.eq(categoryId) : b.id.isNotNull(),
      ),
    )
    .orderBy((b) => b.createdAt.desc())
    .all();
}

export async function getBook(id: string) {
  const db = await getDb();
  return db.orm.Book.select(...BOOK_FIELDS)
    .include("category", (c) => c.select("id", "name"))
    .where({ id })
    .first();
}

export async function getBookCover(id: string) {
  const db = await getDb();
  return db.orm.Book.select("coverData", "coverType", "updatedAt").where({ id }).first();
}

export type BookInput = {
  title: string;
  author: string;
  isbn: string | null;
  price: number;
  publishedYear: number | null;
  description: string | null;
  categoryId: string;
};

export type CoverChange =
  | { kind: "keep" }
  | { kind: "remove" }
  | { kind: "replace"; data: Uint8Array; type: string };

export async function createBook(data: BookInput, cover: CoverChange) {
  const db = await getDb();
  return db.orm.Book.select("id").create({
    ...data,
    coverData: cover.kind === "replace" ? cover.data : null,
    coverType: cover.kind === "replace" ? cover.type : null,
  });
}

export async function updateBook(id: string, data: BookInput, cover: CoverChange) {
  const db = await getDb();
  const coverFields =
    cover.kind === "replace"
      ? { coverData: cover.data, coverType: cover.type }
      : cover.kind === "remove"
        ? { coverData: null, coverType: null }
        : {};
  return db.orm.Book.where({ id }).select("id").update({ ...data, ...coverFields });
}

export async function deleteBook(id: string) {
  const db = await getDb();
  return db.orm.Book.where({ id }).select("id").delete();
}

export async function getStats() {
  const db = await getDb();
  const [books, categories] = await Promise.all([
    db.orm.Book.aggregate((a) => ({ total: a.count() })),
    db.orm.Category.aggregate((a) => ({ total: a.count() })),
  ]);
  return { books: books.total, categories: categories.total };
}
