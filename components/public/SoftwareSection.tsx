interface Software {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
}

interface Props {
  software: Software[];
}

export default function SoftwareSection({ software }: Props) {
  if (!software.length) return null;

  return (
    <section className="py-section border-b border-[#E5E5E5] bg-[#FAFAFA]">
      <div className="container-editorial">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-[#111111]" />
          <span className="text-xs font-semibold tracking-widest text-[#6B6B6B] uppercase">Tools of the Trade</span>
        </div>

        <div className="flex flex-wrap gap-0 border border-[#E5E5E5] bg-white">
          {software.map((sw, i) => (
            <div
              key={sw.id}
              className={`flex items-center gap-3 px-6 py-5 hover:bg-[#F5F5F3] transition-colors border-r border-b border-[#E5E5E5] ${
                i % 3 === 2 ? "border-r-0" : ""
              }`}
              style={{ flexBasis: "calc(33.333% - 1px)", minWidth: "180px" }}
            >
              {sw.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sw.logoUrl} alt={sw.name} className="w-6 h-6 object-contain" />
              )}
              <div>
                <p className="text-sm font-bold text-[#111111]">{sw.name}</p>
                {sw.description && (
                  <p className="text-xs text-[#9B9B9B]">{sw.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
