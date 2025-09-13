"use client";

import { motion } from "framer-motion";

const PhoneStep = ({ data, updateData, errors, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.phone?.trim()) {
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
          What's your phone number?
        </h1>
        <p className="text-gray-600 text-sm">
          We'll use this for wellness check-ins and emergencies
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none focus:border-blue-600 transition-colors ${
              errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
            autoFocus
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-2 text-left">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Continue button */}
        <button
          type="submit"
          disabled={!data.phone?.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </form>

      {/* Security note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <span>🔒</span>
          <span>Your information is encrypted and secure</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PhoneStep;
