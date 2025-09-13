// "use client";

// import ProtectedRoute from "@/components/ProtectedRoute";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const navItems = [
//   { name: "Dashboard", href: "/dashboard/hospital", icon: "📊" },
//   { name: "Account", href: "/dashboard/hospital/account", icon: "👤" },
//   { name: "Analytics", href: "/dashboard/hospital/analytics", icon: "📈" },
//   { name: "Communication", href: "/dashboard/hospital/communication", icon: "💬" },
//   { name: "dataEHR", href: "/dashboard/hospital/dataEHR", icon: "🗂️" },
//   { name: "Staff", href: "/dashboard/hospital/staff", icon: "👥" },
// ];

// export default function HospitalLayout({ children }) {
//   const pathname = usePathname();

//   return (
//     <ProtectedRoute allowedRoles={["hospital", "admin"]}>
//       <div className="min-h-screen bg-gray-50">
//         {/* Fixed Sidebar - positioned below navbar */}
//         <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col z-10">
//           {/* Header */}
//           <div className="px-6 py-8 border-b border-gray-100/80">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white text-sm font-semibold">H</span>
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
//                   Hospital Control
//                 </h2>
//                 <p className="text-xs text-gray-500 font-medium">Management System</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-4 py-6 overflow-y-auto">
//             <div className="space-y-1">
//               {navItems.map((item) => {
//                 const isActive = pathname === item.href;
//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
//                       isActive
//                         ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
//                         : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
//                     }`}
//                   >
//                     <span className={`text-base transition-transform duration-200 ${
//                       isActive ? "scale-110" : "group-hover:scale-105"
//                     }`}>
//                       {item.icon}
//                     </span>
//                     <span className="tracking-tight">{item.name}</span>
//                     {isActive && (
//                       <div className="ml-auto w-1 h-1 bg-white/60 rounded-full"></div>
//                     )}
//                   </Link>
//                 );
//               })}
//             </div>
//           </nav>
//         </aside>

//         {/* Main Content - with left margin to account for fixed sidebar and minimal top padding */}
//         <main className="ml-72 pt-0 min-h-screen">
//           <div className="bg-gradient-to-br from-gray-50 to-white p-8">
//             <div className="max-w-7xl mx-auto">
//               {children}
//             </div>
//           </div>
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }

"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

// Sub-navigation context
const SubNavContext = createContext();

export const useSubNav = () => {
  const context = useContext(SubNavContext);
  if (!context) {
    throw new Error('useSubNav must be used within a SubNavProvider');
  }
  return context;
};

const navItems = [
  { name: "Dashboard", href: "/dashboard/hospital", icon: "📊" },
  { name: "Account", href: "/dashboard/hospital/account", icon: "👤" },
  { name: "Analytics", href: "/dashboard/hospital/analytics", icon: "📈" },
  { name: "Communication", href: "/dashboard/hospital/communication", icon: "💬" },
  { name: "dataEHR", href: "/dashboard/hospital/dataEHR", icon: "🗂️", hasSubNav: true },
  { name: "Staff", href: "/dashboard/hospital/staff", icon: "👥" },
  {name: "iframe" , href: "/dashboard/hospital/iframe", icon: "👥"},
];

// Sub-navigation items for dataEHR
const dataEHRSubNavItems = [
  { key: "upload", label: "Upload Data", icon: "📤" },
  { key: "view", label: "View Records", icon: "👁️" },
    { key: "ehr", label: "Connect EHR", icon: "📊" },
];

export default function HospitalLayout({ children }) {
  const pathname = usePathname();
  const [activeSubItem, setActiveSubItem] = useState("upload");
  const [expandedItems, setExpandedItems] = useState({});

  // Check if we're on the dataEHR page
  const isDataEHRPage = pathname === "/dashboard/hospital/dataEHR";

  // Auto-expand dataEHR when on that page
  useEffect(() => {
    if (isDataEHRPage) {
      setExpandedItems(prev => ({ ...prev, dataEHR: true }));
    } else {
      setActiveSubItem("upload");
      // Don't auto-collapse, let user control it
    }
  }, [isDataEHRPage]);

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <ProtectedRoute allowedRoles={["hospital", "admin"]}>
      <SubNavContext.Provider value={{ activeSubItem, setActiveSubItem }}>
        <div className="min-h-screen bg-gray-50">
          {/* Fixed Sidebar - positioned below navbar */}
          <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col z-10">
            {/* Header */}
            <div className="px-6 py-8 border-b border-gray-100/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">H</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                    Hospital Control
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Management System</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const isExpanded = expandedItems[item.name];
                  
                  return (
                    <div key={item.href}>
                      {/* Main Navigation Item */}
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out flex-1 ${
                            isActive
                              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                              : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                          }`}
                        >
                          <span className={`text-base transition-transform duration-200 ${
                            isActive ? "scale-110" : "group-hover:scale-105"
                          }`}>
                            {item.icon}
                          </span>
                          <span className="tracking-tight">{item.name}</span>
                          {isActive && (
                            <div className="ml-auto w-1 h-1 bg-white/60 rounded-full"></div>
                          )}
                        </Link>
                        
                        {/* Dropdown Arrow for items with sub-navigation */}
                        {item.hasSubNav && (
                          <button
                            onClick={() => toggleExpanded(item.name)}
                            className={`ml-2 p-1 rounded-md transition-all duration-200 ${
                              isActive 
                                ? "text-white/80 hover:text-white hover:bg-white/10" 
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <svg 
                              className={`w-4 h-4 transform transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19 9l-7 7-7-7" 
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Sub-navigation dropdown */}
                      {item.hasSubNav && isExpanded && (
                        <div className="mt-2 ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
                          {item.name === "dataEHR" && dataEHRSubNavItems.map((subItem) => {
                            const isSubActive = isActive && activeSubItem === subItem.key;
                            return (
                              <button
                                key={subItem.key}
                                onClick={() => setActiveSubItem(subItem.key)}
                                className={`w-full group flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out ${
                                  isSubActive
                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                    : "text-gray-600 hover:bg-gray-100/60 hover:text-gray-800"
                                }`}
                              >
                                <span className={`text-sm transition-transform duration-200 ${
                                  isSubActive ? "scale-110" : "group-hover:scale-105"
                                }`}>
                                  {subItem.icon}
                                </span>
                                <span className="tracking-tight">{subItem.label}</span>
                                {isSubActive && (
                                  <div className="ml-auto w-1 h-1 bg-blue-500 rounded-full"></div>
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
          </aside>

          {/* Main Content - with left margin to account for fixed sidebar and minimal top padding */}
          <main className="ml-72 pt-0 min-h-screen">
            <div className="bg-gradient-to-br from-gray-50 to-white p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </SubNavContext.Provider>
    </ProtectedRoute>
  );
}