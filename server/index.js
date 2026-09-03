// Comm_Link mail API — tiny standalone Express server that sends contact-form
// submissions from the portfolio's "Comm_Link" section as real email, instead
// of relying on a third-party client-side widget.
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
import nodemailer from 'nodemailer';

// Load server/.env explicitly (by file location, not process cwd) so this
// works whether the process is started from the repo root or this folder.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = Number(process.env.PORT) || 4001;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'bhavesh.sabnani2005@gmail.com';
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COOLDOWN_MS = 30_000; // one message per IP per 30s — cheap spam guard

// ---- Mail transport --------------------------------------------------------
// Two supported setups — configure ONE of them in server/.env (copy from
// server/.env.example):
//   1. Gmail + an App Password (simplest if the destination is a Gmail inbox)
//   2. Any SMTP provider (SendGrid, Mailgun, Zoho, a hosting provider, etc.)
function buildTransport() {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return null;
}

const senderAddress = process.env.GMAIL_USER || process.env.SMTP_USER;
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
      console.log(`[mail] Ready — messages will be delivered to ${CONTACT_TO_EMAIL}`);
    }
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({ success: false, error: 'Please enter a valid name.' });
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }
  if (typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 5000) {
    return res
      .status(400)
      .json({ success: false, error: 'Message must be between 5 and 5000 characters.' });
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

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  try {
    await transporter.sendMail({
      from: `"Bhavesh Portfolio — Comm_Link" <${senderAddress}>`,
      to: CONTACT_TO_EMAIL,
      replyTo: cleanEmail,
      subject: `New Comm_Link message from ${cleanName}`,
      text: `From: ${cleanName} <${cleanEmail}>\n\n${cleanMessage}`,
      html: `
        <div style="font-family: monospace; color:#111; line-height:1.6;">
          <p><strong>From:</strong> ${escapeHtml(cleanName)} (${escapeHtml(cleanEmail)})</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;">${escapeHtml(cleanMessage)}</p>
        </div>
      `,
    });

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
