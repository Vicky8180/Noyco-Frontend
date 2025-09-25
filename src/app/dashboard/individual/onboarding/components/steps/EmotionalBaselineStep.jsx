"use client";

import { motion } from "framer-motion";

const EmotionalBaselineStep = ({ data, updateData, errors, onNext }) => {
  const emotionalBaselines = [
    { value: "calm", label: "Calm & Peaceful", emoji: "😌", description: "Generally steady and tranquil" },
    { value: "optimistic", label: "Optimistic & Hopeful", emoji: "😊", description: "Usually positive outlook" },
    { value: "caring", label: "Caring & Nurturing", emoji: "🤗", description: "Warm and supportive nature" },
    { value: "energetic", label: "Energetic & Upbeat", emoji: "⚡", description: "High energy and enthusiasm" },
    { value: "gentle", label: "Gentle & Understanding", emoji: "🕊️", description: "Soft and compassionate" }
  ];

  const handleBaselineSelect = (baseline) => {
    updateData({ emotional_baseline: baseline });
    // Auto-advance after selection
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      {/* Question */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          What's your emotional baseline?
        </h1>
        <p className="text-gray-600 text-sm">
          How would you describe your general emotional state?
        </p>
      </div>

      {/* Emotional Baseline Options */}
      <div className="space-y-3">
        {emotionalBaselines.map((baseline) => (
          <motion.button
            key={baseline.value}
            onClick={() => handleBaselineSelect(baseline.value)}
            className={`w-full p-4 border-2 rounded-xl text-left transition-colors  ${
              data.emotional_baseline === baseline.value
                ? 'border-gray-600 bg-gray-50'
                : 'border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{baseline.emoji}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-left">{baseline.label}</div>
                <div className="text-sm text-gray-600 text-left">{baseline.description}</div>
              </div>
              {data.emotional_baseline === baseline.value && (
                <span className="text-gray-600">✓</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {errors.emotional_baseline && (
        <p className="text-red-600 text-sm mt-4">
          {errors.emotional_baseline}
        </p>
      )}
    </motion.div>
  );
};

export default EmotionalBaselineStep;
