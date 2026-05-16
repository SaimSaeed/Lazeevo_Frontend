"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/themeContext";
import { Sparkles, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrialBanner() {
  const { isDark } = useTheme();
  const [tenant, setTenant] = useState<any>(null);

  useEffect(() => {
    const t = localStorage.getItem("tenant");
    if (t) {
      try {
        setTenant(JSON.parse(t));
      } catch (e) {}
    }
  }, []);

  if (!tenant || tenant.subscriptionStatus !== "trial") {
    return null;
  }

  const trialEnds = tenant.trialEndsAt ? new Date(tenant.trialEndsAt) : null;
  const formattedDate = trialEnds
    ? trialEnds.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "soon";

  let daysRemaining = null;
  if (trialEnds) {
    const diff = trialEnds.getTime() - Date.now();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div
      className={`w-full px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap transition-all border-b z-30 relative overflow-hidden ${
        isDark
          ? "bg-[#111113] border-white/[0.07] text-[#f0f0f4]"
          : "bg-teal-50/40 border-teal-100 text-[#111]"
      }`}
    >
      {/* Subtle glow background */}
      <div className="absolute top-0 left-1/3 w-[300px] h-full bg-teal-500/10 blur-2xl rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
            isDark
              ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
              : "bg-teal-100 text-teal-700 border-teal-200"
          }`}
        >
          <Clock size={16} className="animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold tracking-tight">
              You are currently on a trial subscription
            </span>
            {daysRemaining !== null && (
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  daysRemaining <= 3
                    ? isDark
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-red-100 text-red-700 border-red-200"
                    : isDark
                      ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                      : "bg-teal-200/70 text-teal-800 border-teal-300"
                }`}
              >
                {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
              </span>
            )}
          </div>
          <p
            className={`text-xs mt-0.5 ${isDark ? "text-[#aaa]" : "text-[#666]"}`}
          >
            Your trial will expire on <span className="font-semibold text-teal-500">{formattedDate}</span>. Upgrade to unlock unlimited access.
          </p>
        </div>
      </div>

      <Link
        href="#"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] relative z-10 flex-shrink-0 ml-auto"
      >
        <Sparkles size={14} /> Upgrade Plan <ArrowRight size={14} />
      </Link>
    </div>
  );
}
