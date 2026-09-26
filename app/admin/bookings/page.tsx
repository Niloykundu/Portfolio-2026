"use client";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Calendar, Search, X, Clock, Mail, Globe, ExternalLink } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  eventTypeName: string | null;
  scheduledAt: string;
  timezone: string | null;
  status: "ACTIVE" | "CANCELLED" | "RESCHEDULED" | "COMPLETED";
  cancelUrl: string | null;
  rescheduleUrl: string | null;
  createdAt: string;
}

const statusColors: Record<Booking["status"], string> = {
  ACTIVE: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-500",
  RESCHEDULED: "bg-yellow-50 text-yellow-600",
  COMPLETED: "bg-[#F5F5F3] text-[#6B6B6B]",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [total, setTotal] = useState(0);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    const res = await fetch(`/api/bookings?${params}`);
    const data = await res.json();
    setBookings(data.bookings || []);
    setTotal(data.pagination?.total || 0);
    setLoading(false);
  }, [search, status]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const upcoming = bookings.filter(
    (b) => b.status === "ACTIVE" && new Date(b.scheduledAt) > new Date()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">Bookings</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            {total} total · {upcoming.length} upcoming
          </p>
        </div>
      </div>

      {/* Upcoming highlight */}
      {upcoming.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-green-600" />
            <span className="text-xs font-bold uppercase tracking-wide text-green-700">
              Upcoming ({upcoming.length})
            </span>
          </div>
          <div className="space-y-2">
            {upcoming.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-[#111111]">{b.name}</span>
                <span className="text-[#6B6B6B] text-xs">
                  {format(new Date(b.scheduledAt), "MMM d · h:mm a")} {b.timezone ? `(${b.timezone})` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E5E5] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2.5 border border-[#E5E5E5] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="RESCHEDULED">Rescheduled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-[#9B9B9B]">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#9B9B9B]">
            <Calendar size={32} className="mb-3 text-[#D1D1D1]" />
            <p className="text-sm">No bookings yet</p>
            <p className="text-xs mt-1">Bookings appear here when someone books via Calendly</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden md:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Date & Time</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden lg:table-cell">Event</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#F5F5F3] last:border-0 hover:bg-[#FAFAFA] cursor-pointer" onClick={() => setSelected(b)}>
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-[#111111]">{b.name}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="text-xs text-[#6B6B6B]">{b.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-[#111111] font-medium">
                        {format(new Date(b.scheduledAt), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-[#9B9B9B]">
                        {format(new Date(b.scheduledAt), "h:mm a")} {b.timezone && `(${b.timezone})`}
                      </p>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <p className="text-xs text-[#6B6B6B]">{b.eventTypeName || "—"}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 font-medium ${statusColors[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(b); }} className="text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#9B9B9B] hover:text-[#111111]">
              <X size={16} />
            </button>
            <h2 className="text-lg font-black tracking-tight text-[#111111] mb-4">Booking Detail</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold uppercase text-[#9B9B9B] w-20 flex-shrink-0 mt-0.5">Name</span>
                <span className="text-[#111111] font-medium">{selected.name}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold uppercase text-[#9B9B9B] w-20 flex-shrink-0 mt-0.5">Email</span>
                <a href={`mailto:${selected.email}`} className="text-[#111111] hover:underline flex items-center gap-1">
                  <Mail size={12} />
                  {selected.email}
                </a>
              </div>
              {selected.phone && (
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold uppercase text-[#9B9B9B] w-20 flex-shrink-0 mt-0.5">Phone</span>
                  <span className="text-[#111111]">{selected.phone}</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold uppercase text-[#9B9B9B] w-20 flex-shrink-0 mt-0.5">Date</span>
                <div>
                  <p className="text-[#111111] font-medium">
                    {format(new Date(selected.scheduledAt), "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-[#6B6B6B] text-xs">
                    {format(new Date(selected.scheduledAt), "h:mm a")}
                    {selected.timezone && ` · ${selected.timezone}`}
                  </p>
                </div>
              </div>
              {selected.eventTypeName && (
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold uppercase text-[#9B9B9B] w-20 flex-shrink-0 mt-0.5">Event</span>
                  <span className="text-[#111111]">{selected.eventTypeName}</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold uppercase text-[#9B9B9B] w-20 flex-shrink-0 mt-0.5">Status</span>
                <span className={`text-xs px-2 py-1 font-medium ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold uppercase text-[#9B9B9B] w-20 flex-shrink-0 mt-0.5">Booked</span>
                <span className="text-[#6B6B6B] text-xs">
                  {format(new Date(selected.createdAt), "MMM d, yyyy · h:mm a")}
                </span>
              </div>
              <div className="border-t border-[#E5E5E5] pt-3 flex gap-3 flex-wrap">
                {selected.cancelUrl && (
                  <a href={selected.cancelUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-red-500 hover:underline">
                    <ExternalLink size={10} />
                    Cancel booking
                  </a>
                )}
                {selected.rescheduleUrl && (
                  <a href={selected.rescheduleUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#6B6B6B] hover:underline">
                    <ExternalLink size={10} />
                    Reschedule
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
