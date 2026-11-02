import Link from "next/link";

import { coverUrl, formatPrice } from "@/src/lib/format";

type Props = {
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    coverType: string | null;
    updatedAt: string | Date;
    category: { name: string } | null;
  };
};

export function BookCard({ book }: Props) {
  const cover = coverUrl(book);
  return (
    <Link href={`/books/${book.id}`} className="card">
      <div className="cardCover">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={`ปก ${book.title}`} loading="lazy" />
        ) : (
          <span className="noCover">{book.title.slice(0, 1)}</span>
        )}
      </div>
      <div className="cardBody">
        {book.category && <span className="tag">{book.category.name}</span>}
        <strong className="cardTitle">{book.title}</strong>
        <span className="muted">{book.author}</span>
        <span className="price">{formatPrice(book.price)}</span>
      </div>
    </Link>
  );
}
