import Link from "next/link";

import { createCategoryAction, deleteCategoryAction } from "@/src/app/actions";
import { CategoryForm } from "@/src/app/components/CategoryForm";
import { DeleteButton } from "@/src/app/components/DeleteButton";
import { listCategories } from "@/src/lib/data";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <>
      <div className="pageHead">
        <div>
          <h1>หมวดหมู่ (Catalog)</h1>
          <p className="muted">ทั้งหมด {categories.length} หมวดหมู่</p>
        </div>
      </div>

      <div className="split">
        <section className="panel">
          <h2>เพิ่มหมวดหมู่</h2>
          <CategoryForm action={createCategoryAction} submitLabel="เพิ่มหมวดหมู่" />
        </section>

        <section className="panel">
          {categories.length === 0 ? (
            <p className="empty">ยังไม่มีหมวดหมู่</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>คำอธิบาย</th>
                  <th className="num">หนังสือ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/books?category=${c.id}`}>
                        <strong>{c.name}</strong>
                      </Link>
                    </td>
                    <td className="muted">{c.description ?? "—"}</td>
                    <td className="num">{c.books}</td>
                    <td className="rowActions">
                      <Link href={`/categories/${c.id}/edit`} className="btn small">
                        แก้ไข
                      </Link>
                      <DeleteButton
                        action={deleteCategoryAction.bind(null, c.id)}
                        confirmText={`ลบหมวดหมู่ "${c.name}" ใช่ไหม?`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}
