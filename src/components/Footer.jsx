import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiCpu, FiShield, FiActivity, FiArrowUpRight } from 'react-icons/fi';

const Footer = () => {
  const [systemTime, setSystemTime] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for radial glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  const socialLinks = [
    { icon: <FiGithub />, label: 'GITHUB', url: 'https://github.com/BhaveshSab', color: 'hover:text-[#cbb59d]' },
    { icon: <FiLinkedin />, label: 'LINKEDIN', url: 'https://www.linkedin.com/in/bhavesh-sabnani-256946372/', color: 'hover:text-[#cbb59d]' },
    { icon: <FiInstagram />, label: 'INSTAGRAM', url: 'https://www.instagram.com/bhaveshsab184', color: 'hover:text-[#cbb59d]' },
  ];

  return (
    <footer className="relative w-full bg-black overflow-hidden pt-16 pb-8 font-sans selection:bg-[#cbb59d]/30">
      
      {/* --- BACKGROUND FX --- */}
      {/* Radial Glow following cursor — gold, matching the site theme */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-50 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at ${springX}px ${springY}px, rgba(212, 175, 55, 0.12) 0%, transparent 45%)`,
        }}
      />
      
      {/* Digital Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      {/* Pulsing Light Blobs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#cbb59d]/5 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#cbb59d]/5 blur-[120px] rounded-full animate-pulse delay-700 pointer-events-none" />

      {/* --- TOP DIVIDER (Animated Beam) --- */}
      <div className="relative w-full h-[1px] bg-[#cbb59d]/5 mb-20 overflow-hidden">
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[200px] h-full bg-gradient-to-r from-transparent via-[#cbb59d] to-transparent shadow-[0_0_15px_rgba(203,181,157,0.5)]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-12">
          
          {/* Section 1: Brand/Core */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-[#cbb59d]/10 border border-[#cbb59d]/20 rounded-lg flex items-center justify-center group-hover:bg-[#cbb59d] group-hover:border-[#cbb59d] transition-all duration-500">
                <FiCpu className="text-[#cbb59d] text-xl group-hover:text-[#E8DFD8] transition-colors" />
              </div>
              <h3 className="text-3xl font-black text-[#E8DFD8] tracking-tighter uppercase italic">
                BHAVESH<span className="text-[#D4AF37]">.</span>
              </h3>
            </div>
            <p className="text-[#cbb59d]/90 text-sm leading-relaxed uppercase tracking-[0.14em] font-medium">
              Designing the future of digital architecture with precision engineering and creative intelligence.
            </p>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full shadow-[0_0_8px_rgba(74,222,128,0.9)]"></span>
              <span className="text-xs text-[#D4AF37] font-mono tracking-widest uppercase">System Status: Online</span>
            </div>
          </motion.div>

          {/* Section 2: Navigation Hub */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h4 className="text-sm font-mono font-bold text-[#D4AF37] tracking-[0.35em] uppercase">Control_Center</h4>
            <ul className="space-y-4">
              {/* Explicit hrefs so every cross-section jump actually lands:
                  the sections are #about / #projects / #experience / #skills */}
              {[
                { label: 'About', href: '#about' },
                { label: 'Portfolio', href: '#projects' },
                { label: 'Experience', href: '#experience' },
                { label: 'Lab', href: '#skills' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="group flex items-center text-[15px] text-[#E8DFD8]/90 hover:text-[#D4AF37] transition-all tracking-[0.12em]">
                    <span className="w-0 group-hover:w-4 h-[1px] bg-[#cbb59d] mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    {item.label.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section 3: Tech Stack Info */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="text-sm font-mono font-bold text-[#D4AF37] tracking-[0.35em] uppercase">Neural_Network</h4>
            <div className="flex flex-wrap gap-2">
              {['Vite', 'React', 'GSAP', 'Framer', 'Three.js'].map((tech) => (
                <span key={tech} className="px-4 py-1.5 bg-[#cbb59d]/10 border border-[#cbb59d]/30 rounded-full text-xs text-[#E8DFD8] tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all cursor-default">
                  {tech.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="pt-4 space-y-3">
              <div className="flex items-center space-x-2.5 text-[11px] text-[#cbb59d] tracking-widest uppercase">
                <FiShield className="text-[#D4AF37] text-sm" />
                <span>Encrypted Transaction</span>
              </div>
              <div className="flex items-center space-x-2.5 text-[11px] text-[#cbb59d] tracking-widest uppercase">
                <FiActivity className="text-[#D4AF37] text-sm" />
                <span>Uptime: 99.98%</span>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Social Comms */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h4 className="text-sm font-mono font-bold text-[#D4AF37] tracking-[0.35em] uppercase">Broadcast_Link</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className={`relative w-12 h-12 flex items-center justify-center bg-[#cbb59d]/10 border border-[#cbb59d]/30 rounded-xl text-xl text-[#cbb59d] ${social.color} hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] transition-all duration-300 group`}
                >
                  <div className="absolute inset-0 bg-[#cbb59d]/0 group-hover:bg-[#cbb59d]/5 blur-xl transition-all" />
                  <div className="absolute inset-0 border border-[#cbb59d]/0 group-hover:border-[#cbb59d]/40 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-110 group-hover:scale-100" />
                  {social.icon}
                  
                  {/* Tooltip */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#cbb59d] text-[#E8DFD8] text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest font-bold">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </div>
            <motion.a
              href="#contactme"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full py-4 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-[0.35em] rounded-lg shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:shadow-[0_0_44px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center space-x-3 group overflow-hidden relative"
            >
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-[#cbb59d]/20 to-transparent group-hover:left-[100%] transition-all duration-1000" />
              <span>Initiate Transmission</span>
              <FiArrowUpRight className="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.a>
          </motion.div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 pt-6 border-t border-[#cbb59d]/10 flex flex-col items-center md:flex-row md:justify-between gap-5 md:gap-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <div className="text-xs text-[#cbb59d] tracking-[0.2em] font-mono flex items-center">
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2 shadow-[0_0_6px_rgba(212,175,55,0.8)]"></span>
              POWERED BY AI SYSTEMS v3.4.1
            </div>
            <span className="hidden sm:inline w-[3px] h-[3px] rounded-full bg-[#cbb59d]/40"></span>
            <div className="text-xs text-[#cbb59d] tracking-[0.2em] font-mono uppercase">
              Est. 2024 // Archive_001
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
             <div className="text-xs text-[#cbb59d] tracking-[0.25em] font-mono uppercase">
                Local_Time: {systemTime}
             </div>
             <span className="hidden sm:inline w-[3px] h-[3px] rounded-full bg-[#cbb59d]/40"></span>
             <p className="text-xs text-[#cbb59d]/85 tracking-[0.15em] font-mono uppercase">
                &copy; BHAVESH PORTFOLIO. ALL RIGHTS RESERVED.
             </p>
          </div>
        </motion.div>
      </div>

      {/* Futuristic Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}>
      </div>

    </footer>
  );
};

export default Footer;
