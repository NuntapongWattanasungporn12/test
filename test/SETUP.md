# คู่มือติดตั้งหลัง `git clone`

ใช้ฐานข้อมูล SQLite ผ่าน Prisma 8 ไม่ต้องติดตั้ง database server หรือ Docker

## สิ่งที่ต้องมี

- **Node.js 22.18+, 24.11+ หรือ 26+** (เช็กด้วย `node --version`)
- **Git**

## ติดตั้งครั้งแรก (ทำตามลำดับ)

```bash
# 1. ดึงโปรเจกต์ลงมา
git clone <repo-url>
cd <ชื่อโฟลเดอร์โปรเจกต์>

# 2. ติดตั้ง package
npm install

# 3. (ไม่บังคับ) สร้างไฟล์ .env ถ้าต้องการเปลี่ยนที่เก็บไฟล์ฐานข้อมูล
cp .env.example .env        # macOS / Linux / Git Bash
copy .env.example .env      # Windows (cmd / PowerShell)

# 4. สร้างฐานข้อมูล books.db และตารางทั้งหมดจาก migration
npm run db:migrate

# 5. รันเว็บ
npm run dev
```

เปิด http://localhost:3000

> ไฟล์ `books.db` ไม่ได้อยู่ใน git ทุกคนที่ clone จะได้ฐานข้อมูลว่างของตัวเอง

## เช็กว่าติดตั้งถูกต้อง

```bash
npm run db:verify          # ตารางในฐานข้อมูลตรงกับ Prisma contract
npm run migration:status   # ควรขึ้นว่า "Up to date"
```

## คำสั่งที่ใช้บ่อย

| คำสั่ง | ใช้ทำอะไร |
| --- | --- |
| `npm run dev` | รันเว็บโหมดพัฒนา |
| `npm run build` | build สำหรับ production |
| `npm run start` | รันเว็บที่ build แล้ว |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npm run db:migrate` | ใช้ migration ที่ยังไม่ได้รันกับฐานข้อมูล |
| `npm run db:verify` | ตรวจว่าฐานข้อมูลตรงกับ contract |
| `npm run migration:status` | ดูสถานะ migration |

## หลัง `git pull` (มีคนอื่นแก้โค้ด)

```bash
npm install          # เผื่อมี package ใหม่
npm run db:migrate   # เผื่อมี migration ใหม่
npm run dev
```

## เมื่อแก้โครงสร้างข้อมูล (ตาราง / ฟิลด์)

1. แก้ไฟล์ `src/prisma/contract.ts`
2. รันคำสั่ง:

```bash
npm run contract:emit    # สร้างไฟล์ใน src/prisma/generated ใหม่
npm run migration:plan   # สร้างไฟล์ migration ใหม่ใน migrations-sqlite/
npm run db:migrate       # นำ migration ไปใช้กับฐานข้อมูล
```

3. commit ทั้ง `src/prisma/generated/` และ `migrations-sqlite/` ขึ้น git ด้วย เพื่อให้คนอื่น `db:migrate` ตามได้

## แก้ปัญหาที่เจอบ่อย

| อาการ | วิธีแก้ |
| --- | --- |
| `Prisma SQLite requires Node.js 22.18+...` | อัปเดต Node.js แล้วปิด-เปิด terminal ใหม่ |
| ต้องการล้างข้อมูลทั้งหมดเริ่มใหม่ | หยุด `npm run dev` ลบไฟล์ `books.db` (และ `books.db-shm`, `books.db-wal` ถ้ามี) แล้วรัน `npm run db:migrate` |
| `db:verify` ไม่ผ่าน | รัน `npm run db:migrate` ถ้ายังไม่ผ่าน ให้ล้างฐานข้อมูลตามแถวด้านบน |
| port 3000 ถูกใช้อยู่ | `npm run dev -- -p 3001` |
