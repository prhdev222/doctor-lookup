export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { pin } = req.body || {};
  const correctPin = process.env.APP_PIN;

  if (!pin || String(pin) !== String(correctPin)) {
    return res.status(401).json({ error: 'PIN ไม่ถูกต้อง' });
  }

  // PIN ถูกต้อง → ส่ง config กลับ
  return res.status(200).json({
    config_sheet_id: process.env.CONFIG_SHEET_ID,
    config_gid_sheets: process.env.CONFIG_GID_SHEETS || '0',
    config_gid_emails: process.env.CONFIG_GID_EMAILS || '',
    google_form_url: process.env.GOOGLE_FORM_URL || '',
  });
}
