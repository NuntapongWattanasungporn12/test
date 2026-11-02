"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as data from "@/src/lib/data";

export type FormState = { error?: string } | undefined;

const MAX_COVER_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_COVER_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(form: FormData, key: string) {
  return text(form, key) || null;
}

// ---------- Categories ----------

function readCategory(form: FormData) {
  const name = text(form, "name");
  if (!name) return { error: "กรุณากรอกชื่อหมวดหมู่" } as const;
  if (name.length > 100) return { error: "ชื่อหมวดหมู่ยาวเกิน 100 ตัวอักษร" } as const;
  return { value: { name, description: optionalText(form, "description") } } as const;
}

export async function createCategoryAction(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = readCategory(form);
  if ("error" in parsed) return { error: parsed.error };

  if (await data.findCategoryByName(parsed.value.name)) {
    return { error: `มีหมวดหมู่ "${parsed.value.name}" อยู่แล้ว` };
  }
  await data.createCategory(parsed.value);

  revalidatePath("/categories");
  redirect("/categories");
}

export async function updateCategoryAction(
  id: string,
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const parsed = readCategory(form);
  if ("error" in parsed) return { error: parsed.error };

  const existing = await data.findCategoryByName(parsed.value.name);
  if (existing && existing.id !== id) {
    return { error: `มีหมวดหมู่ "${parsed.value.name}" อยู่แล้ว` };
  }
  await data.updateCategory(id, parsed.value);

  revalidatePath("/categories");
  revalidatePath("/books");
  redirect("/categories");
}

export async function deleteCategoryAction(id: string): Promise<FormState> {
  const count = await data.countBooksInCategory(id);
  if (count > 0) {
    return { error: `ลบไม่ได้ เพราะยังมีหนังสือ ${count} เล่มในหมวดหมู่นี้` };
  }
  await data.deleteCategory(id);
  revalidatePath("/categories");
  return undefined;
}

// ---------- Books ----------

function readBook(form: FormData) {
  const title = text(form, "title");
  const author = text(form, "author");
  const categoryId = text(form, "categoryId");
  const priceText = text(form, "price");
  const yearText = text(form, "publishedYear");

  if (!title) return { error: "กรุณากรอกชื่อหนังสือ" } as const;
  if (!author) return { error: "กรุณากรอกชื่อผู้แต่ง" } as const;
  if (!categoryId) return { error: "กรุณาเลือกหมวดหมู่" } as const;

  const price = Number(priceText);
  if (priceText === "" || !Number.isFinite(price) || price < 0) {
    return { error: "ราคาต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป" } as const;
  }

  let publishedYear: number | null = null;
  if (yearText) {
    publishedYear = Number(yearText);
    if (!Number.isInteger(publishedYear) || publishedYear < 0 || publishedYear > 3000) {
      return { error: "ปีที่พิมพ์ไม่ถูกต้อง" } as const;
    }
  }

  const value: data.BookInput = {
    title,
    author,
    isbn: optionalText(form, "isbn"),
    price,
    publishedYear,
    description: optionalText(form, "description"),
    categoryId,
  };
  return { value } as const;
}

async function readCover(form: FormData): Promise<{ error: string } | { value: data.CoverChange }> {
  const file = form.get("cover");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_COVER_TYPES.includes(file.type)) {
      return { error: "ไฟล์ปกต้องเป็นรูป JPG, PNG, WEBP หรือ GIF" };
    }
    if (file.size > MAX_COVER_BYTES) {
      return { error: "ไฟล์ปกต้องมีขนาดไม่เกิน 5 MB" };
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    return { value: { kind: "replace", data: bytes, type: file.type } };
  }
  if (form.get("removeCover") === "on") return { value: { kind: "remove" } };
  return { value: { kind: "keep" } };
}

async function categoryExists(id: string) {
  return (await data.getCategory(id)) !== null;
}

export async function createBookAction(_prev: FormState, form: FormData): Promise<FormState> {
  const book = readBook(form);
  if ("error" in book) return { error: book.error };
  const cover = await readCover(form);
  if ("error" in cover) return { error: cover.error };
  if (!(await categoryExists(book.value.categoryId))) return { error: "ไม่พบหมวดหมู่ที่เลือก" };

  const created = await data.createBook(book.value, cover.value);

  revalidatePath("/books");
  revalidatePath("/categories");
  redirect(`/books/${created.id}`);
}

export async function updateBookAction(
  id: string,
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const book = readBook(form);
  if ("error" in book) return { error: book.error };
  const cover = await readCover(form);
  if ("error" in cover) return { error: cover.error };
  if (!(await categoryExists(book.value.categoryId))) return { error: "ไม่พบหมวดหมู่ที่เลือก" };

  await data.updateBook(id, book.value, cover.value);

  revalidatePath("/books");
  revalidatePath(`/books/${id}`);
  revalidatePath("/categories");
  redirect(`/books/${id}`);
}

export async function deleteBookAction(id: string): Promise<FormState> {
  await data.deleteBook(id);
  revalidatePath("/books");
  revalidatePath("/categories");
  redirect("/books");
}
