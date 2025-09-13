import React, { useState, useEffect, useRef } from "react";
import MicButton from "./MicButton";
import { useLiveKit } from "../hooks/useLiveKit";

export default function WidgetContainer({ hospitalId, individualId, apiBase, autoStart = false, hideButton = false, onMessage, onStateChange }) {
  const [session, setSession] = useState(null);
  const entityId = hospitalId || individualId;
  const [status, setStatus] = useState("Idle");
  const [isConnecting, setIsConnecting] = useState(false);
  const previousStateRef = useRef({});

  const cleanBase = apiBase.replace(/\/+$/, "");

  // Helper function to update state only when it actually changes
  const updateStateIfChanged = (newState) => {
    const stateKey = `${newState.isActive}-${newState.isConnecting}-${newState.isListening}`;
    if (previousStateRef.current.key !== stateKey && onStateChange) {
      previousStateRef.current = { ...newState, key: stateKey };
      onStateChange(newState);
    }
  };

  const { connected, isListening } = useLiveKit({
    host: session?.livekit_host,
    token: session?.livekit_token,
    onConnected: () => {
      setStatus("Connected");
      setIsConnecting(false);
      updateStateIfChanged({
        isActive: true,
        isConnecting: false,
        isListening: false
      });
    },
    onAudioTrack: () => {},
    onData: onMessage,
  });

  // Update parent component when listening state changes
  useEffect(() => {
    if (connected) {
      updateStateIfChanged({
        isActive: true,
        isConnecting: false,
        isListening: isListening || false
      });
    }
  }, [isListening, connected]);

  const startSession = async () => {
    if (session) return;
    setIsConnecting(true);
    setStatus("Requesting session...");
    
    // Notify parent of connecting state
    updateStateIfChanged({
      isActive: false,
      isConnecting: true,
      isListening: false
    });

    try {
      const resp = await fetch(`${cleanBase}/voice-widget/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospital_id: entityId }),
      });
      const data = await resp.json();
      setSession(data);
    } catch (error) {
      console.error("Failed to start session:", error);
      setIsConnecting(false);
      updateStateIfChanged({
        isActive: false,
        isConnecting: false,
        isListening: false
      });
    }
  };

  // Auto-start session when component mounts if requested
  useEffect(() => {
    if (autoStart && !session) {
      startSession();
    }
  }, [autoStart, session]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {!hideButton && (
        <>
          <MicButton onClick={startSession} disabled={!!session && !connected} />
          <p style={{ fontSize: 14 }}>{status}</p>
        </>
      )}
    </div>
  );
} 





