"use client";

import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

// Re-use the existing widget container from the public widget bundle.
const WidgetContainer = dynamic(
  () => import("./WidgetContainer"),
  { ssr: false }
);

/**
 * VoiceAssistantPanel
 * -------------------
 * A thin wrapper around the existing <WidgetContainer/> that passes
 * the currently logged-in individualId obtained from the Redux auth slice.
 *
 * The widget will open a LiveKit session that streams the user's microphone
 * and plays back the assistant responses.
 */
export default function VoiceAssistantPanel({ className = "", autoStart = false, hideButton = false, onMessage, onStateChange }) {
  // The auth slice stores user information under auth.user
  const user = useSelector((state) => state.auth?.user);
  const [individualId, setIndividualId] = useState(null);

  useEffect(() => {
    if (user?.role === "individual") {
      setIndividualId(user.role_entity_id || user.id);
    }
  }, [user]);

  // API base comes from env so that dev/prod works automatically
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  if (!individualId) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-sm text-gray-500">Loading voice assistant…</p>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <WidgetContainer 
        individualId={individualId} 
        apiBase={apiBase} 
        autoStart={autoStart} 
        hideButton={hideButton} 
        onMessage={onMessage}
        onStateChange={onStateChange}
      />
    </div>
  );
}













