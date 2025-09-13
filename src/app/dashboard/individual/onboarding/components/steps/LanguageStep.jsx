"use client";

import { motion } from "framer-motion";

const LanguageStep = ({ data, updateData, onNext }) => {
  const languageOptions = [
    { value: "English", emoji: "🇺🇸" },
    { value: "Spanish", emoji: "🇪🇸" },
    { value: "French", emoji: "🇫🇷" },
    { value: "German", emoji: "🇩🇪" },
    { value: "Chinese", emoji: "🇨🇳" },
    { value: "Other", emoji: "🌍" }
  ];

  const handleLanguageSelect = (language) => {
    updateData({ language });
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
          What's your preferred language?
        </h1>
        <p className="text-gray-600 text-sm">
          We'll communicate with you in this language
        </p>
      </div>

      {/* Language Options */}
      <div className="space-y-3">
        {languageOptions.map((lang) => (
          <motion.button
            key={lang.value}
            onClick={() => handleLanguageSelect(lang.value)}
            className={`w-full p-4 border-2 rounded-xl text-left transition-colors hover:border-blue-600 hover:bg-blue-50 ${
              data.language === lang.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lang.emoji}</span>
              <span className="font-medium text-gray-900">{lang.value}</span>
              {data.language === lang.value && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Skip option */}
      <button
        onClick={() => {
          updateData({ language: "English" });
          onNext();
        }}
        className="mt-6 text-gray-500 hover:text-gray-700 transition-colors text-sm"
      >
        Skip (default to English)
      </button>
    </motion.div>
  );
};

export default LanguageStep;
