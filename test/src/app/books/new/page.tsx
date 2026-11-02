import Link from "next/link";

import { createBookAction } from "@/src/app/actions";
import { BookForm } from "@/src/app/components/BookForm";
import { listCategories } from "@/src/lib/data";

export const dynamic = "force-dynamic";

export default async function NewBookPage() {
  const categories = await listCategories();

  return (
    <>
      <div className="pageHead">
        <h1>เพิ่มหนังสือ</h1>
      </div>
      {categories.length === 0 ? (
        <p className="empty">
          ต้องมีหมวดหมู่อย่างน้อย 1 รายการก่อน — <Link href="/categories">สร้างหมวดหมู่</Link>
        </p>
      ) : (
        <BookForm
          action={createBookAction}
          categories={categories}
          submitLabel="บันทึกหนังสือ"
          cancelHref="/books"
        />
      )}
    </>
  );
}
