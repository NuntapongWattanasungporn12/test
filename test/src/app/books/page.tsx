import Link from "next/link";

import { BookCard } from "@/src/app/components/BookCard";
import { listBooks, listCategories } from "@/src/lib/data";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export default async function BooksPage({ searchParams }: Props) {
  const { q = "", category = "" } = await searchParams;
  const [books, categories] = await Promise.all([
    listBooks({ q, categoryId: category || undefined }),
    listCategories(),
  ]);

  return (
    <>
      <div className="pageHead">
        <div>
          <h1>หนังสือ</h1>
          <p className="muted">ทั้งหมด {books.length} เล่ม</p>
        </div>
        <Link href="/books/new" className="btn primary">
          + เพิ่มหนังสือ
        </Link>
      </div>

      <form className="filters" action="/books">
        <input name="q" defaultValue={q} placeholder="ค้นหาชื่อหนังสือ ผู้แต่ง หรือ ISBN" />
        <select name="category" defaultValue={category}>
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.books})
            </option>
          ))}
        </select>
        <button type="submit" className="btn">
          ค้นหา
        </button>
        {(q || category) && (
          <Link href="/books" className="btn ghost">
            ล้าง
          </Link>
        )}
      </form>

      {books.length === 0 ? (
        <p className="empty">ไม่พบหนังสือ</p>
      ) : (
        <div className="grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </>
  );
}
