// Vercel Serverless Function: POST /api/contact
//
// Handles Comm_Link form submissions in production. Deployed automatically
// by Vercel because it lives at api/contact.js — no extra config needed.
// The frontend calls the relative path fetch('/api/contact'), which works
// with zero setup because this function and the built frontend are served
// from the same Vercel domain.
//
// Configure ONE of these mail setups as Environment Variables in the Vercel
// project (Settings -> Environment Variables), for Production + Preview:
//   Option 1 (Gmail):  GMAIL_USER, GMAIL_APP_PASSWORD
//   Option 2 (SMTP):   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
// Optional: CONTACT_TO_EMAIL (defaults to bhavesh.sabnani2005@gmail.com).
import { buildTransport, validateContact, buildMailOptions } from './_lib/mailer.js';

// Best-effort spam guard: one message per IP per 30s. Serverless functions
// are stateless across cold starts and can run as multiple concurrent
// instances, so this Map is NOT a strict global rate limit — but it still
// blocks the common case (the same warm instance handling a rapid retry).
const lastSentAt = new Map();
const COOLDOWN_MS = 30_000;

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const { name, email, message } = req.body || {};

  const validationError = validateContact({ name, email, message });
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const transporter = buildTransport();
  if (!transporter) {
    return res.status(503).json({
      success: false,
      error:
        'Mail server is not configured. Set GMAIL_USER/GMAIL_APP_PASSWORD (or SMTP_*) in the Vercel project Environment Variables.',
    });
  }

  const ip = clientIp(req);
  const last = lastSentAt.get(ip);
  if (last && Date.now() - last < COOLDOWN_MS) {
    return res
      .status(429)
      .json({ success: false, error: 'Please wait a moment before sending another message.' });
  }

  try {
    await transporter.sendMail(buildMailOptions({ name, email, message }));
    lastSentAt.set(ip, Date.now());
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[mail] Failed to send:', err.message);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
}
