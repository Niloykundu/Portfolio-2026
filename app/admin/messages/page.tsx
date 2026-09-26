"use client";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { MessageSquare, Search, X, Mail, Trash2, Check } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  projectType: string | null;
  budget: string | null;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
}

const statusColors: Record<Inquiry["status"], string> = {
  UNREAD: "bg-red-50 text-red-500",
  READ: "bg-[#F5F5F3] text-[#6B6B6B]",
  REPLIED: "bg-green-50 text-green-600",
  ARCHIVED: "bg-[#F5F5F3] text-[#9B9B9B]",
};

export default function AdminMessagesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("UNREAD");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [total, setTotal] = useState(0);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/contact?${params}`);
    const data = await res.json();
    setInquiries(data.inquiries || []);
    setTotal(data.pagination?.total || 0);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const filtered = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.message.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetch_();
    if (selected?.id === id) setSelected((s) => s ? { ...s, status: status as Inquiry["status"] } : null);
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    fetch_();
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">Messages</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">{total} inquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E5E5] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>
        <div className="flex border border-[#E5E5E5] overflow-hidden">
          {["", "UNREAD", "READ", "REPLIED", "ARCHIVED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2.5 text-xs font-medium transition-colors ${statusFilter === s ? "bg-[#111111] text-white" : "bg-white text-[#6B6B6B] hover:bg-[#F5F5F3]"}`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5]">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-[#9B9B9B]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#9B9B9B]">
            <MessageSquare size={32} className="mb-3 text-[#D1D1D1]" />
            <p className="text-sm">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F5F5F3]">
            {filtered.map((inq) => (
              <div
                key={inq.id}
                onClick={() => {
                  setSelected(inq);
                  if (inq.status === "UNREAD") updateStatus(inq.id, "READ");
                }}
                className="flex items-start gap-4 p-4 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="w-8 h-8 bg-[#F5F5F3] flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={12} className="text-[#9B9B9B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#111111]">{inq.name}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 font-medium ${statusColors[inq.status]}`}>
                        {inq.status}
                      </span>
                      <span className="text-xs text-[#9B9B9B]">
                        {format(new Date(inq.createdAt), "MMM d")}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#6B6B6B]">{inq.email}</p>
                  <p className="text-sm text-[#6B6B6B] line-clamp-1 mt-1">{inq.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#9B9B9B] hover:text-[#111111]">
              <X size={16} />
            </button>
            <h2 className="text-lg font-black tracking-tight text-[#111111] mb-1">{selected.name}</h2>
            <a href={`mailto:${selected.email}`} className="text-sm text-[#6B6B6B] hover:underline flex items-center gap-1 mb-4">
              <Mail size={12} />
              {selected.email}
            </a>

            {(selected.projectType || selected.budget) && (
              <div className="flex gap-3 mb-4 flex-wrap">
                {selected.projectType && (
                  <span className="text-xs px-2 py-1 bg-[#F5F5F3] text-[#6B6B6B]">
                    Project: {selected.projectType}
                  </span>
                )}
                {selected.budget && (
                  <span className="text-xs px-2 py-1 bg-[#F5F5F3] text-[#6B6B6B]">
                    Budget: {selected.budget}
                  </span>
                )}
              </div>
            )}

            <div className="bg-[#FAFAFA] px-4 py-4 mb-4 text-sm text-[#111111] leading-relaxed whitespace-pre-wrap">
              {selected.message}
            </div>

            <div className="text-xs text-[#9B9B9B] mb-4">
              Received {format(new Date(selected.createdAt), "EEEE, MMMM d, yyyy · h:mm a")}
            </div>

            <div className="flex flex-wrap gap-2">
              {["READ", "REPLIED", "ARCHIVED"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium border transition-colors ${selected.status === s ? "bg-[#111111] text-white border-[#111111]" : "border-[#E5E5E5] text-[#6B6B6B] hover:border-[#111111] hover:text-[#111111]"}`}
                >
                  <Check size={10} />
                  {s}
                </button>
              ))}
              <button
                onClick={() => deleteInquiry(selected.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors ml-auto"
              >
                <Trash2 size={10} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
