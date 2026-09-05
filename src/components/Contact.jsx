import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSend, FiShield, FiDownload } from 'react-icons/fi';
import { TextShimmer } from './ui/text-shimmer';
import LetsBuildRadialBloom from './LetsBuildRadialBloom';
import useIsMobile from '../utils/useIsMobile';

/**
 * COMM_LINK — secure contact bridge.
 *
 * A full-viewport split:
 *   LEFT  — the Let's-Build skill ecosystem, then a full-bleed live Spline 3D
 *           robot companion that follows the cursor (no card, no frame).
 *   RIGHT — the COMM_LINK glass form + gold HUD: a direct, working mail
 *           channel straight into the owner's inbox.
 *
 * NOTE on Spline's player UI (e.g. the "Built with Spline" pill): it is
 * rendered by Spline's own player inside the cross-origin iframe and shows
 * only on hover. The only proper way to remove it is in the Spline editor:
 * Play Settings → Logo (Hobby plan or above).
 */
// Comm_Link mail API (see server/index.js). In dev, Vite proxies /api to the
// backend (vite.config.js) so this relative path just works. For a
// production deployment where the frontend and backend live on different
// origins, set VITE_CONTACT_API_URL to the backend's full URL at build time.
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL || '/api/contact';

// Spline 3D robot — cursor-following companion for the landing page.
// The ?v= query is a cache-buster: Spline publishes scene updates at the SAME
// URL, and browsers cache the iframe document — without it you keep seeing the
// stale (pink) revision instead of the latest (yellow) one published in Spline.
const SPLINE_ROBOT_URL =
  'https://my.spline.design/robotfollowcursorforlandingpage-qw3YR8iZDtZ6IfsnPfSOhSqE/?v=4';

const FIELD_CLASS =
  'w-full rounded-md border border-[#8C6D4F]/70 bg-white/[0.04] px-4 py-3 text-sm text-[#F2EAE0] outline-none transition-all duration-300 placeholder:text-[#C9A879]/80 focus:border-[#F2D26B] focus:bg-[#D4AF37]/[0.05] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.12)]';

const LABEL_CLASS =
  'flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-[#EFE3CE]';

const Contact = () => {
  // Phones skip the Spline robot entirely (WebGL iframes are heavy on small
  // devices) — the form gets the full width. Desktop keeps the split.
  const isMobile = useIsMobile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message.');
      }
      toast.success('TRANSMISSION_COMPLETE 🚀');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      toast.error(err.message || 'CONNECTION_FAILURE ❌');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative bg-black text-[#E8DFD8] font-mono">
      {/* ============ LET'S-BUILD skill ecosystem — its own opaque section ============ */}
      <LetsBuildRadialBloom />

      {/* ============ COMM_LINK — full-bleed Spline robot (left) + secure form (right) ============ */}
      <div id="contactme" className="relative scroll-mt-24">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
          {/* LEFT — Spline 3D robot, edge-to-edge, no card, no zoom crop.
              The scene plays at native framing so no hard cut line ever runs
              across the model (zooming into the embed slices the floor glow
              and reads as a boundary). Desktop only — phones skip the
              WebGL iframe entirely and get the full-width form. */}
          {!isMobile && (
          <div className="relative h-[70vh] overflow-hidden lg:h-auto">
            <motion.iframe
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              key={SPLINE_ROBOT_URL}
              src={SPLINE_ROBOT_URL}
              frameBorder="0"
              title="3D robot companion — follows your cursor"
              width="100%"
              height="100%"
              loading="lazy"
              className="absolute inset-0 h-full w-full"
              style={{ transform: 'scale(1.15)' }}
            />

            {/* Edge melts — a gentle vignette + side fades dissolve the zoom
                crop into black, so the robot reads bigger with no hard
                boundary line across the model or its glow. */}
            <div
              className="pointer-events-none absolute inset-0 z-[6]"
              style={{
                background:
                  'radial-gradient(ellipse 85% 80% at 50% 46%, transparent 52%, rgba(0,0,0,0.5) 100%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-[6] w-[12%]"
              style={{ background: 'linear-gradient(to right, #000 0%, transparent 100%)' }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-[6] w-[12%]"
              style={{ background: 'linear-gradient(to left, #000 0%, transparent 100%)' }}
            />

            {/* Minimal caption overlay */}
            <span className="pointer-events-none absolute bottom-5 left-6 z-10 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em] text-[#D9C08F]">
              <span className="text-[#E5C158]">◈</span>
              Interactive_3D :: Spline
            </span>
          </div>
          )}

          {/* RIGHT — COMM_LINK glass form (gold theme) */}
          <div className="flex items-center justify-center px-6 py-20 sm:px-10 md:px-14 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xl text-left"
            >
              {/* Heading */}
              <div className="mb-10">
                <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-[#D4AF37]">
                  Protocol: Secure_Data
                </span>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter mt-3 leading-none">
                  <TextShimmer
                    className="[--base-gradient-color:#FFFFFF] drop-shadow-[0_0_18px_rgba(212,175,55,0.4)]"
                    baseGradient="linear-gradient(to right, #FFFFFF 0%, #FFFFFF 30%, #F7E9C4 42%, #F0CE72 72%, #DCAF46 100%)"
                  >
                    Comm_Link
                  </TextShimmer>
                </h2>
                <div className="mt-5 flex items-center gap-3 text-[9px] font-mono tracking-[0.4em] uppercase text-[#E5C158]">
                  <span className="h-px w-10 bg-[#D4AF37]/40" />
                  <span>Establish a secure line</span>
                </div>
              </div>

              {/* Glassmorphic panel */}
              <form
                onSubmit={sendEmail}
                className="relative overflow-hidden rounded-lg border border-[#D4AF37]/25 bg-black/50 backdrop-blur-xl shadow-[0_0_0_1px_rgba(212,175,55,0.06),0_20px_60px_rgba(0,0,0,0.8)]"
              >
                {/* Panel header — status dots + channel label */}
                <div className="flex items-center justify-between border-b border-[#D4AF37]/15 px-6 py-3.5 sm:px-8">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]/50" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]/25" />
                  </div>
                  <span className="text-[9px] tracking-[0.35em] uppercase text-[#E9DCC7]">
                    Secure_Channel :: v1.0
                  </span>
                </div>

                {/* Panel body */}
                <div className="space-y-6 p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label htmlFor="comm-name" className={LABEL_CLASS}>
                        <span className="text-[#D4AF37]">01</span>
                        Ident_Signature
                      </label>
                      <input
                        id="comm-name"
                        name="name"
                        type="text"
                        placeholder="ENTER_NAME"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label htmlFor="comm-email" className={LABEL_CLASS}>
                        <span className="text-[#D4AF37]">02</span>
                        Comm_Path_Addr
                      </label>
                      <input
                        id="comm-email"
                        name="email"
                        type="email"
                        placeholder="ENTER_EMAIL"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label htmlFor="comm-message" className={LABEL_CLASS}>
                      <span className="text-[#D4AF37]">03</span>
                      Data_Payload
                    </label>
                    <textarea
                      id="comm-message"
                      name="message"
                      placeholder="INPUT_TRANSMISSION..."
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${FIELD_CLASS} min-h-[120px] resize-none`}
                    />
                  </div>

                  {/* Footer row — live channel status + transmit */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2.5 text-[9px] tracking-[0.3em] uppercase text-[#E9DCC7]">
                      <FiShield className="text-[#D4AF37]/80" />
                      <span>Encrypted_Channel :: TLS</span>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                      </span>
                    </div>
                    <motion.button
                      whileHover={
                        isSending
                          ? undefined
                          : {
                              scale: 1.04,
                              boxShadow: '0 0 40px rgba(212, 175, 55, 0.45)',
                            }
                      }
                      whileTap={isSending ? undefined : { scale: 0.96 }}
                      type="submit"
                      disabled={isSending}
                      className={`group inline-flex items-center justify-center gap-3 text-black font-black text-xs uppercase tracking-[0.4em] px-12 py-4 rounded-md transition-all duration-300 ${
                        isSending
                          ? 'bg-[#8C6D4F] cursor-wait opacity-80'
                          : 'bg-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.45)]'
                      }`}
                    >
                      <span>{isSending ? 'Transmitting…' : 'Transmit'}</span>
                      <FiSend
                        className={`text-base transition-transform ${
                          isSending ? 'animate-pulse' : 'group-hover:translate-x-1'
                        }`}
                      />
                    </motion.button>
                  </div>
                </div>
              </form>

              {/* Alternate channels — real click-to-email / click-to-call */}
              <div className="mt-7 flex flex-wrap items-center justify-start gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              <a
                href="mailto:bhavesh.sabnani2005@gmail.com"
                className="text-[#E9DCC7] hover:text-[#F2D26B] transition-colors"
              >
                  bhavesh.sabnani2005@gmail.com
                </a>
                <span className="hidden sm:inline text-white/20">|</span>
              <a
                href="tel:+919664320613"
                className="text-[#E9DCC7] hover:text-[#F2D26B] transition-colors"
              >
                  +91 96643 20613
                </a>
              </div>

              {/* Resume download — gold-bordered CTA under the form */}
              <motion.a
                href="/resume.pdf"
                download="Bhavesh_Sabnani_Resume.pdf"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 inline-flex items-center gap-3 px-7 py-3.5 rounded-lg bg-transparent border-2 border-[#D4AF37]/80 text-[#D4AF37] font-mono text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_34px_rgba(212,175,55,0.4)]"
              >
                <FiDownload className="text-sm" />
                Download Resume
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        toastClassName="bg-black border border-[#D4AF37]/30 text-[#E8DFD8] font-mono text-[9px] rounded-none backdrop-blur-xl"
        progressClassName="bg-[#D4AF37]"
      />
    </div>
  );
};

export default Contact;