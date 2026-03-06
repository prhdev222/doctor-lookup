/**
 * Proxy สำหรับดึงข้อมูลจาก Google Sheet
 * - ถ้ามี GOOGLE_SERVICE_ACCOUNT_JSON: ใช้ Sheets API (ไม่ต้องแชร์เป็น "Anyone with the link")
 * - ถ้าไม่มี: ใช้ export CSV (ต้องแชร์ Sheet เป็น "Anyone with the link can view")
 */
import { google } from 'googleapis';

function rowsToCSV(rows) {
  const escape = (cell) => {
    const s = String(cell ?? '');
    if (s.includes('"') || s.includes(',') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  return rows.map(row => row.map(escape).join(',')).join('\n');
}

async function fetchViaSheetsAPI(spreadsheetId, gid) {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') return null;
  let creds;
  try {
    creds = JSON.parse(raw);
  } catch {
    return null;
  }
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetList = res.data.sheets || [];
  const gidNum = gid ? parseInt(gid, 10) : 0;
  const sheet = sheetList.find(s => (s.properties?.sheetId ?? 0) === gidNum) || sheetList[0];
  if (!sheet) return null;
  const title = sheet.properties?.title || 'Sheet1';
  const range = `'${title.replace(/'/g, "''")}'!A:ZZ`;
  const val = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = val.data.values || [];
  return rowsToCSV(rows);
}

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
    // 1) ลองใช้ Service Account (Sheet ไม่ต้องแชร์สาธารณะ)
    const csvFromApi = await fetchViaSheetsAPI(sheetId, gid);
    if (csvFromApi !== null) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(csvFromApi);
    }

    // 2) Fallback: ใช้ export CSV (ต้องแชร์เป็น "Anyone with the link can view")
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gid ? `&gid=${gid}` : ''}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'DoctorLookup/1.0 (Vercel Serverless)' },
    });

    if (!response.ok) {
      const hint = response.status === 403
        ? 'แชร์ Sheet เป็น "Anyone with the link can view" หรือตั้งค่า Service Account ตาม README'
        : 'ตรวจสอบว่า Sheet ID ถูกต้องและมีการแชร์ที่เหมาะสม';
      return res.status(response.status).send(`ไม่สามารถอ่าน Sheet ได้ (${response.status}). ${hint}`);
    }

    const csv = await response.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(csv);
  } catch (err) {
    console.error('Sheet proxy error:', err.message);
    return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล Sheet: ' + err.message);
  }
}
