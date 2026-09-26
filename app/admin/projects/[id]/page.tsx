"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Film, Save, ArrowLeft, Loader2 } from "lucide-react";

interface Category { id: string; name: string }

interface ProjectMedia {
  id: string;
  type: string;
  url: string;
  thumbnailUrl: string | null;
  altText: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string | null;
  client: string | null;
  year: number | null;
  duration: string | null;
  role: string | null;
  editingApproach: string | null;
  caseStudy: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  thumbnailUrl: string | null;
  thumbnailPublicId: string | null;
  media: ProjectMedia[];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminProjectEditor({ params }: Props) {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string>("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [media, setMedia] = useState<ProjectMedia[]>([]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    client: "",
    year: new Date().getFullYear(),
    duration: "",
    role: "",
    editingApproach: "",
    caseStudy: "",
    featured: false,
    published: false,
    sortOrder: 0,
    thumbnailUrl: "",
    thumbnailPublicId: "",
  });

  useEffect(() => {
    params.then(({ id }) => {
      setProjectId(id);
      setIsNew(id === "new");
    });
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes] = await Promise.all([fetch("/api/categories")]);
      const catData = await catRes.json();
      setCategories(catData.categories || []);

      if (!isNew && projectId && projectId !== "new") {
        const projRes = await fetch(`/api/projects/${projectId}`);
        if (projRes.ok) {
          const data: { project: Project } = await projRes.json();
          const p = data.project;
          setForm({
            title: p.title,
            slug: p.slug,
            description: p.description,
            categoryId: p.categoryId || "",
            client: p.client || "",
            year: p.year || new Date().getFullYear(),
            duration: p.duration || "",
            role: p.role || "",
            editingApproach: p.editingApproach || "",
            caseStudy: p.caseStudy || "",
            featured: p.featured,
            published: p.published,
            sortOrder: p.sortOrder,
            thumbnailUrl: p.thumbnailUrl || "",
            thumbnailPublicId: p.thumbnailPublicId || "",
          });
          setMedia(p.media || []);
        }
      }
      setLoading(false);
    };

    if (projectId) fetchData();
  }, [projectId, isNew]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: isNew ? generateSlug(title) : f.slug,
    }));
  };

  const handleThumbnailUpload = async (file: File) => {
    setUploadingThumb(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "thumbnails");
    const res = await fetch("/api/media/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setForm((f) => ({
        ...f,
        thumbnailUrl: data.media.secureUrl,
        thumbnailPublicId: data.media.publicId,
      }));
    }
    setUploadingThumb(false);
  };

  const handleMediaUpload = async (file: File) => {
    if (!projectId || projectId === "new") {
      setError("Save the project first before uploading media.");
      return;
    }
    setUploadingMedia(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/projects/${projectId}/media`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (res.ok) {
      setMedia((m) => [...m, data.media]);
    }
    setUploadingMedia(false);
  };

  const removeMedia = async (mediaId: string) => {
    await fetch(`/api/projects/${projectId}/media`, {
      method: "DELETE",
    });
    setMedia((m) => m.filter((item) => item.id !== mediaId));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || null,
        year: form.year || null,
        thumbnailUrl: form.thumbnailUrl || null,
        thumbnailPublicId: form.thumbnailPublicId || null,
      };

      const url = isNew ? "/api/projects" : `/api/projects/${projectId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }

      setSuccess("Project saved successfully!");
      if (isNew) {
        router.push(`/admin/projects/${data.project.id}`);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !isNew) {
    return (
      <div className="flex items-center justify-center min-h-64 text-[#9B9B9B] text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin/projects")} className="text-[#9B9B9B] hover:text-[#111111] transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#111111]">
              {isNew ? "New Project" : "Edit Project"}
            </h1>
            {!isNew && (
              <p className="text-sm text-[#9B9B9B] mt-0.5 font-mono">/work/{form.slug}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase">Published</span>
            <div
              onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
              className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${form.published ? "bg-green-500" : "bg-[#D1D1D1]"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform shadow-sm ${form.published ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-sm text-green-600">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-[#E5E5E5] p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">
              Project Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                  placeholder="Midnight Motion"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm font-mono text-[#6B6B6B] focus:outline-none focus:border-[#111111] transition-colors"
                  placeholder="midnight-motion"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
                  placeholder="Describe the project..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">
                  Editing Approach
                </label>
                <textarea
                  value={form.editingApproach}
                  onChange={(e) => setForm((f) => ({ ...f, editingApproach: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
                  placeholder="Describe your creative approach..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">
                  Case Study / Notes
                </label>
                <textarea
                  value={form.caseStudy}
                  onChange={(e) => setForm((f) => ({ ...f, caseStudy: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
                  placeholder="Extended case study content..."
                />
              </div>
            </div>
          </div>

          {/* Project Media */}
          <div className="bg-white border border-[#E5E5E5] p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">
              Project Media
            </h2>
            {isNew && (
              <p className="text-xs text-[#9B9B9B] mb-4 bg-[#F5F5F3] px-3 py-2">
                Save the project first, then upload media files.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {media.map((m) => (
                <div key={m.id} className="relative group aspect-video-thumb bg-[#F5F5F3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.thumbnailUrl || m.url}
                    alt={m.altText || ""}
                    className="w-full h-full object-cover"
                  />
                  {m.type === "VIDEO" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Film size={20} className="text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => removeMedia(m.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
            {!isNew && (
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#E5E5E5] p-6 cursor-pointer hover:border-[#D1D1D1] transition-colors">
                {uploadingMedia ? (
                  <Loader2 size={16} className="animate-spin text-[#9B9B9B]" />
                ) : (
                  <Upload size={16} className="text-[#9B9B9B]" />
                )}
                <span className="text-sm text-[#6B6B6B]">
                  {uploadingMedia ? "Uploading..." : "Upload image or video"}
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMediaUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Thumbnail */}
          <div className="bg-white border border-[#E5E5E5] p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">
              Thumbnail
            </h2>
            {form.thumbnailUrl ? (
              <div className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full aspect-video-thumb object-cover"
                />
                <button
                  onClick={() => setForm((f) => ({ ...f, thumbnailUrl: "", thumbnailPublicId: "" }))}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E5E5E5] p-6 cursor-pointer hover:border-[#D1D1D1] transition-colors aspect-video-thumb">
                {uploadingThumb ? (
                  <Loader2 size={20} className="animate-spin text-[#9B9B9B]" />
                ) : (
                  <Upload size={20} className="text-[#D1D1D1]" />
                )}
                <span className="text-xs text-[#9B9B9B]">
                  {uploadingThumb ? "Uploading..." : "Upload thumbnail"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleThumbnailUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>

          {/* Details */}
          <div className="bg-white border border-[#E5E5E5] p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">
              Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] bg-white"
                >
                  <option value="">— No category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">Client</label>
                <input
                  type="text"
                  value={form.client}
                  onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="e.g. 2:30"
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="e.g. Lead Editor"
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white border border-[#E5E5E5] p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">
              Options
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-[#111111]">Featured Project</span>
                <div
                  onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${form.featured ? "bg-yellow-400" : "bg-[#D1D1D1]"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform shadow-sm ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-[#111111]">Published</span>
                <div
                  onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${form.published ? "bg-green-500" : "bg-[#D1D1D1]"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform shadow-sm ${form.published ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
