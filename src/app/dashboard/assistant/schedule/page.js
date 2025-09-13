"use client";

import { useState } from "react";
import { useSubNav } from "../layout";
import BS from "../data/bs";
import ManualCallScheduling from "../data/d";
import TrackingComponent from "./components/TrackingComponent";
import ScheduleComponent from "./components/ScheduleComponent";

// Custom component that integrates both scheduling components
const CustomComponent = () => {
    // Blur background and show "Coming Soon" overlay at the top
    return (
        <div className="relative">
            {/* Overlay only at the top */}
            <div className="absolute top-0 left-0 w-full flex items-center justify-center z-50">
                <div className="bg-white/80 backdrop-blur-lg rounded-b-2xl shadow-lg px-8 py-12 flex flex-col items-center justify-center w-full">
                    <span className="text-4xl font-bold text-gray-700 mb-4">Coming Soon</span>
                    <span className="text-lg text-gray-500">Custom scheduling features are on the way!</span>
                </div>
            </div>
            {/* Blurred background below overlay */}
            <div className="pt-[180px] space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 bg-white/80 filter blur-sm pointer-events-none select-none min-h-[400px]">
                {/* You can keep the original content here if needed */}
                {/* ...existing code for custom tab content... */}
            </div>
        </div>
    );
};

// Main page component
function SchedulePage() {
    const { activeSubItem } = useSubNav();
    const [showManualSchedule, setShowManualSchedule] = useState(false);

    const handleNewScheduleClick = () => {
        setShowManualSchedule(true);
    };

    const handleManualScheduleClose = () => {
        setShowManualSchedule(false);
    };

     
    const renderContent = () => {
        if (activeSubItem === "schedule") {
            if (showManualSchedule) {
                // Show Manual Scheduling UI
                return (
                    <div>
                        {/* Optionally add a close/back button */}
                        <button
                            className="mb-4 px-4 py-2 bg-gray-200 rounded"
                            onClick={handleManualScheduleClose}
                        >
                            Back to Schedule List
                        </button>
                        <ManualCallScheduling />
                    </div>
                );
            }
            // Default ScheduleComponent with "New Schedule" button
            return (
                <div>
                    <div className="flex justify-end mb-4">
                        {/* Only keep this "New Schedule" button */}
                        <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            onClick={handleNewScheduleClick}
                        >
                            New Schedule
                        </button>
                    </div>
                    {/* Remove any other "New Schedule" button with calendar SVG here */}
                    <ScheduleComponent />
                </div>
            );
        }
        // ...existing switch logic for other tabs...
        switch (activeSubItem) {
            case "track":
                return <TrackingComponent />;
            case "custom":
                return <CustomComponent />;
            default:
                return <TrackingComponent />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Assistant</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
                <span>Schedule</span>
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

export default SchedulePage;

