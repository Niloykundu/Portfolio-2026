"use client";

interface About {
  title?: string;
  description?: string;
  profileImageUrl?: string | null;
  yearsExperience?: number;
  projectsCompleted?: number;
  clientsCount?: number;
  toolsCount?: number;
}

interface Props {
  about: About | null;
}

export default function AboutSection({ about }: Props) {
  if (!about) return null;

  const stats = [
    { value: `${about.yearsExperience ?? 2}+`, label: "Years Editing", suffix: "" },
    { value: `${about.projectsCompleted ?? 100}+`, label: "Videos Edited", suffix: "" },
    { value: `${about.clientsCount ?? 3}`, label: "Clients & Channels", suffix: "" },
    { value: `${about.toolsCount ?? 3}`, label: "Tools Mastered", suffix: "" },
  ];

  const defaultDescription = `I'm a video editor who believes every frame tells a story. With 2+ years of experience in short-form content, brand storytelling and commercial editing, I've helped brands and creators cut through the noise.

I obsess over pacing, colour, and sound design — the invisible craft that makes people stop scrolling. Whether it's a 15-second reel or a 10-minute documentary, I bring the same precision and creative vision to every project.`;

  const initials = "NK";

  return (
    <section id="about" className="py-section border-b border-[#E5E5E5] bg-[#FAFAFA] overflow-hidden">
      <div className="container-editorial">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-8 h-px bg-[#111111]" />
          <span className="text-xs font-semibold tracking-widest text-[#6B6B6B] uppercase">
            About the Editor
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Profile Image / Avatar */}
          <div className="relative flex justify-center lg:justify-start">
            {about.profileImageUrl || "/assets/images/normal.png" ? (
              <div className="relative">
                {/* Glow ring */}
                <div
                  className="absolute -inset-3 rounded-2xl opacity-20 blur-2xl"
                  style={{ background: "radial-gradient(ellipse, #111111, transparent 70%)" }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={about.profileImageUrl || "/assets/images/normal.png"}
                  alt="Niloy Kundu — Video Editor"
                  className="relative w-full max-w-sm aspect-[4/5] object-cover rounded-2xl"
                  style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.15)" }}
                />
                {/* Floating availability badge */}
                <div
                  className="absolute -bottom-4 -right-4 flex items-center gap-2 px-4 py-2.5 rounded-full"
                  style={{
                    background: "#111111",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white tracking-wide">Available for projects</span>
                </div>
              </div>
            ) : (
              /* Avatar placeholder with initials */
              <div className="relative">
                {/* Glow ring */}
                <div
                  className="absolute -inset-4 rounded-full opacity-30 blur-3xl"
                  style={{ background: "radial-gradient(ellipse, #111111, transparent 70%)" }}
                />
                <div
                  className="relative w-56 h-56 lg:w-72 lg:h-72 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #111111 100%)",
                    border: "2px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 0 60px rgba(255,255,255,0.05), 0 25px 60px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Inner ring */}
                  <div
                    className="absolute inset-4 rounded-full"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                  <span
                    className="font-black tracking-tight select-none"
                    style={{
                      fontSize: "clamp(3rem, 8vw, 5rem)",
                      color: "#FFFFFF",
                      textShadow: "0 0 40px rgba(255,255,255,0.3)",
                    }}
                  >
                    {initials}
                  </span>
                </div>
                {/* Floating availability badge */}
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background: "#111111",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white tracking-wide">Available for projects</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-[#111111] uppercase mb-8 leading-tight">
              The Editor Behind<br />the Work
            </h2>

            <p className="text-[#555555] leading-relaxed text-base lg:text-lg mb-12 max-w-xl whitespace-pre-line">
              {about.description || defaultDescription}
            </p>

            {/* Stats — premium grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#E5E5E5]">
              {stats.map((stat, i) => (
                <div key={stat.label} className="group cursor-default">
                  <div
                    className="text-3xl lg:text-4xl font-black tracking-tight mb-1 transition-all group-hover:scale-105"
                    style={{ color: "#111111" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#9B9B9B] uppercase tracking-wide font-medium leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tools row */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["DaVinci Resolve", "Premiere Pro", "After Effects"].map((tool) => (
                <span
                  key={tool}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{
                    background: "rgba(17,17,17,0.06)",
                    border: "1px solid rgba(17,17,17,0.2)",
                    color: "#444444",
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


