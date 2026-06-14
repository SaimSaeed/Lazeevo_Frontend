"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { ProtectedAPI } from "@/lib/axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Trash, Edit } from "lucide-react";
import TableModal from "./components/TableModal";

export default function TablesView() {
  const { isDark } = useTheme();
  const [tables, setTables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTable, setEditTable] = useState<any>(null);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const res = await ProtectedAPI.get("/table");
      setTables(res.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load tables");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this table?")) return;
    try {
      await ProtectedAPI.delete(`/table/${id}`);
      toast.success("Table deleted successfully");
      fetchTables();
    } catch (error: any) {
      toast.error("Failed to delete table");
    }
  };

  return (
    <div className={`min-h-screen w-full p-6 md:p-8 transition-colors duration-300 ${isDark ? "bg-[#0c0c0e]" : "bg-[#f0fafa]"}`}>
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
            Table Management
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-[#555]" : "text-[#999]"}`}>
            Manage your restaurant tables, seating capacity, and statuses.
          </p>
        </div>
        <button
          onClick={() => { setEditTable(null); setIsModalOpen(true); }}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-sm transition-all duration-200 ${
            isDark ? "bg-teal-500 text-white hover:bg-teal-600 shadow-[0_4px_16px_rgba(20,184,166,0.3)]"
                   : "bg-teal-600 text-white hover:bg-teal-700 shadow-[0_4px_16px_rgba(13,148,136,0.2)]"
          }`}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Table
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-12"><Spinner className="size-10 text-teal-500" /></div>
      ) : tables.length === 0 ? (
        <div className="text-center py-20">
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>No tables found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map(table => (
            <div key={table.id} className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-black/[0.07]"}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{table.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                  {table.status}
                </span>
              </div>
              <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Seats: {table.seats}</p>
              <div className="flex gap-2">
                <button onClick={() => { setEditTable(table); setIsModalOpen(true); }} className="flex-1 py-2 flex items-center justify-center gap-2 rounded-lg bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 text-sm font-semibold">
                  <Edit size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(table.id)} className="flex-1 py-2 flex items-center justify-center gap-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-semibold">
                  <Trash size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <TableModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          table={editTable}
          onSuccess={() => { setIsModalOpen(false); fetchTables(); }}
        />
      )}
    </div>
  );
}
