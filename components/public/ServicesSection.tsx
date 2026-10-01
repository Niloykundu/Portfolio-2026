import { 
  Clapperboard, 
  Smartphone, 
  MonitorPlay, 
  Megaphone, 
  Palette, 
  Music, 
  Sparkles, 
  BookOpen, 
  Film 
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

interface Props {
  services: Service[];
}

// Icon map for common service types using lucide-react
const SERVICE_ICONS: Record<string, React.ElementType> = {
  "video editing": Clapperboard,
  "short-form": Smartphone,
  "short form": Smartphone,
  reels: Smartphone,
  "reels & shorts": Smartphone,
  youtube: MonitorPlay,
  commercial: Megaphone,
  "colour correction": Palette,
  "color correction": Palette,
  "sound design": Music,
  "motion graphics": Sparkles,
  narrative: BookOpen,
  cinematic: Film,
  documentary: Film,
};

function getIconComponent(title: string): React.ElementType {
  const lower = title.toLowerCase();
  for (const [key, Icon] of Object.entries(SERVICE_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return Clapperboard;
}

export default function ServicesSection({ services }: Props) {
  if (!services.length) return null;

  return (
    <section
      id="services"
      className="py-section border-b border-[#E5E5E5]"
      style={{ background: "#0d0d0d" }}
    >
      <div className="container-editorial">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-8 h-px bg-white/30" />
          <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
            What I Do
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start mb-16">
          <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight">
            Capabilities &<br />
            <span style={{ color: "#FFFFFF" }}>Services</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed lg:pt-4 max-w-md self-end">
            Every project is treated as a story to tell. From quick social cuts to long-form cinematic pieces — precision and intention in every frame.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {services.map((service, i) => {
            const Icon = getIconComponent(service.title);
            return (
              <div
                key={service.id}
                className="group relative p-7 transition-all duration-300 cursor-default overflow-hidden"
                style={{ background: "#0d0d0d" }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)",
                  }}
                />

                {/* Number badge */}
                <div
                  className="absolute top-5 right-5 text-xs font-black opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ color: "#FFFFFF", fontSize: "2rem", lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  <Icon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3 group-hover:text-[#FFFFFF] transition-colors duration-300">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-xs text-white/40 leading-relaxed group-hover:text-white/55 transition-colors duration-300">
                    {service.description}
                  </p>
                )}

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: "linear-gradient(90deg, #FFFFFF, transparent)" }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


