"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface Category { id: string; name: string; slug: string; sortOrder: number; _count?: { projects: number } }

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", sortOrder: 0 });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setItems(data.categories || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const genSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const save = async () => {
    if (editing) {
      await fetch(`/api/categories/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setEditing(null);
    setAdding(false);
    setForm({ name: "", slug: "", sortOrder: 0 });
    fetch_();
  };

  const del = async (id: string) => {
    if (!confirm("Delete category? Projects in this category won't be deleted.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetch_();
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">Categories</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Manage project categories and filters</p>
        </div>
        <button onClick={() => { setAdding(true); setForm({ name: "", slug: "", sortOrder: items.length }); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] transition-colors">
          <Plus size={14} />
          Add Category
        </button>
      </div>

      {(adding || editing) && (
        <div className="mb-6 bg-white border border-[#E5E5E5] p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">
            {editing ? "Edit Category" : "New Category"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Name</label>
              <input type="text" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editing ? f.slug : genSlug(e.target.value) }))}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm font-mono focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} className="flex items-center gap-1 px-4 py-2 bg-[#111111] text-white text-sm hover:bg-[#333333] transition-colors">
              <Check size={12} /> Save
            </button>
            <button onClick={() => { setEditing(null); setAdding(false); }}
              className="flex items-center gap-1 px-4 py-2 border border-[#E5E5E5] text-sm text-[#6B6B6B] hover:border-[#D1D1D1] transition-colors">
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#E5E5E5]">
        {loading ? (
          <div className="py-12 text-center text-sm text-[#9B9B9B]">Loading...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#9B9B9B]">No categories yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Slug</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Projects</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Order</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#F5F5F3] last:border-0 hover:bg-[#FAFAFA]">
                  <td className="py-3 px-4 text-sm font-semibold text-[#111111]">{item.name}</td>
                  <td className="py-3 px-4 text-sm font-mono text-[#6B6B6B]">{item.slug}</td>
                  <td className="py-3 px-4 text-sm text-[#6B6B6B]">{item._count?.projects ?? "—"}</td>
                  <td className="py-3 px-4 text-sm text-[#9B9B9B]">{item.sortOrder}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditing(item); setForm({ name: item.name, slug: item.slug, sortOrder: item.sortOrder }); }}
                        className="p-1.5 text-[#9B9B9B] hover:text-[#111111] transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => del(item.id)} className="p-1.5 text-[#9B9B9B] hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
