"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Film, Plus, Search, Eye, EyeOff, Star, StarOff, Pencil, Trash2, ExternalLink,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  thumbnailUrl: string | null;
  category: { name: string } | null;
  client: string | null;
  year: number | null;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/projects?all=true");
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client?.toLowerCase().includes(search.toLowerCase())
  );

  const togglePublish = async (id: string, published: boolean) => {
    await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    fetchProjects();
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
    setDeleting(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">Projects</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">{projects.length} total projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] transition-colors"
        >
          <Plus size={14} />
          New Project
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B9B]" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] bg-white text-sm text-[#111111] placeholder-[#9B9B9B] focus:outline-none focus:border-[#111111] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#9B9B9B] text-sm">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#9B9B9B]">
            <Film size={32} className="mb-3 text-[#D1D1D1]" />
            <p className="text-sm">No projects found</p>
            <Link href="/admin/projects/new" className="mt-4 text-xs text-[#111111] underline">
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Project</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden lg:table-cell">Client</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr key={project.id} className="border-b border-[#F5F5F3] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {project.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-10 h-10 object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#F5F5F3] flex items-center justify-center flex-shrink-0">
                            <Film size={14} className="text-[#D1D1D1]" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{project.title}</p>
                          <p className="text-xs text-[#9B9B9B]">{project.year || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs text-[#6B6B6B]">
                        {project.category?.name || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-xs text-[#6B6B6B]">{project.client || "—"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${project.published ? "bg-green-50 text-green-600" : "bg-[#F5F5F3] text-[#9B9B9B]"}`}>
                        {project.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleFeatured(project.id, project.featured)}
                          title={project.featured ? "Remove featured" : "Mark featured"}
                          className="p-1.5 text-[#9B9B9B] hover:text-yellow-500 transition-colors"
                        >
                          {project.featured ? <Star size={14} className="fill-yellow-400 text-yellow-500" /> : <StarOff size={14} />}
                        </button>
                        <button
                          onClick={() => togglePublish(project.id, project.published)}
                          title={project.published ? "Unpublish" : "Publish"}
                          className="p-1.5 text-[#9B9B9B] hover:text-[#111111] transition-colors"
                        >
                          {project.published ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-1.5 text-[#9B9B9B] hover:text-[#111111] transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        {project.published && (
                          <Link
                            href={`/work/${project.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#9B9B9B] hover:text-[#111111] transition-colors"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                        <button
                          onClick={() => deleteProject(project.id)}
                          disabled={deleting === project.id}
                          className="p-1.5 text-[#9B9B9B] hover:text-red-500 disabled:opacity-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
