# Doctor Lookup

ระบบค้นหาข้อมูลแพทย์ (Internal Use) — ใช้ Google Sheet เป็นแหล่งข้อมูล และ PIN สำหรับเข้าใช้งาน

## Tech

- Static HTML + vanilla JS
- Vercel Serverless API (`/api/config`, `/api/sheet`)
- อ่าน Sheet ผ่าน **CSV export URL** — ไม่ต้องตั้ง API หรือ Service Account ใน Google Cloud

## การแชร์ Google Sheet

ทุก Sheet ที่แอปใช้ (ทั้ง Config และ Sheet ข้อมูล) ต้องแชร์เป็น **"Anyone with the link can view"**:

1. เปิด Google Sheet → กด **Share (แชร์)**
2. ใต้ "General access" เลือก **Anyone with the link** → สิทธิ์ **Viewer**
3. Save

แค่นี้แอปจะอ่านข้อมูลได้ผ่าน CSV export — ไม่ต้องเปิดใช้ Google Sheets API หรือสร้าง Service Account

## Deploy บน Vercel

1. เชื่อม Vercel กับ repo นี้
2. ตั้ง **Environment Variables**:
   - `APP_PIN` — รหัส PIN 6 หลัก
   - `CONFIG_SHEET_ID` — Google Sheet ID ของ config
   - `CONFIG_GID_SHEETS` — GID ของ sheet รายชื่อ (เช่น `0`)
   - `CONFIG_GID_EMAILS` — (ถ้าใช้)
   - `GOOGLE_FORM_URL` — URL ของ Google Form (ถ้ามี)

## รัน local

```bash
npm i
npx vercel dev
```

เปิด `http://localhost:3000` และตั้ง env ใน `.env.local`
