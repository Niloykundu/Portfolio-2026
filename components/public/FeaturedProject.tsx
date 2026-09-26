import Link from "next/link";
import { Play } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  client: string | null;
  year: number | null;
  duration: string | null;
  role: string | null;
  thumbnailUrl: string | null;
  category: { name: string } | null;
  media: { url: string; thumbnailUrl: string | null; type: string }[];
}

interface Settings {
  ctaSecondaryText?: string | null;
}

interface Props {
  project: Project;
  settings: Settings | null;
}

export default function FeaturedProject({ project, settings }: Props) {
  const thumb = project.thumbnailUrl || project.media?.[0]?.thumbnailUrl || project.media?.[0]?.url;

  return (
    <section className="py-section border-b border-[#E5E5E5] bg-white">
      <div className="container-editorial">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-[#111111]" />
          <span className="text-xs font-semibold tracking-widest text-[#6B6B6B] uppercase">Featured Work</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Media */}
          <div className="relative group">
            <Link href={`/work/${project.slug}`}>
              <div className="relative aspect-video bg-[#F5F5F3] overflow-hidden">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play size={40} className="text-[#D1D1D1]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-white flex items-center justify-center">
                    <Play size={20} className="text-[#111111] ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-4 text-xs text-[#9B9B9B] uppercase tracking-widest mb-6 font-semibold">
              {project.category && <span>{project.category.name}</span>}
              {project.year && <span>· {project.year}</span>}
              {project.duration && <span>· {project.duration}</span>}
            </div>

            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-[#111111] uppercase mb-6">
              {project.title}
            </h2>

            {project.client && (
              <p className="text-xs font-semibold tracking-widest text-[#9B9B9B] uppercase mb-4">
                Client: {project.client}
              </p>
            )}

            <p className="text-[#6B6B6B] leading-relaxed mb-8 max-w-md">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/work/${project.slug}`}
                className="px-6 py-3 bg-[#111111] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#333333] transition-colors"
              >
                VIEW PROJECT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
