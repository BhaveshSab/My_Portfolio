// Vercel Serverless Function: GET /api/health
// Quick way to confirm mail credentials are configured after deploying —
// visit https://<your-domain>/api/health and check "mailConfigured".
import { buildTransport } from './_lib/mailer.js';

export default function handler(req, res) {
  res.status(200).json({ ok: true, mailConfigured: Boolean(buildTransport()) });
}
