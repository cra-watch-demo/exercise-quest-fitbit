const ALLOWED_ORIGIN = 'https://cra-watch-demo.github.io';
const CLIENT_ID = '878456307288-5t0mp56atl9mpd1v0epv8c4ta0r3i2lb.apps.googleusercontent.com';
const REDIRECT_URI = 'https://cra-watch-demo.github.io/exercise-quest-fitbit/';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && req.headers.origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientSecret) {
    return res.status(503).json({ error: 'Backend is not configured yet: GOOGLE_CLIENT_SECRET missing.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch {}
  }
  const { code } = body;
  if (!code) return res.status(400).json({ error: 'Missing authorization code' });

  const params = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });

  const data = await response.json().catch(() => ({}));
  return res.status(response.status).json(data);
};
