import { ProtectedAPI } from "@/lib/axios";
import { Loader2, Store, StoreIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RestaurantTenant } from "../types";

interface Props {
  isDark: boolean;
  restaurant: RestaurantTenant;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ToggleRestaurantModal({ isDark, restaurant, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const isActivating = !restaurant.isActive;

  async function handleToggle() {
    setLoading(true);
    try {
      await ProtectedAPI.put(`/tenant/${restaurant.id}/toggle`);
      toast.success(
        `${restaurant.name} has been ${isActivating ? "activated" : "deactivated"}.`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to toggle restaurant status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-sm rounded-2xl border p-8 flex flex-col gap-6 ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : isActivating
            ? "bg-white border-teal-100"
            : "bg-white border-red-100"
        }`}
        style={{
          boxShadow: isDark
            ? "0 2px 40px rgba(0,0,0,0.6)"
            : isActivating
            ? "0 2px 24px rgba(13,148,136,0.12)"
            : "0 2px 24px rgba(239,68,68,0.1)",
        }}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
            isDark
              ? "text-[#555] hover:text-white hover:bg-white/[0.05]"
              : "text-[#ccc] hover:text-black hover:bg-black/[0.05]"
          }`}
        >
          <X size={16} />
        </button>

        <div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
              isActivating
                ? "bg-teal-500/10 text-teal-500"
                : "bg-red-500/10 text-red-500 animate-pulse"
            }`}
          >
            <Store size={18} />
          </div>
          <h2
            className={`text-lg font-extrabold tracking-tight ${
              isDark ? "text-[#f0f0f4]" : "text-[#111]"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {isActivating ? "Activate" : "Deactivate"} Restaurant
          </h2>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              isDark ? "text-[#555]" : "text-[#999]"
            }`}
          >
            Are you sure you want to {isActivating ? "activate" : "deactivate"}{" "}
            <span
              className={`font-semibold ${isDark ? "text-white" : "text-black"}`}
            >
              {restaurant.name}
            </span>
            ?{" "}
            {isActivating
              ? "All staff and administrators will immediately regain access to their accounts."
              : "All staff, cashiers, and administrators connected to this restaurant will immediately lose access to their accounts and POS systems."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.01] ${
              isDark
                ? "border-white/[0.08] text-[#888] hover:text-white hover:bg-white/[0.05]"
                : "border-black/[0.08] text-[#999] hover:text-black hover:bg-black/[0.04]"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg ${
              isActivating
                ? "bg-teal-600 hover:bg-teal-700 shadow-teal-500/20"
                : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />{" "}
                {isActivating ? "Activating..." : "Deactivating..."}
              </>
            ) : (
              <>
                <Store size={14} /> {isActivating ? "Activate" : "Deactivate"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
