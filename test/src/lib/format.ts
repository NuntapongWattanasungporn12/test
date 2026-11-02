const baht = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" });
const dateFmt = new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" });

export function formatPrice(price: number) {
  return baht.format(price);
}

export function formatDate(value: string | Date) {
  return dateFmt.format(value instanceof Date ? value : new Date(value));
}

/** URL of a book's cover, or null. `v` changes on every edit so browsers refetch. */
export function coverUrl(book: { id: string; coverType: string | null; updatedAt: string | Date }) {
  const updatedAt = book.updatedAt instanceof Date ? book.updatedAt.toISOString() : book.updatedAt;
  return book.coverType ? `/api/books/${book.id}/cover?v=${encodeURIComponent(updatedAt)}` : null;
}
