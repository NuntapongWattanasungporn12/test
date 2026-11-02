import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteBookAction } from "@/src/app/actions";
import { DeleteButton } from "@/src/app/components/DeleteButton";
import { getBook } from "@/src/lib/data";
import { coverUrl, formatDate, formatPrice } from "@/src/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  const cover = coverUrl(book);

  return (
    <>
      <p className="crumbs">
        <Link href="/books">หนังสือ</Link> / {book.title}
      </p>

      <article className="detail">
        <div className="detailCover">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={`ปก ${book.title}`} />
          ) : (
            <span className="noCover">{book.title.slice(0, 1)}</span>
          )}
        </div>

        <div className="detailBody">
          {book.category && (
            <Link href={`/books?category=${book.category.id}`} className="tag">
              {book.category.name}
            </Link>
          )}
          <h1>{book.title}</h1>
          <p className="muted">โดย {book.author}</p>
          <p className="price big">{formatPrice(book.price)}</p>

          <dl className="meta">
            <dt>ISBN</dt>
            <dd>{book.isbn ?? "—"}</dd>
            <dt>ปีที่พิมพ์</dt>
            <dd>{book.publishedYear ?? "—"}</dd>
            <dt>เพิ่มเมื่อ</dt>
            <dd>{formatDate(book.createdAt)}</dd>
            <dt>แก้ไขล่าสุด</dt>
            <dd>{formatDate(book.updatedAt)}</dd>
          </dl>

          {book.description && <p className="description">{book.description}</p>}

          <div className="actions">
            <Link href={`/books/${book.id}/edit`} className="btn primary">
              แก้ไข
            </Link>
            <DeleteButton
              action={deleteBookAction.bind(null, book.id)}
              confirmText={`ลบหนังสือ "${book.title}" ใช่ไหม?`}
            />
          </div>
        </div>
      </article>
    </>
  );
}
