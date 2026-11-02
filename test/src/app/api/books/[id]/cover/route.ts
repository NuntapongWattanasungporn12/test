import { getBookCover } from "@/src/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookCover(id);

  if (!book?.coverData || !book.coverType) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(book.coverData), {
    headers: {
      "Content-Type": book.coverType,
      "Content-Length": String(book.coverData.byteLength),
      "X-Content-Type-Options": "nosniff",
      // The page adds ?v=<updatedAt> to the URL, so a new upload gets a new URL.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
