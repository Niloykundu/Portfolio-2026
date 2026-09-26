interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

interface Props {
  services: Service[];
}

export default function ServicesSection({ services }: Props) {
  if (!services.length) return null;

  return (
    <section id="services" className="py-section border-b border-[#E5E5E5] bg-white">
      <div className="container-editorial">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-[#111111]" />
          <span className="text-xs font-semibold tracking-widest text-[#6B6B6B] uppercase">What I Do</span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-[#111111] uppercase mb-12">
          Capabilities &<br />Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E5]">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 hover:bg-[#FAFAFA] transition-colors group">
              <div className="mb-4">
                <div className="w-8 h-px bg-[#111111] group-hover:w-12 transition-all duration-300" />
              </div>
              <h3 className="text-sm font-bold text-[#111111] uppercase tracking-tight mb-3">
                {service.title}
              </h3>
              {service.description && (
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  {service.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
