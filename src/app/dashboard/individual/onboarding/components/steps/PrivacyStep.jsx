"use client";

import { motion } from "framer-motion";

const PrivacyStep = ({ data, updateData, onNext }) => {
  const hasSelectedBoth = data.data_sharing_consent !== undefined && data.analytics_consent !== undefined;

  const handleDataSharingSelect = (consent) => {
    updateData({ data_sharing_consent: consent });
    // Auto-advance if both are selected
    if (data.analytics_consent !== undefined) {
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };

  const handleAnalyticsSelect = (consent) => {
    updateData({ analytics_consent: consent });
    // Auto-advance if both are selected
    if (data.data_sharing_consent !== undefined) {
      setTimeout(() => {
        onNext();
      }, 300);
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
          Privacy Settings
        </h1>
        <p className="text-gray-600 text-sm">
          Help us understand your data preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Sharing */}
        <div className="text-left">
          <h3 className="font-medium text-gray-900 mb-2">Data Sharing</h3>
          <p className="text-sm text-gray-600 mb-3">
            Allow Noyco to use anonymized data to improve AI models? Your personal identity remains private.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleDataSharingSelect(true)}
              className={`flex-1 p-3 border-2 rounded-xl transition-colors ${
                data.data_sharing_consent === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">Yes, help improve</div>
            </button>
            <button
              onClick={() => handleDataSharingSelect(false)}
              className={`flex-1 p-3 border-2 rounded-xl transition-colors ${
                data.data_sharing_consent === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">No, keep private</div>
            </button>
          </div>
        </div>

        {/* Analytics */}
        <div className="text-left">
          <h3 className="font-medium text-gray-900 mb-2">Usage Analytics</h3>
          <p className="text-sm text-gray-600 mb-3">
            Allow anonymous usage data collection to improve your experience?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleAnalyticsSelect(true)}
              className={`flex-1 p-3 border-2 rounded-xl transition-colors ${
                data.analytics_consent === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">Yes, allow</div>
            </button>
            <button
              onClick={() => handleAnalyticsSelect(false)}
              className={`flex-1 p-3 border-2 rounded-xl transition-colors ${
                data.analytics_consent === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">No, disable</div>
            </button>
          </div>
        </div>
      </div>

      {/* Manual continue button if needed */}
      {hasSelectedBoth && (
        <button
          onClick={onNext}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors mt-6"
        >
          Continue
        </button>
      )}

      {/* Note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <span>💡</span>
          <span>You can change these settings anytime</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyStep;