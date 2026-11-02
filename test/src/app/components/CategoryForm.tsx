"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { FormState } from "@/src/app/actions";

type Props = {
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  initial?: { name: string; description: string | null };
  submitLabel: string;
  cancelHref?: string;
};

export function CategoryForm({ action, initial, submitLabel, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="form">
      {state?.error && <p className="alert">{state.error}</p>}

      <label className="field">
        <span>ชื่อหมวดหมู่ *</span>
        <input name="name" required maxLength={100} defaultValue={initial?.name} placeholder="เช่น นิยาย, การเขียนโปรแกรม" />
      </label>

      <label className="field">
        <span>คำอธิบาย</span>
        <textarea name="description" rows={3} defaultValue={initial?.description ?? ""} />
      </label>

      <div className="actions">
        <button type="submit" className="btn primary" disabled={pending}>
          {pending ? "กำลังบันทึก..." : submitLabel}
        </button>
        {cancelHref && (
          <Link href={cancelHref} className="btn ghost">
            ยกเลิก
          </Link>
        )}
      </div>
    </form>
  );
}
