import { useState, useEffect } from "react";
import { Category } from "../types/menuTypes";
import { ProtectedAPI } from "@/lib/axios";
import { toast } from "sonner";
import { useTheme } from "@/context/themeContext";
import { Loader2, X } from "lucide-react";
import { EmojiSelector } from "@/components/common/EmojiSelector";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess: () => void;
}

export const CategoryModal = ({ open, onOpenChange, category, onSuccess }: CategoryModalProps) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    emoji: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        code: category.code || "",
        emoji: category.emoji || "",
        description: category.description || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        emoji: "",
        description: "",
      });
    }
  }, [category, open]);

  const handleSubmit = async () => {
    try {
      if (!formData.name) return toast.error("Name is required");
      setLoading(true);

      const payload = {
        ...formData,
      };

      if (category) {
        await ProtectedAPI.put(`/menu/categories/${category.id}`, payload);
        toast.success("Category updated successfully");
      } else {
        await ProtectedAPI.post("/menu/categories", payload);
        toast.success("Category created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${
    isDark
      ? "bg-[#0c0c0e] border-white/[0.08] text-white placeholder-[#444] focus:border-teal-500/50 focus:ring-teal-500/10"
      : "bg-white border-black/[0.08] text-[#111] placeholder-[#bbb] focus:border-teal-400/60 focus:ring-teal-400/10"
  }`;
  const labelCls = `text-xs font-medium mb-1.5 block ${isDark ? "text-[#555]" : "text-[#999]"}`;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${isDark ? 'dark text-white' : 'text-black'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
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
          onClick={() => onOpenChange(false)}
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
            {category ? "Edit Category" : "Add Category"}
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-[#555]" : "text-[#999]"}`}>
            Manage your menu categories here.
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div>
              <label className={labelCls}>Emoji</label>
              <EmojiSelector value={formData.emoji} onChange={(val) => setFormData({ ...formData, emoji: val })} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Name *</label>
              <input
                className={inputCls}
                placeholder="e.g. Beverages"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Code (Optional)</label>
            <input
              className={inputCls}
              placeholder="e.g. BEV"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>

          <div>
            <label className={labelCls}>Description (Optional)</label>
            <input
              className={inputCls}
              placeholder="Brief description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className={`px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.01] ${isDark ? "border-white/[0.08] text-[#888] hover:text-white hover:bg-white/[0.05]" : "border-black/[0.08] text-[#999] hover:text-black hover:bg-black/[0.04]"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving...
              </>
            ) : (
              "Save Category"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
