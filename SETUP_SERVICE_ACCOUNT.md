# ตั้งค่า Google Sheet ให้แอปอ่านได้

แอปใช้ **CSV export** ของ Google Sheet — **ไม่ต้อง** ตั้ง API หรือ Service Account ใน Google Cloud

## ขั้นตอน (ทำแค่ใน Google Sheet)

1. เปิด **Google Sheet** ที่ใช้กับแอป (ทั้งไฟล์ Config และไฟล์ข้อมูล เช่น ชื่อแพทย์เวร/โทรศัพท์)
2. กดปุ่ม **Share (แชร์)**
3. ใต้ "General access" เปลี่ยนเป็น **Anyone with the link** สิทธิ์ **Viewer**
4. Save

เสร็จแล้ว — แอปจะอ่าน Sheet ได้โดยไม่ต้องทำอย่างอื่น
