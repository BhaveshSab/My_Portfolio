import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiSend,
  FiArrowUpRight,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiInstagram,
} from 'react-icons/fi';
import LetsBuildRadialBloom from './LetsBuildRadialBloom';

/**
 * CONTACT — the closing section.
 *
 * One block, two columns:
 *   LEFT  — the statement: "PULL ME INTO YOUR TEAM." plus the short bio,
 *           availability, direct email/phone and the usual links.
 *   RIGHT — the mail form that actually transmits: name, email, message,
 *           POSTed to /api/contact (see server/index.js, proxied by Vite in
 *           development and served by api/contact.js on Vercel in production).
 *
 * Palette is the site's own: black, #F3EDE2 type, #CBB59D muted, #D4AF37 accent.
 */
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL || '/api/contact';
const EMAIL = 'bhavesh.sabnani2005@gmail.com';
const PHONE = '+91 96643 20613';

const FIELD_CLASS =
  'w-full rounded-lg border border-[#CBB59D]/25 bg-white/[0.03] px-4 py-3 text-[15px] text-[#F3EDE2] outline-none transition-all duration-300 placeholder:text-[#CBB59D]/50 focus:border-[#D4AF37] focus:bg-[#D4AF37]/[0.04] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.12)]';

const LABEL_CLASS =
  'mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#CBB59D]';

const SOCIALS = [
  { Icon: FiGithub, label: 'GitHub', url: 'https://github.com/BhaveshSab' },
  {
    Icon: FiLinkedin,
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/bhavesh-sabnani-256946372/',
  },
  { Icon: FiInstagram, label: 'Instagram', url: 'https://www.instagram.com/bhaveshsab184' },
];

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        // The dev/prod mail server answers 503 until its credentials exist.
        if (res.status === 503) {
          throw new Error(
            `Mail is not configured on this server yet — write to ${EMAIL} and it lands straight in my inbox.`,
          );
        }
        throw new Error(data.error || 'Could not send that message. Please try again.');
      }

      setStatus({ type: 'success', message: 'Message sent — it is in my inbox now.' });
      toast.success('Message sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      const text = err.message || 'Could not send that message. Please try again.';
      setStatus({ type: 'error', message: text });
      toast.error('Message not sent');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative bg-black font-sans text-[#E8DFD8]">
      {/* ============ LET'S-BUILD skill ecosystem ============ */}
      <LetsBuildRadialBloom />

      {/* ============ Closing block — statement left, mail form right ============ */}
      <section
        id="contactme"
        aria-labelledby="contact-title"
        className="relative scroll-mt-24 border-t border-[#CBB59D]/10"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start gap-14 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:px-16">
          {/* ---------- LEFT — the statement ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-6 font-mono text-[12px] uppercase tracking-widest text-[#CBB59D]">
              06 / Contact
            </p>

            <h2
              id="contact-title"
              className="text-[clamp(2.9rem,7vw,5.75rem)] font-bold leading-[0.92] tracking-[-1.5px] text-[#F3EDE2]"
            >
              PULL ME INTO
              <br />
              YOUR TEAM<span className="text-[#D4AF37]">.</span>
            </h2>

            <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-[#CBB59D] md:text-[17px]">
              Good products are built by people who care about the last ten percent — the empty
              state, the slow query, the transition that makes a screen feel alive. That is the
              part I like.
            </p>

            {/* Availability */}
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#CBB59D]">
              <span className="inline-flex items-center gap-2 text-[#F3EDE2]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                </span>
                Open to work · 2026
              </span>
              <span aria-hidden className="h-3 w-px bg-[#CBB59D]/30" />
              <span>Chandigarh, India · Open to remote</span>
            </div>

            {/* Direct lines */}
            <dl className="mt-12 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#CBB59D]">
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="group inline-flex items-center gap-2 text-[15px] text-[#F3EDE2] transition-colors hover:text-[#D4AF37]"
                  >
                    {EMAIL}
                    <FiArrowUpRight
                      aria-hidden
                      className="shrink-0 text-[#D4AF37] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#CBB59D]">
                  Phone
                </dt>
                <dd className="mt-2">
                  <a
                    href="tel:+919664320613"
                    className="text-[15px] text-[#F3EDE2] transition-colors hover:text-[#D4AF37]"
                  >
                    {PHONE}
                  </a>
                </dd>
              </div>
            </dl>

            {/* Links */}
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="/resume.pdf"
                download="Bhavesh_Sabnani_Resume.pdf"
                className="inline-flex items-center gap-2.5 rounded-full border border-[#D4AF37]/70 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-colors duration-300 hover:bg-[#D4AF37] hover:text-black"
              >
                <FiDownload aria-hidden />
                Resume
              </a>

              <div className="flex items-center gap-3">
                {SOCIALS.map(({ Icon: SocialIcon, label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CBB59D]/30 text-[#D9C08F] transition-colors duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                  >
                    <SocialIcon aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ---------- RIGHT — the mail form ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:sticky lg:top-24"
          >
            <form
              id="comm-form"
              onSubmit={sendEmail}
              className="overflow-hidden rounded-2xl border border-[#CBB59D]/20 bg-white/[0.02]"
            >
              <div className="flex items-center justify-between border-b border-[#CBB59D]/15 px-6 py-4 sm:px-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#F3EDE2]">
                  Send a message
                </span>
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#CBB59D]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  Goes straight to my inbox
                </span>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="comm-name" className={LABEL_CLASS}>
                      Your name
                    </label>
                    <input
                      id="comm-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Bhavesh Sabnani"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="comm-email" className={LABEL_CLASS}>
                      Your email
                    </label>
                    <input
                      id="comm-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="comm-message" className={LABEL_CLASS}>
                    Message
                  </label>
                  <textarea
                    id="comm-message"
                    name="message"
                    placeholder="What are you building, and where do I fit in?"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${FIELD_CLASS} min-h-[150px] resize-none`}
                  />
                </div>

                <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={isSending}
                    className={`group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-4 focus-visible:ring-offset-black ${
                      isSending
                        ? 'cursor-wait bg-[#8C6D4F]'
                        : 'bg-[#D4AF37] hover:shadow-[0_0_34px_rgba(212,175,55,0.35)]'
                    }`}
                  >
                    {isSending ? 'Sending…' : 'Send message'}
                    <FiSend
                      aria-hidden
                      className={isSending ? 'animate-pulse' : 'transition-transform group-hover:translate-x-0.5'}
                    />
                  </button>

                  <a
                    href={`mailto:${EMAIL}`}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CBB59D] transition-colors hover:text-[#F3EDE2]"
                  >
                    Or email directly ↗
                  </a>
                </div>

                {/* Inline result — errors stay visible, unlike a toast */}
                <p
                  role="status"
                  aria-live="polite"
                  className={`min-h-[18px] text-[12px] leading-relaxed ${
                    status.type === 'error'
                      ? 'text-[#E3A08C]'
                      : status.type === 'success'
                        ? 'text-[#D4AF37]'
                        : 'text-transparent'
                  }`}
                >
                  {status.message || 'placeholder'}
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <ToastContainer
        position="bottom-right"
        toastClassName="bg-black border border-[#D4AF37]/30 text-[#E8DFD8] font-mono text-[10px] rounded-none backdrop-blur-xl"
        progressClassName="bg-[#D4AF37]"
      />
    </div>
  );
};

export default Contact;
