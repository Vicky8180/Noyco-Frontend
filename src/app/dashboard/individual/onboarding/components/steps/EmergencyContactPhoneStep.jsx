"use client";

import { motion } from "framer-motion";

const EmergencyContactPhoneStep = ({ data, updateData, errors, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.emergency_contact?.phone?.trim()) {
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
          What's {data.emergency_contact?.name || "their"} phone number?
        </h1>
        <p className="text-gray-600 text-sm">
          We'll only use this in emergency situations
        </p>
      </div>

      {/* Contact Info Preview */}
      {data.emergency_contact?.name && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-600">
            Emergency Contact: <span className="font-medium text-gray-900">{data.emergency_contact.name}</span>
            {data.emergency_contact.relationship && (
              <span className="text-gray-500"> ({data.emergency_contact.relationship})</span>
            )}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="tel"
            value={data.emergency_contact?.phone || ""}
            onChange={(e) => updateData({
              emergency_contact: {
                ...data.emergency_contact,
                phone: e.target.value
              }
            })}
            placeholder="+1 (555) 123-4567"
            className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none focus:border-blue-600 transition-colors ${
              errors.emergency_contact_phone ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
            autoFocus
          />
          {errors.emergency_contact_phone && (
            <p className="text-red-600 text-sm mt-2 text-left">
              {errors.emergency_contact_phone}
            </p>
          )}
        </div>

        {/* Continue button */}
        <button
          type="submit"
          disabled={!data.emergency_contact?.phone?.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </form>

      {/* Security note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <span>🔒</span>
          <span>This information is encrypted and secure</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyContactPhoneStep;
