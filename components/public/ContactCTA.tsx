"use client";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";

interface Settings {
  contactHeadline?: string | null;
  contactCtaText?: string | null;
  email?: string | null;
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

export default function ContactCTA({ settings, socialLinks }: Props) {
  const headline = settings?.contactHeadline || "LET'S MAKE SOMETHING\nWORTH WATCHING.";
  const ctaText = settings?.contactCtaText || "START A PROJECT";

  const [form, setForm] = useState({ name: "", email: "", message: "", projectType: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Send failed");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const headlineLines = headline.split("\n");

  return (
    <section id="contact" className="py-section border-b border-[#E5E5E5] bg-[#111111]">
      <div className="container-editorial">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-white/30" />
          <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Contact</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* CTA Side */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-8">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>

            <a
              href="#contact"
              className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-widest uppercase text-[#111111] rounded-full transition-all hover:scale-105 hover:bg-white/90 active:scale-95 mb-10"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 4px 24px rgba(255,255,255,0.15), 0 1px 6px rgba(0,0,0,0.4)",
              }}
            >
              {ctaText}
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </a>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">
                  Social
                </p>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            {sent ? (
              <div className="h-full flex flex-col items-start justify-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 flex items-center justify-center">
                  <Check size={24} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase">Message Received!</h3>
                <p className="text-white/60">
                  I'll get back to you soon and respond within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", message: "", projectType: "" }); }}
                  className="text-xs text-white/40 hover:text-white/60 transition-colors underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-wide text-white/60 uppercase mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide text-white/60 uppercase mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide text-white/60 uppercase mb-1">
                    Project Type
                  </label>
                  <select
                    value={form.projectType}
                    onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-white/50 transition-colors"
                  >
                    <option value="" className="text-[#111111]">Select type</option>
                    {["YouTube Video Edit", "Short-Form / Reels", "Brand / Promo Video", "Wedding Film", "Music Video", "Documentary / Long-form", "Other"].map((t) => (
                      <option key={t} value={t} className="text-[#111111]">{t}</option>
                    ))}
                  </select>
                </div>


                <div>
                  <label className="block text-xs font-semibold tracking-wide text-white/60 uppercase mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 text-sm font-bold tracking-widest uppercase text-[#111111] bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 rounded-sm active:scale-[0.99]"
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : null}
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


