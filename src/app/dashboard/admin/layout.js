"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation items for the platform administrator
const navItems = [
  { name: "Dashboard", href: "/dashboard/admin", icon: "📊" },
  { name: "Hospitals", href: "/dashboard/admin/hospitals", icon: "🏥" },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
  { name: "Billing", href: "/dashboard/admin/billing", icon: "💳" },
  { name: "Reports", href: "/dashboard/admin/reports", icon: "📑" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

    return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Sidebar - positioned below navbar */}
        <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col z-10">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-100/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
        <div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Admin Center</h2>
                <p className="text-xs text-gray-500 font-medium">Platform Control</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                      isActive
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                        : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={`text-base transition-transform duration-200 ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="tracking-tight">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1 h-1 bg-white/60 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
                </nav>
        </aside>

        {/* Main Content - with left margin to account for fixed sidebar and minimal top padding */}
        <main className="ml-72 pt-2 min-h-screen">
          <div className="bg-gradient-to-br from-gray-50 to-white p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
        </div>
        </ProtectedRoute>
  );
  }
