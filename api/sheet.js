/**
 * Proxy สำหรับดึง CSV จาก Google Sheet (แก้ CORS เมื่อรันบน Vercel)
 * รับ POST { sheetId, gid? } ส่งกลับเป็นข้อความ CSV
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sheetId = req.method === 'POST' ? (req.body?.sheetId) : req.query?.sheetId;
  const gid = req.method === 'POST' ? (req.body?.gid) : req.query?.gid;

  if (!sheetId || typeof sheetId !== 'string') {
    return res.status(400).json({ error: 'ต้องส่ง sheetId' });
  }

  try {
    let url = `https://docs.google.com/spreadsheets/d/${sheetId.trim()}/export?format=csv`;
    if (gid) url += `&gid=${gid}`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'DoctorLookup/1.0 (Vercel Serverless)' },
    });

    if (!response.ok) {
      return res.status(response.status).send('ไม่สามารถอ่าน Sheet ได้ (อาจยังไม่แชร์เป็น "Anyone with the link")');
    }

    const csv = await response.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(csv);
  } catch (err) {
    console.error('Sheet proxy error:', err.message);
    return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล Sheet');
  }
}
