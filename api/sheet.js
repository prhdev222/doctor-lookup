/**
 * Proxy สำหรับดึงข้อมูลจาก Google Sheet
 * ใช้เฉพาะ CSV export URL — ต้องแชร์ Sheet เป็น "Anyone with the link can view"
 * ไม่ต้องตั้ง API หรือ Service Account ใน Google Cloud
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sheetId = (req.method === 'POST' ? req.body?.sheetId : req.query?.sheetId)?.trim();
  const gid = req.method === 'POST' ? req.body?.gid : req.query?.gid;

  if (!sheetId) {
    return res.status(400).send('ต้องส่ง sheetId');
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gid != null && gid !== '' ? `&gid=${gid}` : ''}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'DoctorLookup/1.0 (Vercel Serverless)' },
    });

    if (!response.ok) {
      const status = response.status;
      const hint =
        status === 401 || status === 403
          ? 'แชร์ Sheet เป็น "Anyone with the link can view" (Share → เปลี่ยนเป็น Anyone with the link)'
          : 'ตรวจสอบว่า Sheet ID ถูกต้อง';
      return res.status(status).send(`ไม่สามารถอ่าน Sheet ได้ (${status}). ${hint}`);
    }

    const csv = await response.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(csv);
  } catch (err) {
    console.error('Sheet proxy error:', err.message);
    return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล Sheet: ' + err.message);
  }
}
