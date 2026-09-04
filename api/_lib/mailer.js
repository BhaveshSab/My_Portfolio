// Shared mail logic for the Comm_Link contact form.
//
// Used by TWO different runtimes:
//   - api/contact.js       -> Vercel serverless function (production)
//   - server/index.js      -> plain Express server (local dev, `npm run server`)
//
// Files/folders prefixed with `_` under `api/` are never deployed as their
// own Vercel Serverless Function routes, so this module is safe to import
// from api/contact.js without Vercel trying to expose it at /api/_lib/mailer.
import nodemailer from 'nodemailer';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Two supported setups, configured entirely via environment variables:
//   1. Gmail + an App Password (simplest for a personal Gmail inbox)
//   2. Any SMTP provider (SendGrid, Mailgun, Zoho, a hosting provider, etc.)
// Locally these come from server/.env (see server/.env.example). On Vercel
// they're set as Environment Variables in the project settings.
export function buildTransport() {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    // Explicit SMTP instead of nodemailer's `service: 'gmail'` preset: the
    // preset connects on port 465 (SMTPS), which many networks block.
    // Port 587 + STARTTLS is the standard, widely-allowed alternative.
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // STARTTLS — nodemailer upgrades the connection automatically
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

export function senderAddress() {
  return process.env.GMAIL_USER || process.env.SMTP_USER;
}

export function contactToEmail() {
  return process.env.CONTACT_TO_EMAIL || 'bhavesh.sabnani2005@gmail.com';
}

export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Returns an error string, or null if the payload is valid. */
export function validateContact({ name, email, message }) {
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return 'Please enter a valid name.';
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  if (typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 5000) {
    return 'Message must be between 5 and 5000 characters.';
  }
  return null;
}

export function buildMailOptions({ name, email, message }) {
  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  return {
    from: `"Bhavesh Portfolio \u2014 Comm_Link" <${senderAddress()}>`,
    to: contactToEmail(),
    // Replies from the inbox go straight back to whoever submitted the form.
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
  };
}
