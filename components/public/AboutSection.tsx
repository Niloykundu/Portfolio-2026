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
    { value: `${about.yearsExperience ?? 2}+`, label: "Years Editing" },
    { value: `${about.projectsCompleted ?? 100}+`, label: "Videos Edited" },
    { value: `${about.clientsCount ?? 3}`, label: "Clients & Channels" },
    { value: `${about.toolsCount ?? 3}`, label: "Tools" },
  ];

  const defaultDescription = `I'm a video editor based in Assam, India, focused on crafting edits that keep viewers watching.

I work primarily in DaVinci Resolve, Premiere Pro, and After Effects — handling everything from colour grading and sound design to motion graphics and pacing.

My experience includes work at Unique Snapbox and RK ONP Multicare, and I'm currently editing for Kanikas Unboxing World on YouTube. I hold a BCA (2023–2026) and bring both technical precision and a genuine eye for story to every project.`;

  return (
    <section id="about" className="py-section border-b border-[#E5E5E5] bg-[#FAFAFA]">
      <div className="container-editorial">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-[#111111]" />
          <span className="text-xs font-semibold tracking-widest text-[#6B6B6B] uppercase">
            About the Editor
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Profile Image */}
          {about.profileImageUrl && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.profileImageUrl}
                alt="Niloy Kundu — Video Editor"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className={about.profileImageUrl ? "" : "lg:col-span-2"}>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-[#111111] uppercase mb-8">
              {about.title || "About the Editor"}
            </h2>

            <p className="text-[#6B6B6B] leading-relaxed text-lg mb-12 max-w-xl whitespace-pre-line">
              {about.description || defaultDescription}
            </p>

            {/* Stats — matched to hero */}
            <div className="grid grid-cols-4 gap-4 pt-8 border-t border-[#E5E5E5]">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black tracking-tight text-[#111111]">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#9B9B9B] uppercase tracking-wide mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
