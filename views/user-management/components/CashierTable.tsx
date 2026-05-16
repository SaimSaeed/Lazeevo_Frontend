import DynamicTable from "@/components/common/DynamicTable";
import React, { useEffect, useState, useCallback } from "react";
import { StaffUser } from "../types/userTypes";
import { useTheme } from "@/context/themeContext";
import { toast } from "sonner";
import { ProtectedAPI } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Search, X, UserX, UserCheck } from "lucide-react";
import AddUserModal from "./AddUserModal";
import DeactivateUserModal from "./DeactivateUserModal";
import ActivateUserModal from "./ActivateUserModal";

function CashierTable({ activeTab }: { activeTab?: string }) {
  const { isDark } = useTheme();

  // ── State ────────────────────────────────────────────────────────────────
  const [data,         setData]         = useState<StaffUser[]>([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [loading,          setLoading]          = useState(true);
  const [showAdd,          setShowAdd]          = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<StaffUser | null>(null);
  const [activateTarget,   setActivateTarget]   = useState<StaffUser | null>(null);
  const [searchOpen,       setSearchOpen]       = useState(false);
  const [searchInput,      setSearchInput]      = useState("");
  const [searchTerm,       setSearchTerm]       = useState("");  // debounced
  const [isSuper,          setIsSuper]          = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u?.role === "SUPER_ADMIN" || u?.role?.name === "SUPER_ADMIN") {
          setIsSuper(true);
        }
      } catch (e) {}
    }
  }, []);

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
    ...(isSuper ? [{
      key: "tenant",
      label: "Restaurant",
      render: (_: string, row: StaffUser) => (
        <span className={`text-xs font-semibold ${isDark ? "text-teal-400" : "text-teal-700"}`}>
          {row.tenant?.name ?? "System"}
        </span>
      ),
    }] : []),
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
        <div className="flex items-center gap-1">
          {row.isActive ? (
            <button
              title="Deactivate User"
              onClick={(e) => { e.stopPropagation(); setDeactivateTarget(row); }}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-[#444] hover:text-amber-400 hover:bg-amber-500/10" : "text-[#ccc] hover:text-amber-600 hover:bg-amber-50"}`}
            >
              <UserX size={15} />
            </button>
          ) : (
            <button
              title="Activate User"
              onClick={(e) => { e.stopPropagation(); setActivateTarget(row); }}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-[#444] hover:text-teal-400 hover:bg-teal-500/10" : "text-[#ccc] hover:text-teal-600 hover:bg-teal-50"}`}
            >
              <UserCheck size={15} />
            </button>
          )}
        </div>
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

      {!isSuper && (
        <Button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.01]"
        >
          <Plus size={15} />
          Add Cashier
        </Button>
      )}
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

      {deactivateTarget && (
        <DeactivateUserModal
          isDark={isDark}
          user={deactivateTarget}
          onClose={() => setDeactivateTarget(null)}
          onSuccess={fetchStaff}
        />
      )}

      {activateTarget && (
        <ActivateUserModal
          isDark={isDark}
          user={activateTarget}
          onClose={() => setActivateTarget(null)}
          onSuccess={fetchStaff}
        />
      )}
    </>
  );
}

export default CashierTable;