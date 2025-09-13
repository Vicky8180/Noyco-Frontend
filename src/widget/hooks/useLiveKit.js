// Simple LiveKit hook for the voice widget
import { useEffect, useState, useRef } from "react";
// import { Room } from "@livekit/client";
import { Room, createLocalAudioTrack, RoomEvent } from "livekit-client";
import {LocalAudioTrack} from "livekit-client";

export function useLiveKit({ host, token, onConnected, onAudioTrack, onData }) {
  const [connected, setConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const roomRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    async function connect() {
      if (!host || !token) return;
      const room = new Room();
      roomRef.current = room;
      await room.connect(host, token);
      const mic = await createLocalAudioTrack();
      room.localParticipant.publishTrack(mic);

      // Set up audio analysis for voice activity detection
      if (mic.mediaStreamTrack) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(new MediaStream([mic.mediaStreamTrack]));
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        audioAnalyserRef.current = analyser;

        // Monitor audio levels with throttling
        let lastCheck = 0;
        const checkAudioLevel = () => {
          if (!audioAnalyserRef.current) return;
          
          const now = Date.now();
          // Throttle to check every 100ms instead of every frame
          if (now - lastCheck < 100) {
            if (connected) {
              requestAnimationFrame(checkAudioLevel);
            }
            return;
          }
          lastCheck = now;
          
          const bufferLength = audioAnalyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          audioAnalyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          const threshold = 20; // Adjust threshold as needed
          
          setIsListening(average > threshold);
          
          if (connected) {
            requestAnimationFrame(checkAudioLevel);
          }
        };
        
        checkAudioLevel();
      }
      room.on("trackSubscribed", (track) => {
        if (track.kind === "audio") {
          // Create an <audio/> element for the remote track and auto-play it.
          const el = track.attach();
          el.style.display = "none"; // keep it invisible
          document.body.appendChild(el);
          el.play?.().catch(() => {
            /* autoplay policy */
          });
          onAudioTrack?.(track);
        }
      });

      // Handle data messages (payload is Uint8Array)
      room.on(RoomEvent.DataReceived, (payload, _participant, _kind) => {
        try {
          const text = new TextDecoder().decode(payload);
          console.debug("LiveKit dataReceived", text);
          const msg = JSON.parse(text);
          onData?.(msg);
        } catch (e) {
          console.warn("Failed to parse data message", e);
        }
      });
      setConnected(true);
      onConnected?.();
    }
    connect();
    return () => {
      roomRef.current?.disconnect();
      // Clean up audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      audioAnalyserRef.current = null;
      audioContextRef.current = null;
    };
  }, [host, token]);

  return { connected, isListening };
} 







