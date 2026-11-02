import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "ห้องสมุดหนังสือ",
  description: "ระบบจัดการหนังสือและหมวดหมู่ (CRUD + อัปโหลดปก)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <header className="topbar">
          <div className="topbarInner">
            <Link href="/" className="brand">
              <span className="brandMark">B</span> ห้องสมุดหนังสือ
            </Link>
            <nav className="nav">
              <Link href="/books">หนังสือ</Link>
              <Link href="/categories">หมวดหมู่</Link>
              <Link href="/books/new" className="btn primary small">
                + เพิ่มหนังสือ
              </Link>
            </nav>
          </div>
        </header>
        <main className="shell">{children}</main>
      </body>
    </html>
  );
}
