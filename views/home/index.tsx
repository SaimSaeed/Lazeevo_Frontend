"use client";
import { useTheme } from "@/context/themeContext";
import { PublicAPI } from "@/lib/axios";
import {
  ArrowRight,
  CheckCircle,
  ChefHat,
  Download,
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Plan } from "@/types/Plans";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPKR(n: number) {
  return n?.toLocaleString("en-PK");
}

function formatLimit(val: number | "Unlimited", unit: string) {
  return val === "Unlimited" ? `Unlimited ${unit}` : `${val} ${unit}`;
}

function getPlanFeatures(plan: Plan): string[] {
  return [
    formatLimit(plan.limits.cashiers, "Cashier(s)"),
    formatLimit(plan.limits.kitchenStaff, "Kitchen screen(s)"),
    formatLimit(plan.limits.menuItems, "Menu items"),
    formatLimit(plan.limits.categories, "Categories"),
    ...(plan.features.deliveryTracking ? ["Delivery tracking"] : []),
    ...(plan.features.reports ? ["Reports"] : []),
    ...(plan.features.inventory ? ["Inventory management"] : []),
    ...(plan.features.multipleReceipts ? ["Multiple receipts"] : []),
    ...(plan.features.fullDashboard ? ["Full dashboard"] : []),
  ];
}

// ── Static data ───────────────────────────────────────────────────────────────
const features = [
  { icon: UtensilsCrossed, label: "Dine In", sub: "Table service" },
  { icon: ShoppingBag, label: "Takeaway", sub: "Walk-in orders" },
  { icon: Truck, label: "Delivery", sub: "Dispatch & track" },
  { icon: Receipt, label: "Receipts", sub: "History" },
  { icon: ChefHat, label: "Menu", sub: "Items & pricing" },
  { icon: LayoutDashboard, label: "Dashboard", sub: "Analytics" },
];

const stats = [
  { value: "500+", label: "Restaurants" },
  { value: "99.9%", label: "Uptime" },
  { value: "3x", label: "Faster orders" },
  { value: "PKR 1k", label: "Starting price" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { isDark } = useTheme();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await PublicAPI.get("/plans/get-all");
        console.log("Plans", res);
        if (res?.data) setPlans(res.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Failed to load plans.");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const highlightIndex = Math.floor(plans.length / 2); // middle card = popular

  return (
    <>
      {/* ── Hero ── */}
      <section
        className={`min-h-screen flex items-center justify-center px-6 py-24 ${isDark ? "bg-[#0c0c0e]" : "bg-[#f0fafa]"}`}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border ${isDark ? "bg-teal-500/10 border-teal-500/20 text-teal-400" : "bg-teal-50 border-teal-200 text-teal-600"}`}
          >
            <Zap size={12} /> Now with delivery tracking
          </div>

          <h1
            className={`text-5xl md:text-7xl font-extrabold tracking-tight leading-none ${isDark ? "text-[#f0f0f4]" : "text-[#111113]"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            The POS built for
            <br />
            <span className="text-teal-500">Pakistani</span> restaurants
          </h1>

          <p
            className={`text-lg max-w-xl leading-relaxed ${isDark ? "text-[#666]" : "text-[#888]"}`}
          >
            Lazeevo is a fast, simple, and affordable point-of-sale system for
            restaurants of all sizes. Run on Windows, Mac, or the web.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-teal-600 hover:bg-teal-700">
              <Download size={16} /> Download Free
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold border transition-all hover:scale-[1.02] ${isDark ? "border-teal-500/30 text-teal-400 hover:bg-teal-500/10" : "border-teal-600/30 text-teal-600 hover:bg-teal-50"}`}
            >
              Learn more <ArrowRight size={14} />
            </button>
          </div>

          <div
            className={`w-full max-w-2xl grid grid-cols-4 gap-4 mt-8 p-6 rounded-2xl border ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`}
            style={{
              boxShadow: isDark
                ? "0 2px 24px rgba(0,0,0,0.45)"
                : "0 2px 16px rgba(13,148,136,0.08)",
            }}
          >
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className="text-2xl font-extrabold text-teal-500"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {s.value}
                </span>
                <span
                  className={`text-xs ${isDark ? "text-[#555]" : "text-[#aaa]"}`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={`px-6 py-24 ${isDark ? "bg-[#0e0e10]" : "bg-white"}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-3 ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Everything you need
            </h2>
            <p className={`text-sm ${isDark ? "text-[#555]" : "text-[#999]"}`}>
              Built for the chaos of a real restaurant kitchen.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className={`group relative flex flex-col items-center justify-center py-10 gap-4 rounded-2xl border transition-all duration-200 hover:scale-[1.02] cursor-default ${isDark ? "bg-[#111113] border-white/[0.07] hover:border-teal-500/30" : "bg-[#fafafa] border-black/[0.07] hover:border-teal-400/40"}`}
                  style={{
                    boxShadow: isDark
                      ? "0 2px 24px rgba(0,0,0,0.45)"
                      : "0 2px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-teal-500" />
                  <div className="flex items-center justify-center rounded-2xl w-14 h-14 transition-transform duration-200 group-hover:scale-110 bg-teal-500/10">
                    <Icon
                      size={24}
                      strokeWidth={1.6}
                      className="text-teal-500"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-center">
                    <span
                      className={`font-bold text-[15px] ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {f.label}
                    </span>
                    <span
                      className={`text-[11px] ${isDark ? "text-[#555]" : "text-[#aaa]"}`}
                    >
                      {f.sub}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        className={`px-6 py-24 ${isDark ? "bg-[#0c0c0e]" : "bg-[#f0fafa]"}`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-3 ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Simple pricing
            </h2>
            <p className={`text-sm ${isDark ? "text-[#555]" : "text-[#999]"}`}>
              {plans[0]?.trialDays ?? 14}-day free trial. No credit card
              required.
            </p>
          </div>

          {/* ── Skeleton ── */}
          {plansLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-96 rounded-2xl border animate-pulse ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-black/[0.07]"}`}
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4 items-stretch">
              {plans.map((plan, i) => {
                const isHighlight = i === highlightIndex;
                const planFeatures = getPlanFeatures(plan);

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col justify-between gap-6 p-7 rounded-2xl border transition-all h-full ${
                      isHighlight
                        ? "border-teal-500/40 scale-[1.02]"
                        : isDark
                          ? "bg-[#111113] border-white/[0.07]"
                          : "bg-white border-black/[0.07]"
                    }`}
                    style={{
                      background: isHighlight
                        ? isDark
                          ? "#001a18"
                          : "#f0fdf9"
                        : undefined,
                      boxShadow: isHighlight
                        ? "0 0 40px rgba(13,148,136,0.15)"
                        : isDark
                          ? "0 2px 24px rgba(0,0,0,0.45)"
                          : "0 2px 16px rgba(0,0,0,0.06)",
                    }}
                  >
                    {isHighlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white bg-teal-600">
                        POPULAR
                      </div>
                    )}

                    {/* Name + price */}
                    <p
                      className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}
                    >
                      {plan.displayName}
                    </p>
                    <p
                      className={`text-[11px] mb-3 ${isDark ? "text-[#444]" : "text-[#bbb]"}`}
                    >
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-xs ${isDark ? "text-[#555]" : "text-[#aaa]"}`}
                      >
                        PKR
                      </span>
                      <span
                        className="text-4xl font-extrabold text-teal-500"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {formatPKR(plan.pricing.monthly)}{" "}
                        {/* ← was plan.priceMonthly */}
                      </span>
                      <span
                        className={`text-xs ${isDark ? "text-[#555]" : "text-[#aaa]"}`}
                      >
                        /mo
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-2">
                      {planFeatures.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle
                            size={14}
                            className="text-teal-500 flex-shrink-0"
                          />
                          <span
                            className={isDark ? "text-[#999]" : "text-[#555]"}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href={`/onboarding?plan=${plan.id}`}
                      className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all hover:scale-[1.02] ${
                        isHighlight
                          ? "text-white bg-teal-600 hover:bg-teal-700"
                          : isDark
                            ? "bg-white/[0.07] text-white hover:bg-teal-500/10 hover:text-teal-400"
                            : "bg-black/[0.05] text-black hover:bg-teal-50 hover:text-teal-600"
                      }`}
                    >
                      {plan.name === "basic" ? "Start free trial" : "Buy now"}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`px-6 py-24 ${isDark ? "bg-[#0e0e10]" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto">
          <div
            className={`relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-3xl border ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-[#f0fdf9] border-teal-100"}`}
            style={{
              boxShadow: isDark
                ? "0 0 60px rgba(13,148,136,0.08)"
                : "0 4px 32px rgba(13,148,136,0.1)",
            }}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-10 bg-teal-500 pointer-events-none" />

            <div className="flex flex-col gap-3 relative z-10">
              <span
                className={`text-xs font-semibold uppercase tracking-widest ${isDark ? "text-teal-400" : "text-teal-600"}`}
              >
                Get started today
              </span>
              <h2
                className={`text-3xl md:text-4xl font-extrabold tracking-tight leading-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Your restaurant deserves
                <br />
                <span className="text-teal-500">better software.</span>
              </h2>
              <p
                className={`text-sm max-w-sm leading-relaxed ${isDark ? "text-[#555]" : "text-[#888]"}`}
              >
                Join 500+ restaurants already running on Lazeevo.{" "}
                {plans[0]?.trialDays ?? 14}-day free trial, no credit card
                needed.
              </p>
            </div>

            <div className="flex flex-col gap-3 relative z-10 flex-shrink-0">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-teal-600 hover:bg-teal-700 whitespace-nowrap"
              >
                <Download size={16} /> Start free trial
              </Link>
              <button
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold border transition-all hover:scale-[1.02] whitespace-nowrap ${isDark ? "border-teal-500/30 text-teal-400 hover:bg-teal-500/10" : "border-teal-600/30 text-teal-600 hover:bg-teal-50"}`}
              >
                View all features <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {[
              { emoji: "✅", text: "No credit card required" },
              { emoji: "🔒", text: "Your data stays yours" },
              { emoji: "🇵🇰", text: "Built for Pakistan" },
              { emoji: "💬", text: "Email support included" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm">{item.emoji}</span>
                <span
                  className={`text-xs font-medium ${isDark ? "text-[#555]" : "text-[#999]"}`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
