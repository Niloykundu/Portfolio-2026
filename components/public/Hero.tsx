"use client";

interface Settings {
  headline?: string | null;
  subheadline?: string | null;
  ctaPrimaryText?: string | null;
  ctaSecondaryText?: string | null;
  heroImageUrl?: string | null;
}

interface Props {
  settings: Settings | null;
}

export default function Hero({ settings }: Props) {
  const name = "Niloy Kundu";
  const subheadline =
    settings?.subheadline ||
    "Crafting visual narratives that hold attention, build brands, and move people. 2+ years turning raw footage into stories worth watching.";
  const primaryText = settings?.ctaPrimaryText || "VIEW MY WORK";
  const secondaryText = settings?.ctaSecondaryText || "LET'S WORK TOGETHER";

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Subtle ambient lighting instead of harsh gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)",
        }}
      />
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── CENTERED CONTENT ── */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center">

        {/* Role badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
          }}
        >
          <span
            className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/80"
          >
            Video Editor &amp; Content Creator
          </span>
        </div>

        {/* Hi, I'm */}
        <p
          className="text-white/50 font-medium mb-2"
          style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)", letterSpacing: "0.05em" }}
        >
          Hi, I&apos;m
        </p>

        {/* Name */}
        <h1
          className="text-white font-black leading-none mb-6 tracking-tight"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9rem)",
          }}
        >
          {name}
        </h1>

        {/* Minimal divider */}
        <div
          className="w-12 h-px mb-8"
          style={{
            background: "rgba(255,255,255,0.2)",
          }}
        />

        {/* Tagline */}
        <p
          className="text-white/75 font-medium leading-relaxed mb-10 max-w-xl"
          style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
        >
          {subheadline}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-10 mb-12">
          {[
            { value: "2+", label: "Years Editing" },
            { value: "3", label: "Clients & Channels" },
            { value: "100+", label: "Videos Edited" },
          ].map(({ value, label }, i) => (
            <div key={label} className="text-center relative">
              {i > 0 && (
                <div
                  className="absolute -left-5 top-1/2 -translate-y-1/2 w-px h-8"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                />
              )}
              <div
                className="font-black leading-none"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#FFFFFF" }}
              >
                {value}
              </div>
              <div className="text-white/40 text-xs font-medium mt-1 tracking-wide uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-5 items-center justify-center mb-16">
          <a
            href="#work"
            className="group flex items-center gap-3 font-bold text-sm text-black rounded-full px-8 py-4 transition-all hover:scale-105 active:scale-95"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
              letterSpacing: "0.05em",
            }}
          >
            {primaryText}
            <svg className="transform group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#contact"
            className="group flex items-center gap-3 font-bold text-sm text-white rounded-full px-8 py-4 transition-all hover:bg-white/10 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
              letterSpacing: "0.05em",
              backdropFilter: "blur(10px)",
            }}
          >
            {secondaryText}
          </a>
        </div>

        {/* Showreel play button */}
        <div className="flex flex-col items-center gap-3">
          <a
            href="#work"
            className="group flex items-center gap-3 transition-all hover:gap-4"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 0 20px rgba(255,255,255,0.2)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-widest text-white/50 uppercase group-hover:text-white/70 transition-colors">
              Watch Showreel
            </span>
          </a>
        </div>
      </div>

      {/* ── TOOLS WIDGET — bottom right ── */}
      <div
        className="hidden lg:block absolute bottom-8 right-8 z-20"
        style={{ maxWidth: 240 }}
      >
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mb-2">
            Tools I Use
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["DaVinci Resolve", "Premiere Pro", "After Effects"].map((tool) => (
              <span
                key={tool}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}
              >
                {tool}
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
            >
              Based in Assam
            </span>
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(34,197,94,0.15)", color: "rgba(134,239,172,0.9)" }}
            >
              ● Open to Work
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div
          className="w-px h-12 origin-top"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}


