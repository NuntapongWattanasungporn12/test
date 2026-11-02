import { notFound } from "next/navigation";

import { updateBookAction } from "@/src/app/actions";
import { BookForm } from "@/src/app/components/BookForm";
import { getBook, listCategories } from "@/src/lib/data";
import { coverUrl } from "@/src/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditBookPage({ params }: Props) {
  const { id } = await params;
  const [book, categories] = await Promise.all([getBook(id), listCategories()]);
  if (!book) notFound();

  return (
    <>
      <div className="pageHead">
        <h1>แก้ไขหนังสือ</h1>
      </div>
      <BookForm
        action={updateBookAction.bind(null, book.id)}
        categories={categories}
        initial={{ ...book, coverUrl: coverUrl(book) }}
        submitLabel="บันทึกการแก้ไข"
        cancelHref={`/books/${book.id}`}
      />
    </>
  );
}
