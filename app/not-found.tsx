import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-center px-6">
      <p className="text-[11px] font-semibold tracking-[0.3em] text-[#6B6B6B] uppercase mb-6">
        404 — Not Found
      </p>
      <h1
        className="text-display text-white mb-8"
        style={{ fontSize: "clamp(5rem, 20vw, 18rem)", lineHeight: 0.85 }}
      >
        404
      </h1>
      <p className="text-[#6B6B6B] text-sm max-w-md mb-12 font-light leading-relaxed">
        This page doesn&apos;t exist. Maybe it was cut in the edit — let&apos;s get you back to the reel.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 border border-[#333333] text-white text-[11px] tracking-[0.2em] font-semibold uppercase px-8 py-4 hover:border-white transition-colors"
      >
        BACK TO HOME
      </Link>
    </div>
  );
}