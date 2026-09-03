# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Comm_Link contact form (mail backend)

The contact form on the site (`src/components/Contact.jsx`) posts to `/api/contact`, which is backed by the same mail logic in two places:

- **`api/contact.js`** — a Vercel Serverless Function, used automatically in production. No extra config needed beyond the environment variables below; the frontend and this function are served from the same domain, so `fetch('/api/contact')` just works.
- **`server/index.js`** — a small Express server for local development. Run it alongside `npm run dev` (or use `npm run dev:all` to start both at once). The Vite dev server proxies `/api/*` to it (see `vite.config.js`).

Both import their mail-sending logic from `api/_lib/mailer.js`, so there's a single source of truth.

### Configuring mail credentials

Set **one** of these options as environment variables:

| Option | Variables |
|---|---|
| Gmail + App Password (simplest) | `GMAIL_USER`, `GMAIL_APP_PASSWORD` |
| Any SMTP provider | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` |

Optional: `CONTACT_TO_EMAIL` (defaults to `bhavesh.sabnani2005@gmail.com`).

- **Locally:** copy `server/.env.example` to `server/.env` and fill in the values (git-ignored, never committed).
- **On Vercel:** add the same variables under Project → Settings → Environment Variables (for Production and Preview), then redeploy.

To generate a Gmail App Password: turn on 2-Step Verification (https://myaccount.google.com/security), then create an App Password at https://myaccount.google.com/apppasswords.

After deploying, visit `/api/health` to confirm `mailConfigured: true`.
