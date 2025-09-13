"use client";

import { motion } from "framer-motion";

const CommunicationTimeStep = ({ data, updateData, errors, onNext }) => {
  const communicationTimes = [
    { value: "morning", label: "Morning", emoji: "☀️", description: "6 AM - 12 PM" },
    { value: "afternoon", label: "Afternoon", emoji: "🌤️", description: "12 PM - 6 PM" },
    { value: "evening", label: "Evening", emoji: "🌙", description: "6 PM - 10 PM" },
    { value: "anytime", label: "Anytime", emoji: "⏰", description: "I'm flexible" }
  ];

  const handleTimeSelect = (time) => {
    updateData({ preferred_communication_time: time });
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
          When's the best time to reach you?
        </h1>
        <p className="text-gray-600 text-sm">
          We'll prioritize this time for check-ins and conversations
        </p>
      </div>

      {/* Time Options */}
      <div className="space-y-3">
        {communicationTimes.map((time) => (
          <motion.button
            key={time.value}
            onClick={() => handleTimeSelect(time.value)}
            className={`w-full p-4 border-2 rounded-xl text-left transition-colors hover:border-blue-600 hover:bg-blue-50 ${
              data.preferred_communication_time === time.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{time.emoji}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-left">{time.label}</div>
                <div className="text-sm text-gray-600 text-left">{time.description}</div>
              </div>
              {data.preferred_communication_time === time.value && (
                <span className="text-blue-600">✓</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {errors.preferred_communication_time && (
        <p className="text-red-600 text-sm mt-4">
          {errors.preferred_communication_time}
        </p>
      )}
    </motion.div>
  );
};

export default CommunicationTimeStep;
