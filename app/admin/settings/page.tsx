"use client";
import { useState, useEffect } from "react";
import { Settings, Save, Loader2 } from "lucide-react";

interface SiteSettings {
  siteName: string;
  editorName: string;
  headline: string;
  subheadline: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  email: string;
  phone: string;
  location: string;
  availabilityStatus: boolean;
  availabilityText: string;
  footerText: string;
  contactHeadline: string;
  contactCtaText: string;
  seoTitle: string;
  seoDescription: string;
}

const defaultSettings: SiteSettings = {
  siteName: "",
  editorName: "",
  headline: "",
  subheadline: "",
  ctaPrimaryText: "VIEW MY WORK",
  ctaSecondaryText: "LET'S WORK TOGETHER",
  email: "",
  phone: "",
  location: "",
  availabilityStatus: true,
  availabilityText: "AVAILABLE FOR PROJECTS",
  footerText: "",
  contactHeadline: "",
  contactCtaText: "START A PROJECT",
  seoTitle: "",
  seoDescription: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setForm({ ...defaultSettings, ...d.settings });
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess("Settings saved successfully!");
      } else {
        const d = await res.json();
        setError(d.error || "Save failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({
    label, field, type = "text", placeholder = "", multiline = false, rows = 3
  }: {
    label: string; field: keyof SiteSettings; type?: string; placeholder?: string; multiline?: boolean; rows?: number;
  }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-[#111111] mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={(form[field] as string) || ""}
          onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={(form[field] as string) || ""}
          onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
        />
      )}
    </div>
  );

  if (loading) return <div className="flex items-center justify-center py-16 text-sm text-[#9B9B9B]">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">Site Settings</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Edit all public-facing content from here</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-sm text-green-600">{success}</div>}

      <div className="space-y-6">
        {/* Identity */}
        <div className="bg-white border border-[#E5E5E5] p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">Identity</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Site Name" field="siteName" placeholder="Niloy Kundu — Video Editor" />
            <Field label="Editor Name" field="editorName" placeholder="NILOY KUNDU" />
            <Field label="Email" field="email" type="email" placeholder="hello@example.com" />
            <Field label="Location" field="location" placeholder="India" />
            <Field label="Phone (optional)" field="phone" placeholder="+91 99999 99999" />
          </div>
        </div>

        {/* Hero */}
        <div className="bg-white border border-[#E5E5E5] p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">Hero Section</h2>
          <div className="space-y-4">
            <Field label="Headline (use \\n for line breaks)" field="headline" multiline rows={3}
              placeholder={"I EDIT STORIES\nTHAT MAKE\nPEOPLE WATCH."} />
            <Field label="Subheadline / Description" field="subheadline" multiline rows={2} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Primary CTA Button Text" field="ctaPrimaryText" placeholder="VIEW MY WORK" />
              <Field label="Secondary CTA Button Text" field="ctaSecondaryText" placeholder="LET'S WORK TOGETHER" />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white border border-[#E5E5E5] p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">Availability</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#111111]">Available for Projects</p>
                <p className="text-xs text-[#9B9B9B]">Controls the "Available" badge in the header</p>
              </div>
              <div
                onClick={() => setForm((f) => ({ ...f, availabilityStatus: !f.availabilityStatus }))}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${form.availabilityStatus ? "bg-green-500" : "bg-[#D1D1D1]"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform shadow-sm ${form.availabilityStatus ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
            <Field label="Availability Text" field="availabilityText" placeholder="AVAILABLE FOR PROJECTS" />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-[#E5E5E5] p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">Contact Section</h2>
          <div className="space-y-4">
            <Field label="Contact Headline" field="contactHeadline" multiline rows={2}
              placeholder={"LET'S MAKE SOMETHING\nWORTH WATCHING."} />
            <Field label="CTA Button Text" field="contactCtaText" placeholder="START A PROJECT" />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-[#E5E5E5] p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9B9B] mb-4">SEO</h2>
          <div className="space-y-4">
            <Field label="SEO Title" field="seoTitle" placeholder="Niloy Kundu — Video Editor" />
            <Field label="Meta Description" field="seoDescription" multiline rows={2}
              placeholder="Professional video editor with 2+ years experience..." />
            <Field label="Footer Text" field="footerText" placeholder="© 2026 Niloy Kundu. All rights reserved." />
          </div>
        </div>
      </div>
    </div>
  );
}
