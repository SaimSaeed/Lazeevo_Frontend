// app/signin/page.tsx
"use client";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { PublicAPI } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useTheme } from "@/context/themeContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function SigninPage() {
  const { isDark } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      const response = await PublicAPI.post("/auth/login", { email, password });

      if (response?.data) {
        const { accessToken, user, tenant } = response.data;

        Cookies.set("accessToken", accessToken, { expires: 1 });
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tenant", JSON.stringify(tenant));

        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? (error.response?.data?.message ?? "Login failed.")
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${
    isDark
      ? "bg-[#0c0c0e] border-white/[0.08] text-white placeholder-[#444] focus:border-teal-500/50 focus:ring-teal-500/10"
      : "bg-white border-black/[0.08] text-[#111] placeholder-[#bbb] focus:border-teal-400/60 focus:ring-teal-400/10"
  }`;

  const labelCls = `text-xs font-medium mb-1.5 block ${isDark ? "text-[#555]" : "text-[#999]"}`;

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center px-6 transition-colors duration-300 relative overflow-hidden
        ${isDark ? "bg-[#0c0c0e]" : "bg-[#f0fafa]"}`}
    >
      {/* ── Ambient glow blobs — same as home ── */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[80px] pointer-events-none bg-teal-500" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[60px] pointer-events-none bg-teal-500" />

      <div className="w-full max-w-sm relative z-10">
        {/* ── Logo ── */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-1 ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`}
            style={{
              boxShadow: isDark
                ? "0 2px 24px rgba(0,0,0,0.45)"
                : "0 2px 16px rgba(13,148,136,0.08)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="#0d9488"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3v4a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3" />
              <path d="M10 9v12" />
              <path d="M16 3v18" />
              <path d="M14 7h4" />
            </svg>
          </div>

          <h1
            className={`text-3xl font-extrabold tracking-tight leading-none ${isDark ? "text-[#f0f0f4]" : "text-[#111113]"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span className="text-teal-500">Laz</span>eevo
          </h1>
          <p className={`text-sm ${isDark ? "text-[#555]" : "text-[#999]"}`}>
            Sign in to your restaurant portal
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className={`w-full rounded-2xl border p-8 flex flex-col gap-6 relative overflow-hidden ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`}
          style={{
            boxShadow: isDark
              ? "0 2px 24px rgba(0,0,0,0.45)"
              : "0 2px 16px rgba(13,148,136,0.08)",
          }}
        >
          {/* top teal accent line — same as home cards on hover but always visible */}
          <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full bg-teal-500 opacity-60" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className={labelCls}>Email Address</label>
              <input
                type="email"
                placeholder="ahmed@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelCls.replace("mb-1.5 block", "")}>
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-teal-500 hover:text-teal-400 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCls} pr-10`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-[#444] hover:text-white" : "text-[#ccc] hover:text-black"}`}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            className={`w-full h-px ${isDark ? "bg-white/[0.05]" : "bg-teal-50"}`}
          />

          {/* Footer */}
          <div className="flex flex-col gap-2 text-center">
            <p className={`text-xs ${isDark ? "text-[#444]" : "text-[#ccc]"}`}>
              Don't have an account?{" "}
              <Link
                href="/onboarding"
                className="text-teal-500 hover:text-teal-400 font-medium"
              >
                Register your restaurant
              </Link>
            </p>
            <p className={`text-xs ${isDark ? "text-[#333]" : "text-[#ddd]"}`}>
              This portal is for restaurant admins only.
            </p>
          </div>
        </div>

        {/* ── Trust row — same as home ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
          {[
            { emoji: "🔒", text: "Encrypted & secure" },
            { emoji: "🇵🇰", text: "Built for Pakistan" },
            { emoji: "💬", text: "24/7 support" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-sm">{item.emoji}</span>
              <span
                className={`text-xs font-medium ${isDark ? "text-[#444]" : "text-[#bbb]"}`}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
