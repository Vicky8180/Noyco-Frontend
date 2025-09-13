"use client";

import { motion } from "framer-motion";

const PersonalityTraitsStep = ({ data, updateData, errors, onNext }) => {
  const personalityTraits = [
    { value: "empathetic", label: "Empathetic", emoji: "❤️" },
    { value: "optimistic", label: "Optimistic", emoji: "🌟" },
    { value: "analytical", label: "Analytical", emoji: "🧠" },
    { value: "creative", label: "Creative", emoji: "🎨" },
    { value: "patient", label: "Patient", emoji: "🧘" },
    { value: "energetic", label: "Energetic", emoji: "⚡" },
    { value: "supportive", label: "Supportive", emoji: "🤝" },
    { value: "gentle", label: "Gentle", emoji: "🕊️" }
  ];

  const handleTraitToggle = (trait) => {
    const currentTraits = data.personality_traits || [];
    let newTraits;
    
    if (currentTraits.includes(trait)) {
      newTraits = currentTraits.filter(t => t !== trait);
    } else {
      newTraits = [...currentTraits, trait];
    }
    
    updateData({ personality_traits: newTraits });
  };

  const selectedCount = data.personality_traits?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      {/* Question */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Which traits describe you?
        </h1>
        <p className="text-gray-600 text-sm">
          Select 2-3 that feel most like you
        </p>
      </div>

      {/* Personality Traits Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {personalityTraits.map((trait) => (
          <motion.button
            key={trait.value}
            onClick={() => handleTraitToggle(trait.value)}
            className={`p-4 border-2 rounded-xl transition-colors ${
              data.personality_traits?.includes(trait.value)
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl mb-2">{trait.emoji}</div>
            <div className="text-sm font-medium text-gray-900">{trait.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Selected count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {selectedCount} selected {selectedCount > 0 && selectedCount <= 3 ? "✓" : selectedCount > 3 ? "(try to keep it to 3)" : ""}
        </p>
      </div>

      {/* Continue button */}
      <button
        onClick={onNext}
        disabled={selectedCount === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Continue
      </button>

      {errors.personality_traits && (
        <p className="text-red-600 text-sm mt-2">
          {errors.personality_traits}
        </p>
      )}
    </motion.div>
  );
};

export default PersonalityTraitsStep;
