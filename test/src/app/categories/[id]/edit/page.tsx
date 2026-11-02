import { notFound } from "next/navigation";

import { updateCategoryAction } from "@/src/app/actions";
import { CategoryForm } from "@/src/app/components/CategoryForm";
import { getCategory } from "@/src/lib/data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) notFound();

  return (
    <>
      <div className="pageHead">
        <h1>แก้ไขหมวดหมู่</h1>
      </div>
      <section className="panel narrow">
        <CategoryForm
          action={updateCategoryAction.bind(null, category.id)}
          initial={category}
          submitLabel="บันทึกการแก้ไข"
          cancelHref="/categories"
        />
      </section>
    </>
  );
}
