import DynamicTable from "@/components/common/DynamicTable";
import React, { useEffect, useState, useCallback } from "react";
import { StaffUser } from "../types/userTypes";
import { useTheme } from "@/context/themeContext";
import { toast } from "sonner";
import { ProtectedAPI } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, X } from "lucide-react";
import AddUserModal from "./AddUserModal";
import DeleteUserModal from "./DeleteUserModal";

function CashierTable({ activeTab }: { activeTab?: string }) {
  const { isDark } = useTheme();

  // ── State ────────────────────────────────────────────────────────────────
  const [data,         setData]         = useState<StaffUser[]>([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [loading,      setLoading]      = useState(true);
  const [showAdd,      setShowAdd]      = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StaffUser | null>(null);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchInput,  setSearchInput]  = useState("");
  const [searchTerm,   setSearchTerm]   = useState("");  // debounced

  // ── Debounce search input ─────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        role:     "CASHIER",
        page,
        pageSize,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await ProtectedAPI.get("/user/staff", { params });
      const { data: staff, total: count } = res.data as {
        data:       StaffUser[];
        total:      number;
        page:       number;
        pageSize:   number;
        totalPages: number;
      };

      setData(staff);
      setTotal(count);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load cashiers.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, activeTab]);

  // ── Clear search ──────────────────────────────────────────────────────────
  function handleClearSearch() {
    setSearchInput("");
    setSearchTerm("");
    setSearchOpen(false);
    setPage(1);
  }

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    { key: "name",  label: "Name"  },
    { key: "email", label: "Email" },
    {
      key:    "isActive",
      label:  "Status",
      render: (_: string, row: StaffUser) => (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          row.isActive
            ? isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
            : isDark ? "bg-white/[0.05] text-[#555]"  : "bg-black/[0.05] text-[#999]"
        }`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key:    "createdAt",
      label:  "Created At",
      render: (_: string, row: StaffUser) => (
        <span className={`text-xs ${isDark ? "text-[#555]" : "text-[#999]"}`}>
          {new Date(row.createdAt).toLocaleDateString("en-PK", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>
      ),
    },
    {
      key:    "actions",
      label:  "Actions",
      render: (_: string, row: StaffUser) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
          className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-[#444] hover:text-red-400 hover:bg-red-500/10" : "text-[#ccc] hover:text-red-500 hover:bg-red-50"}`}
        >
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  // ── Header actions ────────────────────────────────────────────────────────
  const headerActions = (
    <div className="flex items-center gap-2">

      {/* Search bar — expands on click */}
      <div className={`flex items-center gap-2 transition-all duration-200 overflow-hidden rounded-xl border ${
        searchOpen
          ? isDark ? "bg-[#0c0c0e] border-teal-500/40 w-52" : "bg-white border-teal-400/60 w-52"
          : "border-transparent w-8"
      }`}>
        <button
          onClick={() => { setSearchOpen((p) => !p); if (searchOpen) handleClearSearch(); }}
          className={`p-1.5 flex-shrink-0 transition-colors ${
            searchOpen
              ? "text-teal-500"
              : isDark ? "text-[#555] hover:text-white" : "text-[#bbb] hover:text-black"
          }`}
        >
          <Search size={15} />
        </button>

        {searchOpen && (
          <>
            <input
              autoFocus
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search cashiers..."
              className={`flex-1 text-xs outline-none bg-transparent ${
                isDark ? "text-white placeholder-[#444]" : "text-[#111] placeholder-[#bbb]"
              }`}
            />
            {searchInput && (
              <button onClick={handleClearSearch}
                className={`p-1.5 flex-shrink-0 ${isDark ? "text-[#444] hover:text-white" : "text-[#bbb] hover:text-black"}`}>
                <X size={13} />
              </button>
            )}
          </>
        )}
      </div>

      <Button
        onClick={() => setShowAdd(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.01]"
      >
        <Plus size={15} />
        Add Cashier
      </Button>
    </div>
  );

  return (
    <>
      <DynamicTable
        title="Cashiers"
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        headerActions={headerActions}
      />

      {showAdd && (
        <AddUserModal
          isDark={isDark}
          role="CASHIER"
          onClose={() => setShowAdd(false)}
          onSuccess={fetchStaff}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          isDark={isDark}
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchStaff}
        />
      )}
    </>
  );
}

export default CashierTable;