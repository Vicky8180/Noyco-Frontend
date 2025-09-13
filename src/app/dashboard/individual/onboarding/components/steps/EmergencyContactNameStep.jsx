"use client";

import { motion } from "framer-motion";

const EmergencyContactNameStep = ({ data, updateData, errors, onNext }) => {
  const relationshipOptions = [
    "Spouse", "Parent", "Child", "Sibling", "Friend", "Doctor", "Caregiver", "Other"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.emergency_contact?.name?.trim()) {
      onNext();
    }
  };

  const handleRelationshipSelect = (relationship) => {
    updateData({
      emergency_contact: {
        ...data.emergency_contact,
        relationship: relationship
      }
    });
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
          Who should we contact in an emergency?
        </h1>
        <p className="text-gray-600 text-sm">
          This person will only be contacted in critical situations
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <input
            type="text"
            value={data.emergency_contact?.name || ""}
            onChange={(e) => updateData({
              emergency_contact: {
                ...data.emergency_contact,
                name: e.target.value
              }
            })}
            placeholder="Full name"
            className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none focus:border-blue-600 transition-colors ${
              errors.emergency_contact ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
            autoFocus
          />
          {errors.emergency_contact && (
            <p className="text-red-600 text-sm mt-2 text-left">
              {errors.emergency_contact}
            </p>
          )}
        </div>

        {/* Relationship Selection */}
        <div>
          <p className="text-sm text-gray-600 mb-3 text-left">Relationship to you:</p>
          <div className="grid grid-cols-2 gap-2">
            {relationshipOptions.map((relationship) => (
              <button
                key={relationship}
                type="button"
                onClick={() => handleRelationshipSelect(relationship)}
                className={`p-2 text-sm border rounded-lg transition-colors ${
                  data.emergency_contact?.relationship === relationship
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {relationship}
              </button>
            ))}
          </div>
        </div>

        {/* Continue button */}
        <button
          type="submit"
          disabled={!data.emergency_contact?.name?.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </form>

      {/* Security note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <span>🔒</span>
          <span>This information is only used in emergencies</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyContactNameStep;
