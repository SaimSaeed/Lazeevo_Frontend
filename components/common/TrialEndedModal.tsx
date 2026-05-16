"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/themeContext";
import { Lock, PhoneCall, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TrialEndedModal() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkExpiration = () => {
      const t = localStorage.getItem("tenant");
      if (t) {
        try {
          const tenant = JSON.parse(t);
          if (tenant) {
            const isTrial = tenant.subscriptionStatus === "trial";
            const isSuspended = tenant.subscriptionStatus === "suspended";
            const trialEnds = tenant.trialEndsAt ? new Date(tenant.trialEndsAt).getTime() : null;
            const now = Date.now();

            if (isSuspended || (isTrial && trialEnds && now >= trialEnds)) {
              setIsExpired(true);
            }
          }
        } catch (e) {}
      }
    };

    checkExpiration();
    // Check periodically in case trial expires while app is open
    const interval = setInterval(checkExpiration, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isExpired) return null;

  function handleLogout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.clear();
    toast.success("Logged out successfully.");
    router.push("/signin");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-md p-8 rounded-3xl border flex flex-col items-center text-center shadow-2xl relative overflow-hidden ${
        isDark ? "bg-[#111113] border-white/[0.08] text-[#f0f0f4]" : "bg-white border-teal-100 text-[#111]"
      }`}>
        {/* Ambient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border mb-6 relative z-10 ${
          isDark ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-600 border-red-100"
        }`}>
          <Lock size={32} className="animate-pulse" />
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight mb-2 font-syne relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>
          Your Trial Has Ended
        </h2>
        
        <p className={`text-sm mb-8 leading-relaxed relative z-10 ${isDark ? "text-[#aaa]" : "text-[#666]"}`}>
          Your subscription trial period has expired. Please contact the administrator to renew your access or purchase a subscription plan to continue using the platform.
        </p>

        <div className="flex flex-col gap-3 w-full relative z-10">
          <button
            onClick={() => toast.info("Please contact our support team at support@lazeevo.com or call +92 300 0000000")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-teal-500/20"
          >
            <PhoneCall size={16} /> Contact Administrator / Buy Plan
          </button>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors border ${
              isDark 
                ? "bg-white/[0.04] hover:bg-white/[0.08] text-[#ccc] border-white/[0.08]" 
                : "bg-black/[0.03] hover:bg-black/[0.06] text-[#555] border-black/[0.08]"
            }`}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
