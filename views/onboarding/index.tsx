"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/context/themeContext";
import {
  Building2, Mail, Lock, Phone, MapPin, ChefHat,
  CheckCircle, ArrowRight, Eye, EyeOff, Loader2,
  CreditCard, Shield,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicAPI } from "@/lib/axios";
import { toast } from "sonner";
import StepIndicator from "@/components/common/StepIndicator";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Plan {
  id:          number;
  name:        string;
  displayName: string;
  description: string;
  trialDays:   number;
  limits: {
    cashiers:     number | "Unlimited";
    kitchenStaff: number | "Unlimited";
    menuItems:    number | "Unlimited";
    categories:   number | "Unlimited";
  };
  features: {
    deliveryTracking: boolean;
    fullDashboard:    boolean;
    reports:          boolean;
    inventory:        boolean;
    multipleReceipts: boolean;
  };
  pricing: {
    monthly:    number;
    halfYearly: number;
    yearly:     number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const billingCycles = [
  { val: "monthly",     label: "Monthly",     saving: null,  months: 1  },
  { val: "half_yearly", label: "Half-Yearly", saving: "17%", months: 6  },
  { val: "yearly",      label: "Yearly",      saving: "25%", months: 12 },
];

const cities = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Other",
];

const STEPS = [
  { label: "Restaurant & Account" },
  { label: "Choose Plan"          },
  { label: "Payment"              },
];

type Step = 1 | 2 | 3;
type BillingCycle = "monthly" | "half_yearly" | "yearly";

function getPriceForCycle(plan: Plan, cycle: BillingCycle): number {
  if (cycle === "monthly")     return plan.pricing.monthly;
  if (cycle === "half_yearly") return plan.pricing.halfYearly;
  return plan.pricing.yearly;
}

function getPerMonthPrice(plan: Plan, cycle: BillingCycle): number {
  if (cycle === "monthly")     return plan.pricing.monthly;
  if (cycle === "half_yearly") return Math.round(plan.pricing.halfYearly / 6);
  return Math.round(plan.pricing.yearly / 12);
}

function formatPKR(n: number) {
  return n?.toLocaleString("en-PK");
}

function getPlanFeatures(plan: Plan): string[] {
  const { limits, features } = plan;
  return [
    `${limits.cashiers} Cashier(s)`,
    `${limits.kitchenStaff} Kitchen screen(s)`,
    `${limits.menuItems} Menu items`,
    `${limits.categories} Categories`,
    ...(features.deliveryTracking ? ["Delivery tracking"]    : []),
    ...(features.reports          ? ["Reports"]              : []),
    ...(features.inventory        ? ["Inventory management"] : []),
    ...(features.multipleReceipts ? ["Multiple receipts"]    : []),
    ...(features.fullDashboard    ? ["Full dashboard"]       : []),
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const { isDark }    = useTheme();
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const defaultPlanId = searchParams.get("plan");

  const [step,         setStep]         = useState<Step>(1);
  const [showPass,     setShowPass]     = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [plans,        setPlans]        = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const [form, setForm] = useState({
    restaurantName:     "",
    ownerName:          "",
    city:               "",
    address:            "",
    phone:              "",
    email:              "",
    password:           "",
    confirm:            "",
    plan:               "",
    billingCycle:       "monthly" as BillingCycle,
    subscriptionStatus: "trial" as "trial" | "active",
  });

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const selectedCycle  = billingCycles.find((b) => b.val === form.billingCycle)!;
  const selectedPlan   = plans.find((p) => p.name === form.plan) ?? null;
  const isBasicPlan    = form.plan === "basic";
  const totalPrice     = selectedPlan ? getPriceForCycle(selectedPlan, form.billingCycle) : 0;
  const perMonthPrice  = selectedPlan ? getPerMonthPrice(selectedPlan, form.billingCycle) : 0;
  const monthlyFull    = selectedPlan ? selectedPlan.pricing.monthly * selectedCycle.months : 0;
  const savedAmount    = form.billingCycle !== "monthly" ? monthlyFull - totalPrice : 0;

  // ── Fetch plans ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await PublicAPI.get("/plans/get-all");
        if (res?.data) setPlans(res.data);
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Failed to load plans.");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // ── Set plan from URL param once plans load ───────────────────────────────
  useEffect(() => {
    if (plans.length > 0) {
      if (defaultPlanId) {
        const match = plans.find((p) => p.id === Number(defaultPlanId));
        set("plan", match ? match.name : plans[0].name);
      } else {
        set("plan", plans[0].name);
      }
    }
  }, [plans]);

  // ── Auto-set subscriptionStatus based on plan ─────────────────────────────
  useEffect(() => {
    set("subscriptionStatus", isBasicPlan ? "trial" : "active");
  }, [form.plan]);

  // ── Validation ────────────────────────────────────────────────────────────
  const step1Valid =
    form.restaurantName.trim() &&
    form.ownerName.trim() &&
    form.city &&
    form.phone.trim() &&
    form.email.trim() &&
    form.password.length >= 6 &&
    form.password === form.confirm;

  // ── Step 2 → 3 handler ────────────────────────────────────────────────────
  function handlePlanContinue() {
    // basic → show trial info on step 3
    // intermediate/advanced → show payment on step 3
    setStep(3);
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await PublicAPI.post("/auth/register", {
        restaurantName:     form.restaurantName,
        ownerName:          form.ownerName,
        city:               form.city,
        phone:              form.phone,
        address:            form.address || undefined,
        ownerEmail:         form.email,
        password:           form.password,
        planName:           form.plan,
        billingCycle:       form.billingCycle,
        subscriptionStatus: form.subscriptionStatus,
      });
      toast.success("Account created! Please sign in.");
      router.push("/signin");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Something went wrong.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${
    isDark
      ? "bg-[#0c0c0e] border-white/[0.08] text-white placeholder-[#444] focus:border-teal-500/50 focus:ring-teal-500/10"
      : "bg-white border-black/[0.08] text-[#111] placeholder-[#bbb] focus:border-teal-400/60 focus:ring-teal-400/10"
  }`;
  const labelCls  = `text-xs font-medium mb-1.5 block ${isDark ? "text-[#555]" : "text-[#999]"}`;
  const cardCls   = `p-8 rounded-2xl border ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`;
  const cardStyle = { boxShadow: isDark ? "0 2px 24px rgba(0,0,0,0.45)" : "0 2px 16px rgba(13,148,136,0.08)" };

  return (
    <div className={`h-full w-full transition-colors duration-300 ${isDark ? "bg-[#0c0c0e]" : "bg-[#f0fafa]"}`}>
      <div className="max-w-5xl mx-auto py-16 px-6 items-start">

        {/* Header */}
        <div className="mb-10">
          <Link href="/"
            className={`text-xs font-medium mb-4 flex items-center gap-1 w-fit transition-all ${isDark ? "text-[#555] hover:text-teal-400" : "text-[#aaa] hover:text-teal-600"}`}>
            ← Back to home
          </Link>
          <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-2 ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Register your <span className="text-teal-500">restaurant</span>
          </h1>
          <p className={`text-sm ${isDark ? "text-[#555]" : "text-[#999]"}`}>
            Set up your account in 3 quick steps.{" "}
            {isBasicPlan ? `${plans[0]?.trialDays ?? 14}-day free trial included.` : "No trial — instant access."}
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={step} steps={STEPS} />

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className={cardCls} style={cardStyle}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/10">
                <Building2 size={20} className="text-teal-500" />
              </div>
              <div>
                <p className={`font-bold text-base ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  Restaurant & Account
                </p>
                <p className={`text-xs ${isDark ? "text-[#555]" : "text-[#999]"}`}>
                  Your restaurant info and login credentials
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Restaurant Name *</label>
                <div className="relative">
                  <ChefHat size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`} />
                  <input className={`${inputCls} pl-10`} placeholder="Al Baik Lahore"
                    value={form.restaurantName} onChange={(e) => set("restaurantName", e.target.value)} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Owner Name *</label>
                <div className="relative">
                  <ChefHat size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`} />
                  <input className={`${inputCls} pl-10`} placeholder="Ahmed Ali"
                    value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
                </div>
              </div>

              <div>
                <label className={labelCls}>City *</label>
                <select className={`${inputCls} cursor-pointer`} value={form.city}
                  onChange={(e) => set("city", e.target.value)}>
                  <option value="">Select city</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls}>Phone *</label>
                <div className="relative">
                  <Phone size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`} />
                  <input className={`${inputCls} pl-10`} placeholder="03XX-XXXXXXX"
                    value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
              </div>

              <div className="col-span-2">
                <label className={labelCls}>
                  Address <span className={isDark ? "text-[#444]" : "text-[#ccc]"}>(optional)</span>
                </label>
                <div className="relative">
                  <MapPin size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`} />
                  <input className={`${inputCls} pl-10`} placeholder="Street, Area"
                    value={form.address} onChange={(e) => set("address", e.target.value)} />
                </div>
              </div>

              {/* Divider */}
              <div className="col-span-2 flex items-center gap-4">
                <div className={`flex-1 h-px ${isDark ? "bg-white/[0.05]" : "bg-teal-50"}`} />
                <p className={`text-xs font-semibold uppercase tracking-widest flex-shrink-0 ${isDark ? "text-[#444]" : "text-[#bbb]"}`}>
                  Login Credentials
                </p>
                <div className={`flex-1 h-px ${isDark ? "bg-white/[0.05]" : "bg-teal-50"}`} />
              </div>

              <div className="col-span-2">
                <label className={labelCls}>Email Address *</label>
                <div className="relative">
                  <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`} />
                  <input className={`${inputCls} pl-10`} type="email" placeholder="ahmed@restaurant.com"
                    value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
              </div>

              <div>
                <label className={labelCls}>
                  Password * <span className={`font-normal ${isDark ? "text-[#444]" : "text-[#ccc]"}`}>(min 6)</span>
                </label>
                <div className="relative">
                  <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`} />
                  <input className={`${inputCls} pl-10 pr-10`} type={showPass ? "text" : "password"}
                    placeholder="••••••••" value={form.password}
                    onChange={(e) => set("password", e.target.value)} />
                  <button type="button" onClick={() => setShowPass((p) => !p)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444] hover:text-white" : "text-[#ccc] hover:text-black"}`}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelCls}>Confirm Password *</label>
                <div className="relative">
                  <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`} />
                  <input
                    className={`${inputCls} pl-10 pr-10 ${form.confirm && form.password !== form.confirm ? "border-red-500/50" : ""}`}
                    type={showConfirm ? "text" : "password"} placeholder="••••••••"
                    value={form.confirm} onChange={(e) => set("confirm", e.target.value)} />
                  <button type="button" onClick={() => setShowConfirm((p) => !p)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444] hover:text-white" : "text-[#ccc] hover:text-black"}`}>
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-red-400 text-[11px] mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            <button onClick={() => step1Valid && setStep(2)}
              className={`mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.01] ${step1Valid ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-600/30 cursor-not-allowed"}`}>
              Continue <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* ── Step 2 — Plan ── */}
        {step === 2 && (
          <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">

            {/* Left — plan selector */}
            <div className={cardCls} style={cardStyle}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/10">
                  <CheckCircle size={20} className="text-teal-500" />
                </div>
                <div>
                  <p className={`font-bold text-base ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}>Choose Your Plan</p>
                  <p className={`text-xs ${isDark ? "text-[#555]" : "text-[#999]"}`}>
                    Basic includes a {plans[0]?.trialDays ?? 14}-day free trial
                  </p>
                </div>
              </div>

              {/* Billing cycle */}
              <div className="mb-5">
                <label className={labelCls}>Billing Cycle</label>
                <div className={`flex rounded-xl overflow-hidden border ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`}>
                  {billingCycles.map((b, i) => (
                    <button key={b.val} onClick={() => set("billingCycle", b.val)}
                      className={`flex-1 py-2.5 text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                        form.billingCycle === b.val ? "bg-teal-600 text-white"
                        : isDark ? "text-[#555] hover:text-white hover:bg-white/[0.05]"
                        : "text-[#aaa] hover:text-black hover:bg-black/[0.03]"
                      } ${i > 0 ? isDark ? "border-l border-white/[0.08]" : "border-l border-black/[0.08]" : ""}`}>
                      {b.label}
                      {b.saving && (
                        <span className={`text-[9px] font-bold ${form.billingCycle === b.val ? "text-teal-200" : "text-teal-500"}`}>
                          Save {b.saving}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan list */}
              <div className="flex flex-col gap-3 mb-6">
                {plansLoading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className={`h-16 rounded-xl border animate-pulse ${isDark ? "bg-white/[0.03] border-white/[0.07]" : "bg-black/[0.03] border-black/[0.07]"}`} />
                  ))
                ) : (
                  plans.map((p) => {
                    const price       = getPriceForCycle(p, form.billingCycle);
                    const perMonth    = getPerMonthPrice(p, form.billingCycle);
                    const fullMonthly = p.pricing.monthly * selectedCycle.months;
                    const saved       = form.billingCycle !== "monthly" ? fullMonthly - price : 0;
                    const isSelected  = form.plan === p.name;
                    const isTrial     = p.name === "basic";

                    return (
                      <button key={p.name} onClick={() => set("plan", p.name)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                          isSelected ? "border-teal-500/60 bg-teal-500/5"
                          : isDark ? "border-white/[0.07] hover:border-white/[0.15]"
                          : "border-black/[0.07] hover:border-black/[0.12]"
                        }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-teal-500" : isDark ? "border-white/[0.2]" : "border-black/[0.2]"}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-teal-500" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`font-semibold text-sm ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}>
                                {p.displayName}
                              </p>
                              {isTrial && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isDark ? "bg-teal-500/15 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                                  {p.trialDays}-DAY TRIAL
                                </span>
                              )}
                            </div>
                            <p className={`text-[11px] mt-0.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                              {selectedCycle.label}
                              {saved > 0 && (
                                <span className="text-teal-500 ml-1.5 font-medium">
                                  · Save PKR {formatPKR(saved)}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-bold ${isSelected ? "text-teal-500" : isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                            PKR {formatPKR(price)}
                          </p>
                          {form.billingCycle !== "monthly" && (
                            <p className={`text-[10px] ${isDark ? "text-[#444]" : "text-[#ccc]"}`}>
                              PKR {formatPKR(perMonth)}/mo
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className={`px-6 py-3.5 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.01] ${isDark ? "border-white/[0.08] text-[#888] hover:text-white hover:bg-white/[0.05]" : "border-black/[0.08] text-[#999] hover:text-black hover:bg-black/[0.04]"}`}>
                  Back
                </button>
                <button onClick={handlePlanContinue} disabled={!form.plan}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right — order summary */}
            <div className="flex flex-col gap-4 sticky top-6">
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`} style={cardStyle}>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isDark ? "text-[#444]" : "text-[#bbb]"}`}>
                  Order Summary
                </p>
                {plansLoading || !selectedPlan ? (
                  <div className={`h-40 rounded-xl animate-pulse ${isDark ? "bg-white/[0.03]" : "bg-black/[0.03]"}`} />
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-base ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        {selectedPlan.displayName} Plan
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                        {selectedCycle.label}
                      </span>
                    </div>
                    <div className={`w-full h-px ${isDark ? "bg-white/[0.05]" : "bg-teal-50"}`} />
                    {getPlanFeatures(selectedPlan).map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle size={13} className="text-teal-500 flex-shrink-0" />
                        <span className={`text-xs ${isDark ? "text-[#555]" : "text-[#888]"}`}>{f}</span>
                      </div>
                    ))}
                    <div className={`w-full h-px ${isDark ? "bg-white/[0.05]" : "bg-teal-50"}`} />
                    <div className="flex flex-col gap-1.5">
                      {form.billingCycle !== "monthly" && (
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${isDark ? "text-[#444]" : "text-[#ccc]"}`}>
                            PKR {formatPKR(selectedPlan.pricing.monthly)}/mo × {selectedCycle.months}mo
                          </span>
                          <span className={`text-xs line-through ${isDark ? "text-[#444]" : "text-[#ccc]"}`}>
                            PKR {formatPKR(monthlyFull)}
                          </span>
                        </div>
                      )}
                      {savedAmount > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-teal-500">You save</span>
                          <span className="text-xs text-teal-500 font-semibold">− PKR {formatPKR(savedAmount)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-sm font-bold ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}>Total</span>
                        <span className="text-teal-500 font-bold text-base">PKR {formatPKR(totalPrice)}</span>
                      </div>
                      {form.billingCycle !== "monthly" && (
                        <p className={`text-[10px] text-right ${isDark ? "text-[#444]" : "text-[#ccc]"}`}>
                          PKR {formatPKR(perMonthPrice)}/mo effective
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className={`mt-4 p-3 rounded-xl text-xs text-center font-medium ${
                  isBasicPlan
                    ? isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
                    : isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"
                }`}>
                  {isBasicPlan
                    ? `🎉 ${plans[0]?.trialDays ?? 14}-day free trial — no card needed`
                    : "💳 Payment required to activate"}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── Step 3 — Payment or Trial confirmation ── */}
        {step === 3 && (
          <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">

            {/* Left */}
            <div className={cardCls} style={cardStyle}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/10">
                  {isBasicPlan ? <Shield size={20} className="text-teal-500" /> : <CreditCard size={20} className="text-teal-500" />}
                </div>
                <div>
                  <p className={`font-bold text-base ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}>
                    {isBasicPlan ? "Start Your Free Trial" : "Payment Details"}
                  </p>
                  <p className={`text-xs ${isDark ? "text-[#555]" : "text-[#999]"}`}>
                    {isBasicPlan
                      ? `${plans[0]?.trialDays ?? 14} days free, then PKR ${formatPKR(totalPrice)}/mo`
                      : `PKR ${formatPKR(totalPrice)} due today`}
                  </p>
                </div>
              </div>

              {isBasicPlan ? (
                /* ── Trial confirmation ── */
                <div className="flex flex-col gap-5">
                  <div className={`p-5 rounded-xl border ${isDark ? "bg-teal-500/5 border-teal-500/20" : "bg-teal-50/50 border-teal-200/60"}`}>
                    <p className={`text-sm font-semibold mb-3 ${isDark ? "text-teal-400" : "text-teal-700"}`}>
                      What happens during your trial
                    </p>
                    {[
                      `Full access to all Basic plan features for ${plans[0]?.trialDays ?? 14} days`,
                      "No credit card required to start",
                      "You'll be notified before the trial ends",
                      "Upgrade or pay to continue after the trial",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 mt-2">
                        <CheckCircle size={13} className="text-teal-500 flex-shrink-0 mt-0.5" />
                        <span className={`text-xs ${isDark ? "text-[#666]" : "text-[#777]"}`}>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`p-4 rounded-xl border text-xs ${isDark ? "bg-white/[0.02] border-white/[0.06] text-[#555]" : "bg-black/[0.02] border-black/[0.06] text-[#999]"}`}>
                    After your {plans[0]?.trialDays ?? 14}-day trial, your plan will be{" "}
                    <span className={isDark ? "text-white font-medium" : "text-black font-medium"}>
                      PKR {formatPKR(totalPrice)}/{selectedCycle.label.toLowerCase()}
                    </span>
                    . You can cancel anytime from your dashboard.
                  </div>
                </div>
              ) : (
                /* ── Payment form ── */
                <div className="flex flex-col gap-5">
                  <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${isDark ? "bg-amber-500/5 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                    <Shield size={13} className="flex-shrink-0" />
                    Manual payment — our team will contact you to confirm your subscription.
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className={labelCls}>Full Name on Account</label>
                      <input className={inputCls} placeholder={form.ownerName || "Ahmed Ali"} disabled
                        value={form.ownerName} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Contact Email</label>
                      <input className={inputCls} placeholder={form.email || "ahmed@restaurant.com"} disabled
                        value={form.email} />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input className={inputCls} placeholder={form.phone || "03XX-XXXXXXX"} disabled
                        value={form.phone} />
                    </div>
                    <div>
                      <label className={labelCls}>Amount Due</label>
                      <input className={`${inputCls} font-bold text-teal-500`} disabled
                        value={`PKR ${formatPKR(totalPrice)}`} />
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border text-xs ${isDark ? "bg-white/[0.02] border-white/[0.06] text-[#555]" : "bg-black/[0.02] border-black/[0.06] text-[#999]"}`}>
                    Our team will reach out within 24 hours to process your payment and activate your{" "}
                    <span className={isDark ? "text-white font-medium" : "text-black font-medium"}>
                      {selectedPlan?.displayName} plan
                    </span>.
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)}
                  className={`px-6 py-3.5 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.01] ${isDark ? "border-white/[0.08] text-[#888] hover:text-white hover:bg-white/[0.05]" : "border-black/[0.08] text-[#999] hover:text-black hover:bg-black/[0.04]"}`}>
                  Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {loading ? (
                    <><Loader2 size={15} className="animate-spin" /> Creating account...</>
                  ) : isBasicPlan ? (
                    <><CheckCircle size={15} /> Start free trial</>
                  ) : (
                    <><CheckCircle size={15} /> Submit & await activation</>
                  )}
                </button>
              </div>
            </div>

            {/* Right — order summary (same as step 2) */}
            <div className="flex flex-col gap-4 sticky top-6">
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`} style={cardStyle}>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isDark ? "text-[#444]" : "text-[#bbb]"}`}>
                  Order Summary
                </p>
                {selectedPlan && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-base ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        {selectedPlan.displayName} Plan
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                        {selectedCycle.label}
                      </span>
                    </div>
                    <div className={`w-full h-px ${isDark ? "bg-white/[0.05]" : "bg-teal-50"}`} />
                    {getPlanFeatures(selectedPlan).map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle size={13} className="text-teal-500 flex-shrink-0" />
                        <span className={`text-xs ${isDark ? "text-[#555]" : "text-[#888]"}`}>{f}</span>
                      </div>
                    ))}
                    <div className={`w-full h-px ${isDark ? "bg-white/[0.05]" : "bg-teal-50"}`} />
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-sm font-bold ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}>
                        {isBasicPlan ? "After trial" : "Total due"}
                      </span>
                      <span className="text-teal-500 font-bold text-base">PKR {formatPKR(totalPrice)}</span>
                    </div>
                  </div>
                )}
                <div className={`mt-4 p-3 rounded-xl text-xs text-center font-medium ${
                  isBasicPlan
                    ? isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
                    : isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"
                }`}>
                  {isBasicPlan ? `🎉 ${plans[0]?.trialDays ?? 14}-day free trial` : "💳 Manual payment — 24hr activation"}
                </div>
              </div>

              <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`}>
                {[
                  { emoji: "🔒", text: "Your data is encrypted and safe" },
                  { emoji: "🇵🇰", text: "Built for Pakistani restaurants"  },
                  { emoji: "💬", text: "Email support on all plans"       },
                  { emoji: "❌", text: "Cancel anytime, no penalties"     },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-sm">{b.emoji}</span>
                    <span className={`text-xs ${isDark ? "text-[#555]" : "text-[#888]"}`}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        <p className={`text-xs text-center mt-6 ${isDark ? "text-[#444]" : "text-[#ccc]"}`}>
          Already have an account?{" "}
          <Link href="/signin" className="text-teal-500 hover:text-teal-400 font-medium">Sign in</Link>
        </p>

      </div>
    </div>
  );
}