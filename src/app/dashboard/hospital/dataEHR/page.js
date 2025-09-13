"use client";

import { useSubNav } from "../layout";
import UploadComponent from "./components/upload";
import ViewComponent from "./components/view";
import EHRComponent from "./components/ehr"; // Assuming you have an EHR component
export default function DataEHRPage() {
  const { activeSubItem } = useSubNav();

  const renderContent = () => {
    switch (activeSubItem) {
      case "upload":
        return <UploadComponent />;
      case "view":
        return <ViewComponent />;
       case "ehr":
        return <EHRComponent />;  
      default:
        return <UploadComponent />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Hospital</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span>dataEHR</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-gray-900 font-medium capitalize">{activeSubItem}</span>
      </div>

      {/* Main Content */}
      <div key={activeSubItem}>
        {renderContent()}
      </div>
    </div>
  );
}