"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-semibold tracking-widest text-[#9B9B9B] uppercase mb-3">
            Portfolio CMS
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#111111]">
            Admin Login
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold tracking-wide text-[#111111] uppercase mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-white text-sm text-[#111111] placeholder-[#9B9B9B] focus:outline-none focus:border-[#111111] transition-colors"
              placeholder="admin@portfolio.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold tracking-wide text-[#111111] uppercase mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-white text-sm text-[#111111] placeholder-[#9B9B9B] focus:outline-none focus:border-[#111111] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#111111] text-white text-sm font-semibold tracking-wide uppercase hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
          <p className="text-xs text-[#9B9B9B] text-center">
            Forgot your password?{" "}
            <span className="text-[#6B6B6B]">
              Run <code className="bg-[#F5F5F3] px-1">npm run setup:admin</code>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
