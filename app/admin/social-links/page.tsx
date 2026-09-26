"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, X, ExternalLink } from "lucide-react";

interface SocialLink { id: string; platform: string; label: string; url: string; sortOrder: number }

const platforms = ["instagram", "youtube", "linkedin", "twitter", "tiktok", "behance", "vimeo", "facebook", "website", "email"];

export default function AdminSocialLinksPage() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ platform: "instagram", label: "", url: "", sortOrder: 0 });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/social-links");
    const data = await res.json();
    setItems(data.socialLinks || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const save = async () => {
    if (editing) {
      await fetch(`/api/social-links/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/social-links", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setEditing(null); setAdding(false);
    setForm({ platform: "instagram", label: "", url: "", sortOrder: 0 });
    fetch_();
  };

  const del = async (id: string) => {
    if (!confirm("Delete social link?")) return;
    await fetch(`/api/social-links/${id}`, { method: "DELETE" });
    fetch_();
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black tracking-tight text-[#111111]">Social Links</h1>
        <button onClick={() => { setAdding(true); setForm({ platform: "instagram", label: "", url: "", sortOrder: items.length }); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] transition-colors">
          <Plus size={14} /> Add Link
        </button>
      </div>

      {(adding || editing) && (
        <div className="mb-6 bg-white border border-[#E5E5E5] p-5">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Platform</label>
              <select value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value, label: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) }))}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm bg-white focus:outline-none focus:border-[#111111]">
                {platforms.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Label</label>
              <input type="text" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="Instagram" className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">URL</label>
              <input type="url" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://instagram.com/yourusername" className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} className="flex items-center gap-1 px-4 py-2 bg-[#111111] text-white text-sm hover:bg-[#333333]"><Check size={12} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="flex items-center gap-1 px-4 py-2 border border-[#E5E5E5] text-sm text-[#6B6B6B]"><X size={12} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#E5E5E5]">
        {loading ? <div className="py-12 text-center text-sm text-[#9B9B9B]">Loading...</div> :
          items.length === 0 ? <div className="py-12 text-center text-sm text-[#9B9B9B]">No social links yet</div> :
          <div className="divide-y divide-[#F5F5F3]">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-[#FAFAFA]">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#111111] capitalize">{item.platform}</p>
                    <span className="text-xs text-[#9B9B9B]">·</span>
                    <p className="text-xs text-[#6B6B6B]">{item.label}</p>
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#9B9B9B] hover:text-[#6B6B6B] flex items-center gap-1 mt-0.5">
                    <ExternalLink size={10} />
                    {item.url}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(item); setForm({ platform: item.platform, label: item.label, url: item.url, sortOrder: item.sortOrder }); }}
                    className="p-1.5 text-[#9B9B9B] hover:text-[#111111]"><Pencil size={13} /></button>
                  <button onClick={() => del(item.id)} className="p-1.5 text-[#9B9B9B] hover:text-red-500"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
