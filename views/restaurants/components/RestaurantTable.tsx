import DynamicTable from "@/components/common/DynamicTable";
import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/context/themeContext";
import { toast } from "sonner";
import { ProtectedAPI } from "@/lib/axios";
import { Search, X, Store, CheckCircle, AlertOctagon } from "lucide-react";
import { RestaurantTenant } from "../types";
import ToggleRestaurantModal from "./ToggleRestaurantModal";
import { StatCard } from "@/components/common/StatCard";

export default function RestaurantTable() {
  const { isDark } = useTheme();

  // ── State ────────────────────────────────────────────────────────────────
  const [data, setData] = useState<RestaurantTenant[]>([]);
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [toggleTarget, setToggleTarget] = useState<RestaurantTenant | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // debounced

  // ── Debounce search input ─────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        pageSize,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await ProtectedAPI.get("/tenant/list", { params });
      const { data: list, total: count, activeCount: ac, inactiveCount: ic } = res.data as {
        data: RestaurantTenant[];
        total: number;
        activeCount: number;
        inactiveCount: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };

      setData(list);
      setTotal(count);
      setActiveCount(ac ?? 0);
      setInactiveCount(ic ?? 0);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // ── Clear search ──────────────────────────────────────────────────────────
  function handleClearSearch() {
    setSearchInput("");
    setSearchTerm("");
    setSearchOpen(false);
    setPage(1);
  }

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    {
      key: "name",
      label: "Restaurant Name",
      render: (_: string, row: RestaurantTenant) => (
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
              isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-700"
            }`}
          >
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-xs">{row.name}</div>
            <div className={`text-[10px] ${isDark ? "text-[#555]" : "text-[#999]"}`}>
              slug: {row.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      label: "Owner Info",
      render: (_: string, row: RestaurantTenant) => (
        <div>
          <div className="font-semibold text-xs">{row.ownerName}</div>
          <div className={`text-[10px] ${isDark ? "text-[#555]" : "text-[#999]"}`}>
            {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: "city",
      label: "City",
      render: (_: string, row: RestaurantTenant) => (
        <span className="text-xs font-medium">{row.city}</span>
      ),
    },
    {
      key: "plan",
      label: "Plan & Billing",
      render: (_: string, row: RestaurantTenant) => (
        <div>
          <span className={`text-xs font-semibold ${isDark ? "text-teal-400" : "text-teal-700"}`}>
            {row.plan}
          </span>
          <span className={`text-[10px] uppercase block ${isDark ? "text-[#555]" : "text-[#999]"}`}>
            {row.billingCycle.replace("_", " ")}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_: string, row: RestaurantTenant) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            row.isActive
              ? isDark
                ? "bg-teal-500/10 text-teal-400"
                : "bg-teal-50 text-teal-600"
              : isDark
              ? "bg-red-500/10 text-red-400"
              : "bg-red-50 text-red-600"
          }`}
        >
          {row.isActive ? "Active" : "Deactivated"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Registered",
      render: (_: string, row: RestaurantTenant) => (
        <span className={`text-xs ${isDark ? "text-[#555]" : "text-[#999]"}`}>
          {new Date(row.createdAt).toLocaleDateString("en-PK", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: string, row: RestaurantTenant) => (
        <div className="flex items-center gap-1">
          {row.isActive ? (
            <button
              title="Deactivate Restaurant"
              onClick={(e) => {
                e.stopPropagation();
                setToggleTarget(row);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark
                  ? "text-[#444] hover:text-red-400 hover:bg-red-500/10"
                  : "text-[#ccc] hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <AlertOctagon size={15} />
            </button>
          ) : (
            <button
              title="Activate Restaurant"
              onClick={(e) => {
                e.stopPropagation();
                setToggleTarget(row);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark
                  ? "text-[#444] hover:text-teal-400 hover:bg-teal-500/10"
                  : "text-[#ccc] hover:text-teal-600 hover:bg-teal-50"
              }`}
            >
              <CheckCircle size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  // ── Header actions ────────────────────────────────────────────────────────
  const headerActions = (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 transition-all duration-200 overflow-hidden rounded-xl border ${
          searchOpen
            ? isDark
              ? "bg-[#0c0c0e] border-teal-500/40 w-52"
              : "bg-white border-teal-400/60 w-52"
            : "border-transparent w-8"
        }`}
      >
        <button
          onClick={() => {
            setSearchOpen((p) => !p);
            if (searchOpen) handleClearSearch();
          }}
          className={`p-1.5 flex-shrink-0 transition-colors ${
            searchOpen
              ? "text-teal-500"
              : isDark
              ? "text-[#555] hover:text-white"
              : "text-[#bbb] hover:text-black"
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
              placeholder="Search restaurants..."
              className={`flex-1 text-xs outline-none bg-transparent ${
                isDark ? "text-white placeholder-[#444]" : "text-[#111] placeholder-[#bbb]"
              }`}
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className={`p-1.5 flex-shrink-0 ${
                  isDark ? "text-[#444] hover:text-white" : "text-[#bbb] hover:text-black"
                }`}
              >
                <X size={13} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Stats row ── */}
      <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
        <StatCard label="Active Restaurants" value={activeCount} loading={loading} />
        <StatCard label="Inactive Restaurants" value={inactiveCount} loading={loading} />
      </div>

      <DynamicTable
        title="Restaurants"
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        headerActions={headerActions}
      />

      {toggleTarget && (
        <ToggleRestaurantModal
          isDark={isDark}
          restaurant={toggleTarget}
          onClose={() => setToggleTarget(null)}
          onSuccess={fetchRestaurants}
        />
      )}
    </>
  );
}
