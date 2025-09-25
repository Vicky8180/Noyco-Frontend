"use client";

import { useRef, useState } from "react";
import { useMarketingFunnel } from "../../context/MarketingFunnelContext";

const VoiceDemoStep = () => {
  const { data, actions } = useMarketingFunnel();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Get intensity safely
  const intensity = typeof data.intensity === "number" ? data.intensity : 0;
  
  // Show step description based on conditions
  const shouldShowVoiceDemo = intensity >= 6 || data.wantsVoiceDemo;

  const handlePlay = () => {
    // play audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // restart from beginning
      audioRef.current.play();
      setIsPlaying(true);
      setHasPlayed(true);
    }
    actions.updateData({ wantsVoiceDemo: true });
    // Don't navigate immediately - let audio play
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    // Audio has finished playing - don't auto-navigate, let user choose
  };

  const handleContinue = () => {
    // Stop audio if still playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    actions.nextStep();
  };

  const handleSkip = () => {
    // Stop audio if playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    actions.updateData({ wantsVoiceDemo: false });
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">
          {shouldShowVoiceDemo
            ? "Want a 20-second calming cue to see how it feels?"
            : "Optional: Try a voice sample"}
        </h2>
        <p className="text-gray-500 leading-relaxed">
          {shouldShowVoiceDemo
            ? "One proof moment. Not spamming demos."
            : "Experience how our voice sessions work before continuing."}
        </p>
      </div>

      {/* Image placeholder */}
      <div className="flex justify-center my-8">
        <div className="w-50 h-50 flex items-center justify-center">
          <img src="./mic.jpg" alt="" />
        </div>
      </div>

      <div className="p-8">
        <div className="text-center space-y-6">
          {isPlaying && (
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                🎵 Playing audio sample...
              </div>
            </div>
          )}
          
          {hasPlayed && !isPlaying && (
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✓ Sample completed
              </div>
            </div>
          )}
          
          <p className="text-sm leading-relaxed">
            Experience a personalized calming session designed just for you
          </p>
        </div>
      </div>

      {/* Hidden audio element with event handlers */}
      <audio 
        ref={audioRef} 
        src="./audiotherapy.mp3" 
        onEnded={handleAudioEnd}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-8 pt-4">
        <button
          onClick={handleSkip}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
        >
          {isPlaying ? "Stop & Skip" : "Skip for now"}
        </button>

        {!hasPlayed ? (
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`px-8 py-3 rounded-none transition-all duration-200 text-sm font-semibold ${
              isPlaying
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-lg"
            }`}
          >
            {isPlaying ? "Playing..." : "Play sample"}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className={`px-6 py-3 rounded-none transition-all duration-200 text-sm font-medium border ${
                isPlaying
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
            >
              {isPlaying ? "Playing..." : "Play again"}
            </button>
            
            <button
              onClick={handleContinue}
              disabled={isPlaying}
              className={`px-8 py-3 rounded-none transition-all duration-200 text-sm font-semibold ${
                isPlaying
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-lg"
              }`}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceDemoStep;
