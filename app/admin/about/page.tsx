"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, Upload } from "lucide-react";

interface About {
  title: string;
  description: string;
  profileImageUrl: string | null;
  yearsExperience: number;
  projectsCompleted: number;
  clientsCount: number;
  toolsCount: number;
}

export default function AdminAboutPage() {
  const [form, setForm] = useState<About>({
    title: "ABOUT THE EDITOR",
    description: "",
    profileImageUrl: null,
    yearsExperience: 2,
    projectsCompleted: 50,
    clientsCount: 10,
    toolsCount: 5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/about").then((r) => r.json()).then((d) => {
      if (d.about) setForm({ ...form, ...d.about });
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess("About section saved!");
    } else {
      const d = await res.json();
      setError(d.error || "Save failed");
    }
    setSaving(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "profile");
    const res = await fetch("/api/media/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setForm((f) => ({ ...f, profileImageUrl: data.media.secureUrl, profileImagePublicId: data.media.publicId }));
    }
    setUploading(false);
  };

  if (loading) return <div className="py-16 text-center text-sm text-[#9B9B9B]">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black tracking-tight text-[#111111]">About Section</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] disabled:opacity-50 transition-colors">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-sm text-green-600">{success}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5E5E5] p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Section Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Bio / Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={8} className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111] resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Years Experience", field: "yearsExperience" as const },
                { label: "Projects Completed", field: "projectsCompleted" as const },
                { label: "Clients Count", field: "clientsCount" as const },
                { label: "Tools Count", field: "toolsCount" as const },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">{label}</label>
                  <input type="number" value={form[field]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-5 h-fit">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">Profile Image</h2>
          {form.profileImageUrl ? (
            <div className="relative group mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.profileImageUrl} alt="Profile" className="w-full aspect-square object-cover" />
              <button onClick={() => setForm((f) => ({ ...f, profileImageUrl: null }))}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                Remove
              </button>
            </div>
          ) : (
            <div className="aspect-square bg-[#F5F5F3] flex items-center justify-center mb-3">
              <Upload size={24} className="text-[#D1D1D1]" />
            </div>
          )}
          <label className="flex items-center justify-center gap-2 border border-[#E5E5E5] py-2.5 cursor-pointer hover:border-[#D1D1D1] text-sm text-[#6B6B6B] transition-colors">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "Uploading..." : "Upload Photo"}
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }} />
          </label>
        </div>
      </div>
    </div>
  );
}
