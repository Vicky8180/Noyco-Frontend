
// frontend/src/app/dashboard/assistant/layout.js
"use client";

import { Inter } from 'next/font/google'
import ProtectedRoute from "@/components/ProtectedRoute";
import SocketProvider from './components/SocketProvider'
import GlobalCallHandler from './components/GlobalCallHandler'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from 'react';

const inter = Inter({ subsets: ['latin'] });

// Create context for sub-navigation
const SubNavContext = createContext();

export const useSubNav = () => {
  const context = useContext(SubNavContext);
  if (!context) {
    throw new Error('useSubNav must be used within SubNavProvider');
  }
  return context;
};

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard/assistant",
    icon: "📊",
    subItems: []
  },
  {
    name: "History",
    href: "/dashboard/assistant/history",
    icon: "🕑",
    subItems: []
  },
  {
    name: "Workspace",
    href: "/dashboard/assistant/workspace",
    icon: "🛠️",
    subItems: []
  },
  {
    name: "Knowledge Base",
    href: "/dashboard/assistant/knowledge-base",
    icon: "📚",
    subItems: []
  },
  {
    name: "Schedule",
    href: "/dashboard/assistant/schedule",
    icon: "🕑",
    subItems: [
      { name: "Track", key: "track", icon: "📍" },
      { name: "Schedule", key: "schedule", icon: "📅" },
      { name: "Custom", key: "custom", icon: "⚙️" }
    ]
  },
];

export default function AssistantLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSubItem, setActiveSubItem] = useState("track");
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Find current nav item
  const currentNavItem = navItems.find(item => pathname === item.href);

  // Auto-expand items that have sub-items and are currently active
  useEffect(() => {
    if (currentNavItem && currentNavItem.subItems.length > 0) {
      setExpandedItems(prev => new Set([...prev, currentNavItem.href]));
      // Set default sub-item for schedule page
      if (pathname === "/dashboard/assistant/schedule" && !activeSubItem) {
        setActiveSubItem("track");
      }
    }
  }, [pathname, currentNavItem]);

  const toggleExpanded = (href) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(href)) {
        newSet.delete(href);
      } else {
        newSet.add(href);
      }
      return newSet;
    });
  };

  const handleSubItemClick = (subItemKey, parentHref) => {
    // If we're not on the parent page, navigate to it first
    if (pathname !== parentHref) {
      router.push(parentHref);
    }
    setActiveSubItem(subItemKey);
  };

  return (
    <SocketProvider>
      <ProtectedRoute allowedRoles={["assistant", "hospital", "admin"]}>
        <SubNavContext.Provider value={{ activeSubItem, setActiveSubItem: (key) => handleSubItemClick(key, "/dashboard/assistant/schedule") }}>
          <div className={`flex h-screen bg-gray-50 ${inter.className}`}>
            {/* Sidebar */}
            <aside className="w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-sm">
              <div className="px-6 py-8 border-b border-gray-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">A</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                      Assistant Center
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">Virtual Agent</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const isExpanded = expandedItems.has(item.href);
                    const hasSubItems = item.subItems.length > 0;

                    return (
                      <div key={item.href} className="space-y-1">
                        {/* Main Navigation Item */}
                        <div className="flex items-center">
                          <Link
                            href={item.href}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out flex-1 ${isActive
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                                : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                              }`}
                          >
                            <span
                              className={`text-base transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"
                                }`}
                            >
                              {item.icon}
                            </span>
                            <span className="tracking-tight">{item.name}</span>
                          </Link>

                          {/* Expand/Collapse Button for items with sub-items */}
                          {hasSubItems && (
                            <button
                              onClick={() => toggleExpanded(item.href)}
                              className={`ml-2 p-1.5 rounded-md transition-all duration-200 ${isActive
                                  ? "text-white/70 hover:text-white hover:bg-white/10"
                                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                              <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""
                                  }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Sub-navigation Items */}
                        {hasSubItems && (
                          <div
                            className={`ml-6 space-y-1 transition-all duration-300 ease-out overflow-hidden ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                              }`}
                          >
                            {item.subItems.map((subItem) => {
                              const isSubActive = activeSubItem === subItem.key && isActive;
                              return (
                                <button
                                  key={subItem.key}
                                  onClick={() => handleSubItemClick(subItem.key, item.href)}
                                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out w-full text-left ${isSubActive
                                      ? "bg-blue-50 text-blue-700 border-l-2 border-blue-400 shadow-sm"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                    }`}
                                >
                                  <span
                                    className={`text-sm transition-transform duration-200 ${isSubActive ? "scale-110" : "group-hover:scale-105"
                                      }`}
                                  >
                                    {subItem.icon}
                                  </span>
                                  <span className="tracking-tight">{subItem.name}</span>
                                  {isSubActive && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </nav>

              <div className="px-6 py-4 border-t border-gray-100/80">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">System Online</span>
                </div>
              </div>
            </aside>

            <main className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <div className="min-h-full bg-gradient-to-br from-gray-50 to-white p-8">
                  <div className="max-w-7xl mx-auto">
                    {children}
                  </div>
                </div>
              </div>
            </main>

            {/* Global Call Handler - handles calls across all assistant pages */}
            <GlobalCallHandler />
          </div>
        </SubNavContext.Provider>
      </ProtectedRoute>
    </SocketProvider>
  );
}
