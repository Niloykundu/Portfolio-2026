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
    "Turning raw footage into videos that hold attention — for brands, YouTube channels, and everything in between.";
  const primaryText = settings?.ctaPrimaryText || "Start a Project";
  const secondaryText = settings?.ctaSecondaryText || "View My Work";

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Top-center orange glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(200,80,0,0.6) 0%, rgba(140,40,0,0.2) 50%, transparent 75%)",
        }}
      />
      {/* Bottom subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 110%, rgba(180,60,0,0.25) 0%, transparent 70%)",
        }}
      />
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
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
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
          style={{
            background: "rgba(249,115,22,0.12)",
            border: "1px solid rgba(249,115,22,0.3)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#f97316" }}
          />
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#f97316" }}
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
          className="text-white font-black leading-none mb-6"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 10rem)",
            letterSpacing: "-0.04em",
            textShadow: "0 0 80px rgba(249,115,22,0.15)",
          }}
        >
          {name}
        </h1>

        {/* Orange divider */}
        <div
          className="w-16 h-0.5 rounded-full mb-8"
          style={{
            background: "linear-gradient(90deg, transparent, #f97316, transparent)",
          }}
        />

        {/* Tagline */}
        <p
          className="text-white/75 font-medium leading-relaxed mb-10 max-w-xl"
          style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
        >
          {subheadline}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-8 mb-10">
          {[
            { value: "2+", label: "Years Editing" },
            { value: "3", label: "Clients & Channels" },
            { value: "100+", label: "Videos Edited" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="font-black leading-none"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#f97316" }}
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
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <a
            href="#contact"
            className="flex items-center gap-2 font-semibold text-sm text-white rounded-full px-7 py-3.5 transition-all hover:brightness-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "0 0 30px rgba(249,115,22,0.35)",
            }}
          >
            {primaryText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#work"
            className="flex items-center gap-2 font-semibold text-sm rounded-full px-7 py-3.5 transition-all hover:bg-white/10 active:scale-95"
            style={{
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {secondaryText}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

        </div>
      </div>

      {/* ── RECENT WORK WIDGET — bottom right, large screens only ── */}
      <div
        className="hidden lg:block absolute bottom-8 right-12 z-20"
        style={{ maxWidth: 260 }}
      >
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Tools */}
          <p className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mb-2">
            Tools I Use
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["DaVinci Resolve", "Premiere Pro", "After Effects"].map((tool) => (
              <span
                key={tool}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Tags */}
          <div className="flex gap-2">
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
            >
              Based in Assam
            </span>
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
            >
              Open to Work
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
