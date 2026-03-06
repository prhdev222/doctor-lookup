# Doctor Lookup

ระบบค้นหาข้อมูลแพทย์ (Internal Use) — ใช้ Google Sheet เป็นแหล่งข้อมูล และ PIN สำหรับเข้าใช้งาน

## Tech

- Static HTML + vanilla JS
- Vercel Serverless API (`/api/config`) สำหรับตรวจ PIN และส่ง config

## Deploy บน Vercel

1. เชื่อม Vercel กับ repo นี้ที่ [vercel.com](https://vercel.com)
2. ตั้ง **Environment Variables** ใน Vercel:
   - `APP_PIN` — รหัส PIN 6 หลัก
   - `CONFIG_SHEET_ID` — Google Sheet ID ของ config
   - `CONFIG_GID_SHEETS` — GID ของ sheet รายชื่อ (ถ้ามี)
   - `CONFIG_GID_EMAILS` — (ถ้าใช้)
   - `GOOGLE_FORM_URL` — URL ของ Google Form (ถ้ามี)

3. Deploy — Vercel จะให้ URL เช่น `https://doctor-lookup-xxx.vercel.app`

## รัน local

```bash
npm i -g vercel
vercel dev
```

เปิด `http://localhost:3000` และตั้ง env ใน `.env.local`
