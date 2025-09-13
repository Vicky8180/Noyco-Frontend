"use client";

import { motion } from "framer-motion";

const NameStep = ({ data, updateData, errors, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.name?.trim()) {
      onNext();
    }
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
          What should we call you?
        </h1>
        <p className="text-gray-600 text-sm">
          This helps us personalize your experience
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={data.name || ""}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Enter your name"
            className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none focus:border-blue-600 transition-colors ${
              errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
            autoFocus
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-2 text-left">
              {errors.name}
            </p>
          )}
        </div>

        {/* Continue button */}
        <button
          type="submit"
          disabled={!data.name?.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </form>

      {/* Friendly feedback */}
      {data.name && data.name.trim() && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
        >
          <p className="text-green-800 text-sm">
            Nice to meet you, {data.name}! 👋
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NameStep;
