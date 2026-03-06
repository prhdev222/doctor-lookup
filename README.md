# Doctor Lookup

ระบบค้นหาข้อมูลแพทย์ (Internal Use) — ใช้ Google Sheet เป็นแหล่งข้อมูล และ PIN สำหรับเข้าใช้งาน

## Tech

- Static HTML + vanilla JS
- Vercel Serverless API (`/api/config`, `/api/sheet`)
- รองรับการอ่าน Sheet ผ่าน **Service Account** (ไม่ต้องแชร์เป็นสาธารณะ)

## Deploy บน Vercel

1. เชื่อม Vercel กับ repo นี้
2. ตั้ง **Environment Variables**:
   - `APP_PIN` — รหัส PIN 6 หลัก
   - `CONFIG_SHEET_ID` — Google Sheet ID ของ config
   - `CONFIG_GID_SHEETS` — GID ของ sheet รายชื่อ (เช่น `0`)
   - `CONFIG_GID_EMAILS` — (ถ้าใช้)
   - `GOOGLE_FORM_URL` — URL ของ Google Form (ถ้ามี)

### อ่าน Sheet ได้โดยไม่ต้องแชร์ "Anyone with the link" (แนะนำ)

ใช้ **Google Service Account** แล้วแชร์ Sheet เฉพาะกับบัญชีนั้น:

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/) → สร้างโปรเจกต์ (หรือใช้โปรเจกต์เดิม)
2. เปิด **APIs & Services** → **Library** → ค้นหา **Google Sheets API** → Enable
3. **APIs & Services** → **Credentials** → **Create Credentials** → **Service account**
   - ตั้งชื่อแล้วกด Create → Skip role ถ้าต้องการ → Done
4. คลิก Service account ที่สร้าง → แท็บ **Keys** → **Add key** → **Create new key** → **JSON** → ดาวน์โหลด
5. เปิดไฟล์ JSON ที่ได้ → **คัดลอกเนื้อหาทั้งหมด** (ทั้งก้อน `{ ... }`)
6. ใน Vercel → Project → **Settings** → **Environment Variables** → เพิ่มตัวแปร:
   - **Name:** `GOOGLE_SERVICE_ACCOUNT_JSON`
   - **Value:** วาง JSON ที่คัดลอก (ทั้งก้อน)
   - เลือก Environment: Production (และ Preview ถ้าต้องการ)
7. เปิด Google Sheet ที่ใช้ (ทั้งไฟล์ Config และ Sheet ข้อมูล) → ปุ่ม **Share** → เพิ่มอีเมลของ Service account (ใน JSON มีฟิลด์ `client_email` เช่น `xxx@project.iam.gserviceaccount.com`) เป็น **Viewer** → Save

จากนั้น Redeploy โปรเจกต์ใน Vercel แล้วลองเข้าแอปอีกครั้ง

### ถ้าไม่ใช้ Service Account

ต้องแชร์ทุก Sheet ที่ใช้เป็น **"Anyone with the link can view"** ถึงจะอ่านได้ (ใช้วิธี export CSV)

## รัน local

```bash
npm i
npm i -g vercel
vercel dev
```

เปิด `http://localhost:3000` และตั้ง env ใน `.env.local` (รวมถึง `GOOGLE_SERVICE_ACCOUNT_JSON` ถ้าใช้)
