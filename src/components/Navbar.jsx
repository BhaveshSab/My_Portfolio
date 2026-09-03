import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi';

const navLinks = [
  { name: 'ABOUT', href: '#about' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'CONTACT', href: '#contactme' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('ABOUT');

  useEffect(() => {
    // Page order of the sections the nav links to (id → link name)
    const spyOrder = [
      ['about', 'ABOUT'],
      ['skills', 'SKILLS'],
      ['projects', 'PROJECTS'],
      ['experience', 'EXPERIENCE'],
      ['contactme', 'CONTACT'],
    ];
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Scroll-spy: highlight whichever section currently occupies the upper
      // viewport, so the nav tracks the site's between-section transitions.
      const vh = window.innerHeight || 1;
      let current = null;
      for (const [id, name] of spyOrder) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.4) current = name;
      }
      // Above every section (the hero cinematic) fall back to the first link
      // so the nav never holds a stale highlight while no section is in view.
      setActiveLink(current || 'ABOUT');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Interval fallback: some environments (embedded webviews, throttled
    // tabs) deliver scroll events sparsely — the timer keeps the nav in sync.
    const spyTimer = setInterval(handleScroll, 800);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(spyTimer);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[200] transition-all duration-500 ease-in-out border-b ${
          isScrolled
            ? 'py-4 bg-black/80 backdrop-blur-lg border-[#8C6D4F]/15'
            : 'py-6 bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-12">
          {/* Brand */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => (window.location.href = '#')}
          >
            <span className="text-[#E8DFD8] text-xl font-bold tracking-[0.25em] uppercase leading-none">
              Bhavesh<span className="text-[#cbb59d]">.</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <ul className="flex space-x-12 items-center">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setActiveLink(link.name)}
                    className={`relative text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-300 pb-1 group ${
                      activeLink === link.name
                        ? 'text-[#E8DFD8]'
                        : 'text-[#B8976B] hover:text-[#E8DFD8]'
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute left-0 bottom-0 h-[1px] bg-[#cbb59d] transition-all duration-300 origin-left ${
                        activeLink === link.name
                          ? 'w-full scale-x-100 opacity-100'
                          : 'w-full scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>

            {/* LET'S TALK button — far right */}
            <a
              href="#contactme"
              className="ml-12 group inline-flex items-center gap-2.5 px-7 py-3 bg-[#cbb59d] text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#E8DFD8] transition-all duration-300 rounded-sm"
            >
              Let&rsquo;s Talk
              <FiArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#E8DFD8]/60 hover:text-[#E8DFD8] transition-colors z-[110]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black z-[90] flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-full'
        }`}
      >
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <ul className="relative z-10 flex flex-col space-y-8 text-center">
          {navLinks.map((link, index) => (
            <li
              key={link.name}
              className={`transition-all duration-500 ${
                isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <a
                href={link.href}
                onClick={() => {
                  setActiveLink(link.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-xl tracking-[0.3em] uppercase font-medium transition-all duration-300 ${
                  activeLink === link.name
                    ? 'text-[#E8DFD8]'
                    : 'text-[#B8976B] hover:text-[#E8DFD8]'
                }`}
              >
                {link.name}
              </a>
            </li>
          ))}
          <li
            className={`pt-6 transition-all duration-500 ${
              isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${navLinks.length * 90}ms` }}
          >
            <a
              href="#contactme"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center gap-2.5 px-12 py-4 bg-[#cbb59d] text-black text-sm font-semibold uppercase tracking-[0.3em] hover:bg-[#E8DFD8] transition-all rounded-sm"
            >
              Let&rsquo;s Talk <FiArrowUpRight size={18} />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
