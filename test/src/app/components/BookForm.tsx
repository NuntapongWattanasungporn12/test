"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import type { FormState } from "@/src/app/actions";

type Category = { id: string; name: string };

type Props = {
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  categories: Category[];
  initial?: {
    title: string;
    author: string;
    isbn: string | null;
    price: number;
    publishedYear: number | null;
    description: string | null;
    categoryId: string;
    coverUrl: string | null;
  };
  submitLabel: string;
  cancelHref: string;
};

export function BookForm({ action, categories, initial, submitLabel, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);

  // Free the object URL made for the preview when it changes.
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const shownCover = preview ?? (removeCover ? null : initial?.coverUrl ?? null);

  return (
    <form action={formAction} className="form bookForm">
      {state?.error && <p className="alert">{state.error}</p>}

      <div className="coverPicker">
        <div className="coverFrame">
          {shownCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shownCover} alt="ตัวอย่างปกหนังสือ" />
          ) : (
            <span>ยังไม่มีปก</span>
          )}
        </div>
        <label className="btn ghost fileBtn">
          เลือกรูปปก
          <input
            type="file"
            name="cover"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
        </label>
        <small>JPG, PNG, WEBP หรือ GIF ไม่เกิน 5 MB</small>
        {initial?.coverUrl && !preview && (
          <label className="check">
            <input
              type="checkbox"
              name="removeCover"
              checked={removeCover}
              onChange={(e) => setRemoveCover(e.target.checked)}
            />
            ลบรูปปกเดิม
          </label>
        )}
      </div>

      <div className="fields">
        <label className="field">
          <span>ชื่อหนังสือ *</span>
          <input name="title" required defaultValue={initial?.title} />
        </label>

        <label className="field">
          <span>ผู้แต่ง *</span>
          <input name="author" required defaultValue={initial?.author} />
        </label>

        <label className="field">
          <span>หมวดหมู่ *</span>
          <select name="categoryId" required defaultValue={initial?.categoryId ?? ""}>
            <option value="" disabled>
              — เลือกหมวดหมู่ —
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="row">
          <label className="field">
            <span>ราคา (บาท) *</span>
            <input name="price" type="number" min="0" step="0.01" required defaultValue={initial?.price} />
          </label>
          <label className="field">
            <span>ปีที่พิมพ์</span>
            <input name="publishedYear" type="number" min="0" max="3000" defaultValue={initial?.publishedYear ?? ""} />
          </label>
        </div>

        <label className="field">
          <span>ISBN</span>
          <input name="isbn" defaultValue={initial?.isbn ?? ""} />
        </label>

        <label className="field">
          <span>เรื่องย่อ</span>
          <textarea name="description" rows={4} defaultValue={initial?.description ?? ""} />
        </label>

        <div className="actions">
          <button type="submit" className="btn primary" disabled={pending}>
            {pending ? "กำลังบันทึก..." : submitLabel}
          </button>
          <Link href={cancelHref} className="btn ghost">
            ยกเลิก
          </Link>
        </div>
      </div>
    </form>
  );
}
