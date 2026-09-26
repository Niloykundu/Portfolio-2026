"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface SW { id: string; name: string; description: string | null; sortOrder: number }

export default function AdminSoftwarePage() {
  const [items, setItems] = useState<SW[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SW | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", sortOrder: 0 });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/software");
    const data = await res.json();
    setItems(data.software || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const save = async () => {
    const payload = { ...form, description: form.description || null };
    if (editing) {
      await fetch(`/api/software/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch("/api/software", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    setEditing(null); setAdding(false);
    setForm({ name: "", description: "", sortOrder: 0 });
    fetch_();
  };

  const del = async (id: string) => {
    if (!confirm("Delete software?")) return;
    await fetch(`/api/software/${id}`, { method: "DELETE" });
    fetch_();
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black tracking-tight text-[#111111]">Software & Tools</h1>
        <button onClick={() => { setAdding(true); setForm({ name: "", description: "", sortOrder: items.length }); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] transition-colors">
          <Plus size={14} /> Add Tool
        </button>
      </div>

      {(adding || editing) && (
        <div className="mb-6 bg-white border border-[#E5E5E5] p-5">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-[#111111] mb-1">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} className="flex items-center gap-1 px-4 py-2 bg-[#111111] text-white text-sm hover:bg-[#333333]"><Check size={12} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="flex items-center gap-1 px-4 py-2 border border-[#E5E5E5] text-sm text-[#6B6B6B] hover:border-[#D1D1D1]"><X size={12} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#E5E5E5]">
        {loading ? <div className="py-12 text-center text-sm text-[#9B9B9B]">Loading...</div> :
          items.length === 0 ? <div className="py-12 text-center text-sm text-[#9B9B9B]">No software added yet</div> :
          <div className="divide-y divide-[#F5F5F3]">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-[#FAFAFA]">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#111111]">{item.name}</p>
                  {item.description && <p className="text-xs text-[#6B6B6B]">{item.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(item); setForm({ name: item.name, description: item.description || "", sortOrder: item.sortOrder }); }}
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
