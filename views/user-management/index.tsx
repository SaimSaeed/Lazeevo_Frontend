// app/(dashboards)/dashboard/users/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import TabsSwitcher from "@/components/common/TabSwitcher";
import KitchenTable from "./components/KitchenTable";
import CashierTable from "./components/CashierTable";
import AdminTable from "./components/AdminTable";
import { toast } from "sonner";
import { ProtectedAPI } from "@/lib/axios";
import { UserStats } from "./types/userTypes";
import { StatCard } from "@/components/common/StatCard";
import { Spinner } from "@/components/ui/spinner";

export default function UserManagementPage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("cashier");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [admins, setAdmins] = useState<UserStats>();
  const [cashiers, setCashiers] = useState<UserStats>();
  const [kitchen, setKitchen] = useState<UserStats>();
  const [isSuper, setIsSuper] = useState<boolean>(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u?.role === "SUPER_ADMIN" || u?.role?.name === "SUPER_ADMIN") {
          setIsSuper(true);
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, []);

  const TABS = [
    ...(isSuper ? [{ label: "Admins", value: "admin" }] : []),
    { label: "Cashiers", value: "cashier" },
    { label: "Kitchen", value: "kitchen" },
  ];

  const currentRole = activeTab === "admin" ? "ADMIN" : activeTab === "cashier" ? "CASHIER" : "KITCHEN";

  const userStats = [
    ...(isSuper ? [{ label: "Total Admins", value: admins?.total ?? 0 }] : []),
    { label: "Total Cashiers", value: cashiers?.total ?? 0 },
    { label: "Total Kitchen", value: kitchen?.total ?? 0 },
  ];

  useEffect(() => {
    const fetchUsersStats = async () => {
      try {
        setIsLoading(true);
        const res = await ProtectedAPI.get("/user/staff/stats");
        console.log("This is the Stats", res);
        if (res?.data) {
          setAdmins(res.data.admins);
          setCashiers(res.data.cashiers);
          setKitchen(res.data.kitchen);
        }
        setIsLoading(false);
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to load stats.");
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchUsersStats();
  }, []);

  return (
    <div
      className={`min-h-screen w-full  p-6 md:p-8 transition-colors duration-300 ${isDark ? "bg-[#0c0c0e]" : "bg-[#f0fafa]"}`}
    >
      {/* ── Page header ── */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            User Management
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-[#555]" : "text-[#999]"}`}
          >
            {isSuper ? "Manage all restaurant staff and administrators across the platform" : "Manage your cashiers and kitchen staff"}
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      {isLoading ? (
        <div className="flex items-center justify-center w-full mb-8">
          <Spinner className="size-10 text-white" />
        </div>
      ) : (
        <div className={`w-full grid ${isSuper ? "grid-cols-3 md:grid-cols-3" : "grid-cols-2 md:grid-cols-2"} gap-4 mb-8`}>
          {userStats.map((stat, i) => (
            <StatCard
              key={i}
              label={stat.label}
              value={stat.value}
              loading={isLoading}
            />
          ))}
        </div>
      )}

      {/* ── Tab switcher ── */}
      <div className="mb-5">
        <TabsSwitcher
          tabs={TABS}
          defaultValue="cashier"
          value={activeTab}
          onChange={(val) => {
            setActiveTab(val);
          }}
        />
      </div>

      {/* ── Table ── */}
      {activeTab === "admin" && <AdminTable activeTab={currentRole} />}
      {activeTab === "cashier" && <CashierTable activeTab={currentRole} />}
      {activeTab === "kitchen" && <KitchenTable activeTab={currentRole} />}
    </div>
  );
}
