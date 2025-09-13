"use client";

import { motion } from "framer-motion";

const CommunicationStyleStep = ({ data, updateData, errors, onNext }) => {
  const communicationStyles = [
    { value: "friendly", label: "Friendly & Warm", emoji: "😊", description: "Casual, approachable conversation" },
    { value: "empathetic", label: "Empathetic & Supportive", emoji: "🤗", description: "Understanding and caring tone" },
    { value: "direct", label: "Direct & Clear", emoji: "🎯", description: "Straightforward, no-nonsense" },
    { value: "encouraging", label: "Encouraging & Uplifting", emoji: "🚀", description: "Positive, motivating approach" }
  ];

  const handleStyleSelect = (style) => {
    updateData({ communication_style: style });
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
          How do you prefer to communicate?
        </h1>
        <p className="text-gray-600 text-sm">
          This helps us match your preferred conversation style
        </p>
      </div>

      {/* Style Options */}
      <div className="space-y-3">
        {communicationStyles.map((style) => (
          <motion.button
            key={style.value}
            onClick={() => handleStyleSelect(style.value)}
            className={`w-full p-4 border-2 rounded-xl text-left transition-colors hover:border-blue-600 hover:bg-blue-50 ${
              data.communication_style === style.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{style.emoji}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-left">{style.label}</div>
                <div className="text-sm text-gray-600 text-left">{style.description}</div>
              </div>
              {data.communication_style === style.value && (
                <span className="text-blue-600">✓</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {errors.communication_style && (
        <p className="text-red-600 text-sm mt-4">
          {errors.communication_style}
        </p>
      )}
    </motion.div>
  );
};

export default CommunicationStyleStep;
