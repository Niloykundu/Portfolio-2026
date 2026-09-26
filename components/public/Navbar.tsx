"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Settings {
  editorName?: string | null;
  availabilityStatus?: boolean;
  availabilityText?: string | null;
}

interface SocialLink {
  platform: string;
  label: string;
  url: string;
}

interface Props {
  settings: Settings | null;
  socialLinks: SocialLink[];
}

export default function Navbar({ settings, socialLinks }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#work", label: "Work" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm border-b border-[#E5E5E5]"
            : "bg-transparent"
        }`}
      >
        <div className="container-editorial flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-sm font-black tracking-tight text-[#111111] uppercase">
              {settings?.editorName || "PORTFOLIO"}
            </span>
            {settings?.availabilityStatus && (
              <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-green-600 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {settings.availabilityText || "AVAILABLE"}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-semibold tracking-widest text-[#6B6B6B] uppercase hover:text-[#111111] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-[#111111] transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#111111] transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#111111] transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16">
          <nav className="container-editorial pt-12 flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-3xl font-black tracking-tight text-[#111111] uppercase hover:text-[#6B6B6B] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-[#E5E5E5] pt-6 flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
