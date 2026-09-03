// Comm_Link mail API — tiny standalone Express server that sends contact-form
// submissions from the portfolio's "Comm_Link" section as real email. This is
// the LOCAL DEV counterpart of api/contact.js (the Vercel serverless function
// used in production) — both share the same mail logic from api/_lib/mailer.js
// so the two never drift out of sync.
//
// Run alongside the Vite dev server (in a second terminal):
//   npm run server
//
// The Vite dev server proxies /api/* to this process (see vite.config.js),
// so the frontend just calls fetch('/api/contact') with no CORS setup needed
// in development.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {
  buildTransport,
  validateContact,
  buildMailOptions,
  contactToEmail,
} from '../api/_lib/mailer.js';

// Load server/.env explicitly (by file location, not process cwd) so this
// works whether the process is started from the repo root or this folder.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = Number(process.env.PORT) || 4001;
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const COOLDOWN_MS = 30_000; // one message per IP per 30s — cheap spam guard

const transporter = buildTransport();

if (!transporter) {
  console.warn(
    '[mail] No mail credentials configured yet.\n' +
      '        Copy server/.env.example to server/.env and fill in either\n' +
      '        GMAIL_USER + GMAIL_APP_PASSWORD, or the SMTP_* variables.\n' +
      '        Until then, POST /api/contact will respond with 503.'
  );
} else {
  transporter.verify((err) => {
    if (err) {
      console.error('[mail] Transport verification failed:', err.message);
    } else {
      console.log(`[mail] Ready — messages will be delivered to ${contactToEmail()}`);
    }
  });
}

// ---- App --------------------------------------------------------------------
const app = express();
app.use(cors({ origin: CORS_ORIGINS }));
app.use(express.json({ limit: '20kb' }));

const lastSentAt = new Map();

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mailConfigured: Boolean(transporter) });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};

  const validationError = validateContact({ name, email, message });
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  if (!transporter) {
    return res.status(503).json({
      success: false,
      error: 'Mail server is not configured yet (see server/.env.example).',
    });
  }

  const ip = req.ip;
  const last = lastSentAt.get(ip);
  if (last && Date.now() - last < COOLDOWN_MS) {
    return res
      .status(429)
      .json({ success: false, error: 'Please wait a moment before sending another message.' });
  }

  try {
    await transporter.sendMail(buildMailOptions({ name, email, message }));
    lastSentAt.set(ip, Date.now());
    res.json({ success: true });
  } catch (err) {
    console.error('[mail] Failed to send:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`[server] Comm_Link mail API listening on http://localhost:${PORT}`);
});
