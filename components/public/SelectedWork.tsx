"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Play } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MediaItem {
  url: string;
  thumbnailUrl: string | null;
  type: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  category: { name: string; slug: string } | null;
  client: string | null;
  year: number | null;
  duration: string | null;
  media: MediaItem[];
}

interface Props {
  categories: Category[];
}

/* ─────────────────────────────────────────────────────────────
   VideoCardThumb
   • Captures a still frame at ~1 s as the card thumbnail
   • Detects portrait vs landscape and calls onOrientation()
   • Plays live video on hover
   ───────────────────────────────────────────────────────────── */
function VideoCardThumb({
  videoUrl,
  title,
  isHovered,
  onOrientation,
}: {
  videoUrl: string;
  title: string;
  isHovered: boolean;
  onOrientation: (isVertical: boolean) => void;
}) {
  const [thumbDataUrl, setThumbDataUrl] = useState("");
  const [ready, setReady] = useState(false);
  const liveRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = document.createElement("video");
    vid.crossOrigin = "anonymous";
    vid.muted = true;
    vid.preload = "metadata";
    vid.src = videoUrl;

    vid.addEventListener("loadedmetadata", () => {
      onOrientation(vid.videoHeight > vid.videoWidth);
      vid.currentTime = Math.min(1, vid.duration * 0.1);
    });

    vid.addEventListener("seeked", () => {
      try {
        const c = document.createElement("canvas");
        c.width = vid.videoWidth || 640;
        c.height = vid.videoHeight || 360;
        c.getContext("2d")!.drawImage(vid, 0, 0, c.width, c.height);
        setThumbDataUrl(c.toDataURL("image/jpeg", 0.85));
      } catch {
        /* codec / CORS fallback */
      }
      setReady(true);
      vid.src = "";
    });

    vid.addEventListener("error", () => setReady(true));
    vid.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  useEffect(() => {
    const v = liveRef.current;
    if (!v) return;
    if (isHovered) { v.currentTime = 0; v.play().catch(() => {}); }
    else { v.pause(); }
  }, [isHovered]);

  return (
    <>
      {/* Still-frame thumbnail */}
      {thumbDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbDataUrl}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />
      ) : !ready ? (
        <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
          <Play size={28} className="text-white/20" />
        </div>
      )}

      {/* Live hover preview */}
      <video
        ref={liveRef}
        src={videoUrl}
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   ProjectCard — adapts aspect ratio to video orientation
   ───────────────────────────────────────────────────────────── */
function ProjectCard({
  project,
  videoUrl,
  thumbUrl,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  project: Project;
  videoUrl: string | null;
  thumbUrl: string | null;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const [isVertical, setIsVertical] = useState(false);

  // aspect-ratio: vertical = 9/16, horizontal = 16/9
  const aspectStyle = isVertical
    ? { aspectRatio: "9/16" }
    : { aspectRatio: "16/9" };

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative bg-[#FAFAFA] overflow-hidden block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Media container — correct aspect ratio */}
      <div className="relative overflow-hidden bg-[#111]" style={aspectStyle}>
        {videoUrl ? (
          <VideoCardThumb
            videoUrl={videoUrl}
            title={project.title}
            isHovered={isHovered}
            onOrientation={setIsVertical}
          />
        ) : thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[#F5F5F3] flex flex-col items-center justify-center gap-2">
            <Play size={24} className="text-[#D1D1D1]" />
            <span className="text-[10px] text-[#C1C1C1] font-medium tracking-wide uppercase">No Preview Yet</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="text-white text-xs font-bold tracking-widest uppercase border border-white/60 px-4 py-2">
            VIEW PROJECT
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-white border-t border-[#E5E5E5]">
        <h3 className="text-xs font-bold text-[#111111] uppercase tracking-tight leading-tight">
          {project.title}
        </h3>
        <p className="text-[11px] text-[#9B9B9B] mt-0.5">
          {project.category?.name || "Video"}{project.year && ` · ${project.year}`}
        </p>
        {project.description && (
          <p className="text-[11px] text-[#6B6B6B] mt-1.5 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   SelectedWork — main section
   ───────────────────────────────────────────────────────────── */
export default function SelectedWork({ categories }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    const res = await fetch(`/api/projects?${params}`);
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }, [activeCategory]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const allCategories = [{ id: "all", name: "ALL", slug: "all" }, ...categories];

  return (
    <section id="work" className="py-section border-b border-[#E5E5E5]">
      <div className="container-editorial">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#111111]" />
              <span className="text-xs font-semibold tracking-widest text-[#6B6B6B] uppercase">Portfolio</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-[#111111] uppercase">
              Selected Work
            </h2>
          </div>

          {/* Category Filters */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`flex-shrink-0 px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all ${
                  activeCategory === cat.slug
                    ? "bg-[#111111] text-white"
                    : "border border-[#E5E5E5] text-[#6B6B6B] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid — mixed aspect ratios, masonry-style columns */}
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-px space-y-px">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#F5F5F3] aspect-video animate-pulse break-inside-avoid" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-[#9B9B9B]">
            <p className="text-sm">No projects in this category yet</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-px">
            {projects.map((project) => {
              const firstMedia = project.media?.[0];
              const isVideo = firstMedia?.type === "VIDEO";
              const videoUrl = isVideo ? firstMedia.url : null;
              const thumbUrl = project.thumbnailUrl || (!isVideo ? firstMedia?.url : null);

              return (
                <div key={project.id} className="break-inside-avoid mb-px">
                  <ProjectCard
                    project={project}
                    videoUrl={videoUrl ?? null}
                    thumbUrl={thumbUrl ?? null}
                    isHovered={hoveredId === project.id}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
