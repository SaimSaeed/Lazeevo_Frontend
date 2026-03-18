import { ProtectedAPI } from "@/lib/axios";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteModalProps } from "../types/userTypes";

export default function DeleteUserModal({ isDark, user, onClose, onSuccess }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await ProtectedAPI.delete(`/users/staff/${user.id}`);
      toast.success(`${user.name} removed successfully.`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-sm rounded-2xl border p-8 flex flex-col gap-6 ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-red-100"}`}
        style={{
          boxShadow: isDark
            ? "0 2px 40px rgba(0,0,0,0.6)"
            : "0 2px 24px rgba(239,68,68,0.1)",
        }}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${isDark ? "text-[#555] hover:text-white hover:bg-white/[0.05]" : "text-[#ccc] hover:text-black hover:bg-black/[0.05]"}`}
        >
          <X size={16} />
        </button>

        <div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <h2
            className={`text-lg font-extrabold tracking-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Remove User
          </h2>
          <p
            className={`text-xs mt-1 ${isDark ? "text-[#555]" : "text-[#999]"}`}
          >
            Are you sure you want to remove{" "}
            <span
              className={`font-semibold ${isDark ? "text-white" : "text-black"}`}
            >
              {user.name}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.01] ${isDark ? "border-white/[0.08] text-[#888] hover:text-white hover:bg-white/[0.05]" : "border-black/[0.08] text-[#999] hover:text-black hover:bg-black/[0.04]"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Removing...
              </>
            ) : (
              <>
                <Trash2 size={14} /> Remove
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}