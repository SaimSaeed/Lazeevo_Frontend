import { useState } from "react";
import { AddUserModalProps } from "../types/userTypes";
import { toast } from "sonner";
import { ProtectedAPI } from "@/lib/axios";
import { Eye, EyeOff, Loader2, Lock, Mail, Plus, User, X } from "lucide-react";

export default function AddUserModal({
  isDark,
  role,
  onClose,
  onSuccess,
}: AddUserModalProps) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleAdd() {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      toast.error(
        "Please fill all fields. Password must be at least 6 characters.",
      );
      return;
    }
    setLoading(true);
    try {
      await ProtectedAPI.post("/user/staff", { ...form, role });
      toast.success(
        `${role === "CASHIER" ? "Cashier" : "Kitchen staff"} added successfully.`,
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to add user.");
    } finally {
      setLoading(false);
    }
  }
  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${
    isDark
      ? "bg-[#0c0c0e] border-white/[0.08] text-white placeholder-[#444] focus:border-teal-500/50 focus:ring-teal-500/10"
      : "bg-white border-black/[0.08] text-[#111] placeholder-[#bbb] focus:border-teal-400/60 focus:ring-teal-400/10"
  }`;
  const labelCls = `text-xs font-medium mb-1.5 block ${isDark ? "text-[#555]" : "text-[#999]"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl border p-8 flex flex-col gap-6 ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`}
        style={{
          boxShadow: isDark
            ? "0 2px 40px rgba(0,0,0,0.6)"
            : "0 2px 24px rgba(13,148,136,0.12)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${isDark ? "text-[#555] hover:text-white hover:bg-white/[0.05]" : "text-[#ccc] hover:text-black hover:bg-black/[0.05]"}`}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div>
          <h2
            className={`text-lg font-extrabold tracking-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Add {role === "CASHIER" ? "Cashier" : "Kitchen Staff"}
          </h2>
          <p
            className={`text-xs mt-1 ${isDark ? "text-[#555]" : "text-[#999]"}`}
          >
            This user will be able to log in to the POS terminal.
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Full Name *</label>
            <div className="relative">
              <User
                size={15}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`}
              />
              <input
                className={`${inputCls} pl-10`}
                placeholder="Ahmed Ali"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Email Address *</label>
            <div className="relative">
              <Mail
                size={15}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`}
              />
              <input
                className={`${inputCls} pl-10`}
                type="email"
                placeholder="ahmed@restaurant.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>
              Password *{" "}
              <span
                className={`font-normal ${isDark ? "text-[#444]" : "text-[#ccc]"}`}
              >
                (min 6)
              </span>
            </label>
            <div className="relative">
              <Lock
                size={15}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444]" : "text-[#ccc]"}`}
              />
              <input
                className={`${inputCls} pl-10 pr-10`}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-[#444] hover:text-white" : "text-[#ccc] hover:text-black"}`}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.01] ${isDark ? "border-white/[0.08] text-[#888] hover:text-white hover:bg-white/[0.05]" : "border-black/[0.08] text-[#999] hover:text-black hover:bg-black/[0.04]"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus size={14} /> Add User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
