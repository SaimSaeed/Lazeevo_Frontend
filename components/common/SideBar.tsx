// components/common/Sidebar.tsx
"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/themeContext";
import {
  LayoutDashboard, Users, LogOut,
  ChevronLeft, ChevronRight, Menu, X, Building2
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

// ── Extracted outside — no longer created during render ───────────────────────
interface SidebarContentProps {
  isDark:       boolean;
  collapsed:    boolean;
  setCollapsed: (v: boolean) => void;
  onClose?:     () => void;
  pathname:     string;
  onLogout:     () => void;
  tenant?:      any;
  user?:        any;
}

function SidebarContent({
  isDark, collapsed, setCollapsed, onClose, pathname, onLogout, tenant, user
}: SidebarContentProps) {
  const isSuper = user?.role === 'SUPER_ADMIN' || user?.role?.name === 'SUPER_ADMIN';
  const navItems = [
    { label: "Analytics",       href: "/dashboard",       icon: LayoutDashboard },
    { label: "User Management", href: "/dashboard/user-management", icon: Users },
    ...(isSuper ? [{ label: "Restaurants", href: "/dashboard/restaurants", icon: Building2 }] : []),
  ];

  const itemCls = (href: string) => `
    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
    transition-all duration-150 cursor-pointer w-full
    ${pathname === href
      ? isDark
        ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
        : "bg-teal-50 text-teal-600 border border-teal-200/60"
      : isDark
        ? "text-[#555] hover:text-white hover:bg-white/[0.05] border border-transparent"
        : "text-[#999] hover:text-black hover:bg-black/[0.04] border border-transparent"
    }
  `;

  return (
    <div className={`
      flex flex-col border-r transition-all duration-300 h-screen sticky top-0
      ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-black/[0.07]"}
      ${collapsed ? "w-[68px]" : "w-[220px]"}
    `}>

      {/* ── Logo + collapse toggle ── */}
      <div className={`flex items-center h-16 px-4 border-b flex-shrink-0 ${isDark ? "border-white/[0.07]" : "border-black/[0.07]"}`}>
        {!collapsed && (
          <span
            className={`text-lg font-extrabold tracking-tight flex-1 ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span className="text-teal-500">Laz</span>eevo
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg transition-colors ml-auto hidden md:flex ${isDark ? "text-[#444] hover:text-white hover:bg-white/[0.05]" : "text-[#ccc] hover:text-black hover:bg-black/[0.05]"}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* ── Company Info Section ── */}
      {tenant && (
        <div className={`p-3 flex-shrink-0 border-b ${isDark ? "border-white/[0.07]" : "border-black/[0.07]"}`}>
          <div className="flex items-center gap-3 px-1 py-1 rounded-xl">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-700"
            }`}>
              {tenant?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                  {tenant?.name}
                </span>
                <span className={`text-[10px] uppercase font-semibold tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Workspace
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={itemCls(item.href)}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className={`p-3 border-t flex-shrink-0 ${isDark ? "border-white/[0.07]" : "border-black/[0.07]"}`}>
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all border border-transparent text-left group
            ${isDark
              ? "hover:bg-red-500/[0.08] hover:border-red-500/20"
              : "hover:bg-red-50 hover:border-red-200/60"
            }`}
        >
          {collapsed ? (
            <LogOut size={17} className={`flex-shrink-0 transition-colors ${isDark ? "text-[#555] group-hover:text-red-400" : "text-[#999] group-hover:text-red-500"}`} />
          ) : (
            <>
              <div className={`w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
                ${isDark ? "bg-white/[0.05] text-[#ccc] group-hover:bg-red-500/10 group-hover:text-red-400" : "bg-black/[0.05] text-[#666] group-hover:bg-red-100 group-hover:text-red-600"}`}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              
              <div className="flex flex-col overflow-hidden flex-1">
                <span className={`text-sm font-semibold truncate transition-colors ${isDark ? "text-[#f0f0f4] group-hover:text-red-400" : "text-[#111] group-hover:text-red-600"}`}>
                  {user?.name || "User"}
                </span>
                <span className={`text-[10px] uppercase font-semibold tracking-wider truncate transition-colors ${isDark ? "text-[#555] group-hover:text-red-400/70" : "text-[#999] group-hover:text-red-500/70"}`}>
                  {(typeof user?.role === 'object' ? user?.role?.name : user?.role) || "Role"}
                </span>
              </div>
              
              <LogOut size={16} className={`flex-shrink-0 transition-colors ${isDark ? "text-[#555] group-hover:text-red-400" : "text-[#999] group-hover:text-red-500"}`} />
            </>
          )}
        </button>
      </div>

    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { isDark }                      = useTheme();
  const pathname                        = usePathname();
  const router                          = useRouter();
  const [collapsed,  setCollapsed]      = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [tenant, setTenant]             = useState<any>(null);
  const [user, setUser]                 = useState<any>(null);

  function handleLogout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.clear();
    toast.success("Logged out successfully.");
    router.push("/signin");
  }

  useEffect(() => {
    const t = localStorage.getItem("tenant");
    if (t) {
      try {
        setTenant(JSON.parse(t));
      } catch (e) {}
    }
    const u = localStorage.getItem("user");
    if (u) {
      try {
        const parsedUser = JSON.parse(u);
        const roleName = typeof parsedUser?.role === "object" ? parsedUser?.role?.name : parsedUser?.role;
        if (roleName === "CASHIER" || roleName === "KITCHEN") {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          localStorage.clear();
          router.push("/signin");
          return;
        }
        setUser(parsedUser);
      } catch (e) {}
    }
  }, [router]);

  const sharedProps: SidebarContentProps = {
    isDark,
    collapsed,
    setCollapsed,
    pathname,
    onLogout: handleLogout,
    tenant,
    user,
  };

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <SidebarContent {...sharedProps} />
      </div>

      {/* ── Mobile hamburger ── */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className={`fixed top-4 left-4 z-50 p-2 rounded-xl border transition-all ${isDark ? "bg-[#111113] border-white/[0.07] text-white" : "bg-white border-black/[0.07] text-black"}`}
          style={{ boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.08)" }}
        >
          <Menu size={18} />
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-50 flex">
              <SidebarContent
                {...sharedProps}
                onClose={() => setMobileOpen(false)}
              />
              <button
                onClick={() => setMobileOpen(false)}
                className={`absolute top-4 right-[-40px] p-1.5 rounded-lg ${isDark ? "text-white" : "text-black"}`}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}