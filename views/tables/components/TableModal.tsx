import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ProtectedAPI } from "@/lib/axios";
import { useTheme } from "@/context/themeContext";

export default function TableModal({ isOpen, onClose, table, onSuccess }: any) {
  const { isDark } = useTheme();
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(4);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (table) {
      setName(table.name);
      setSeats(table.seats);
    } else {
      setName("");
      setSeats(4);
    }
  }, [table]);

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (table) {
        await ProtectedAPI.put(`/table/${table.id}`, { name, seats: Number(seats) });
        toast.success("Table updated");
      } else {
        await ProtectedAPI.post("/table", { name, seats: Number(seats), status: "available", isActive: true });
        toast.success("Table created");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save table");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl p-6 ${isDark ? "bg-[#111113] border border-white/[0.1]" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>{table ? "Edit Table" : "Add Table"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Table Name/Number</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Table 4" className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? "bg-[#1a1a1f] border-white/10 text-white" : "bg-white border-gray-200 text-black"}`} />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Seats</label>
            <input required type="number" min="1" value={seats} onChange={e => setSeats(Number(e.target.value))} className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? "bg-[#1a1a1f] border-white/10 text-white" : "bg-white border-gray-200 text-black"}`} />
          </div>
          <button disabled={loading} type="submit" className={`mt-2 w-full py-2.5 rounded-xl font-bold text-white transition-all ${isDark ? "bg-teal-500 hover:bg-teal-600" : "bg-teal-600 hover:bg-teal-700"} ${loading ? "opacity-50" : ""}`}>
            {loading ? "Saving..." : table ? "Update Table" : "Create Table"}
          </button>
        </form>
      </div>
    </div>
  );
}
