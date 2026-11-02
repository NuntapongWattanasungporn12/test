import Link from "next/link";

import { BookCard } from "@/src/app/components/BookCard";
import { getStats, listBooks } from "@/src/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, books] = await Promise.all([getStats(), listBooks()]);
  const latest = books.slice(0, 4);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Web Contemporary · CRUD</p>
        <h1>จัดการหนังสือและหมวดหมู่ในที่เดียว</h1>
        <p className="lede">เพิ่ม แก้ไข ลบ และค้นหาหนังสือ พร้อมอัปโหลดรูปปก</p>
      </section>

      <section className="stats">
        <Link href="/books" className="stat">
          <strong>{stats.books}</strong>
          <span>หนังสือทั้งหมด</span>
        </Link>
        <Link href="/categories" className="stat">
          <strong>{stats.categories}</strong>
          <span>หมวดหมู่</span>
        </Link>
      </section>

      <section>
        <div className="sectionHead">
          <h2>หนังสือล่าสุด</h2>
          <Link href="/books">ดูทั้งหมด →</Link>
        </div>
        {latest.length === 0 ? (
          <p className="empty">
            ยังไม่มีหนังสือ — <Link href="/categories">สร้างหมวดหมู่</Link> ก่อน แล้ว{" "}
            <Link href="/books/new">เพิ่มหนังสือ</Link>
          </p>
        ) : (
          <div className="grid">
            {latest.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
