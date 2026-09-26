"use client";
import { useState, useEffect, useCallback } from "react";
import { Upload, Search, Trash2, Copy, Image as ImageIcon, Film, Loader2, Check } from "lucide-react";

interface Media {
  id: string;
  url: string;
  secureUrl: string;
  resourceType: string;
  format: string | null;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  altText: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "48" });
    if (search) params.set("search", search);
    if (typeFilter) params.set("type", typeFilter);
    const res = await fetch(`/api/media?${params}`);
    const data = await res.json();
    setMedia(data.media || []);
    setTotal(data.pagination?.total || 0);
    setLoading(false);
  }, [search, typeFilter]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("altText", file.name);
      await fetch("/api/media/upload", { method: "POST", body: fd });
    }
    await fetchMedia();
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this media? It cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    setMedia((m) => m.filter((item) => item.id !== id));
    setDeleting(null);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">Media Library</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">{total} files</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] transition-colors cursor-pointer">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading..." : "Upload Files"}
          <input type="file" accept="image/*,video/*" multiple className="hidden"
            onChange={(e) => { if (e.target.files) handleUpload(e.target.files); e.target.value = ""; }} />
        </label>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E5E5] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>
        <div className="flex border border-[#E5E5E5] overflow-hidden">
          {[{ label: "All", value: "" }, { label: "Images", value: "image" }, { label: "Videos", value: "video" }].map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`px-4 py-2.5 text-xs font-medium transition-colors ${typeFilter === f.value ? "bg-[#111111] text-white" : "bg-white text-[#6B6B6B] hover:bg-[#F5F5F3]"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#E5E5E5] p-6 mb-6 cursor-pointer hover:border-[#D1D1D1] transition-colors">
        <Upload size={16} className="text-[#D1D1D1]" />
        <span className="text-sm text-[#9B9B9B]">Drop files here or click to upload (images & videos, max 100MB)</span>
        <input type="file" accept="image/*,video/*" multiple className="hidden"
          onChange={(e) => { if (e.target.files) handleUpload(e.target.files); e.target.value = ""; }} />
      </label>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-[#9B9B9B]">Loading...</div>
      ) : media.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#9B9B9B]">
          <ImageIcon size={32} className="mb-3 text-[#D1D1D1]" />
          <p className="text-sm">No media files yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {media.map((item) => (
            <div key={item.id} className="group relative bg-[#F5F5F3] aspect-square overflow-hidden">
              {/* Preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumbnailUrl || item.secureUrl}
                alt={item.altText || ""}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {item.resourceType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Film size={20} className="text-white" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="p-1 bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    {deleting === item.id ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                  </button>
                </div>
                <div>
                  <p className="text-white text-xs truncate mb-1">{item.altText || "—"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">{formatBytes(item.bytes)}</span>
                    <button
                      onClick={() => copyUrl(item.secureUrl, item.id)}
                      className="p-1 bg-white/20 text-white hover:bg-white/30 transition-colors"
                      title="Copy URL"
                    >
                      {copied === item.id ? <Check size={10} /> : <Copy size={10} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
