"use client";
import { useTheme } from "@/context/themeContext";
import RestaurantTable from "./components/RestaurantTable";

export default function RestaurantManagementPage() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen w-full p-6 md:p-8 transition-colors duration-300 ${
        isDark ? "bg-[#0c0c0e]" : "bg-[#f0fafa]"
      }`}
    >
      {/* ── Page header ── */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
              isDark ? "text-[#f0f0f4]" : "text-[#111]"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Restaurant Management
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-[#555]" : "text-[#999]"}`}>
            Platform-wide management of tenant workspaces, subscriptions, and active status
          </p>
        </div>
      </div>

      {/* ── Table ── */}
      <RestaurantTable />
    </div>
  );
}
