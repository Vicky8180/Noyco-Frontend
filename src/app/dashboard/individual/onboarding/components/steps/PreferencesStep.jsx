"use client";

import { motion } from "framer-motion";
import { Cog6ToothIcon, SpeakerWaveIcon, BellIcon, EyeIcon } from "@heroicons/react/24/outline";

const PreferencesStep = ({ data, updateData }) => {
  const voiceTypes = [
    { value: "female", label: "Female Voice", emoji: "👩", description: "Warm and caring female voice" },
    { value: "male", label: "Male Voice", emoji: "👨", description: "Friendly and supportive male voice" },
    { value: "neutral", label: "Neutral Voice", emoji: "🤖", description: "Gender-neutral AI voice" }
  ];

  const conversationLengths = [
    { value: "brief", label: "Brief", emoji: "⚡", description: "Quick 2-3 minute interactions", time: "2-3 min" },
    { value: "medium", label: "Medium", emoji: "💬", description: "Standard 5-10 minute conversations", time: "5-10 min" },
    { value: "detailed", label: "Detailed", emoji: "📝", description: "In-depth 15+ minute discussions", time: "15+ min" }
  ];

  const reminderStyles = [
    { value: "gentle", label: "Gentle Reminders", emoji: "🕊️", description: "Soft, non-intrusive notifications" },
    { value: "encouraging", label: "Encouraging", emoji: "💪", description: "Motivational and upbeat reminders" },
    { value: "direct", label: "Direct", emoji: "📢", description: "Clear and straightforward notifications" },
    { value: "minimal", label: "Minimal", emoji: "🔕", description: "Only essential reminders" }
  ];

  const privacyLevels = [
    { 
      value: "open", 
      label: "Open Sharing", 
      emoji: "🌐", 
      description: "Comfortable sharing for better personalization" 
    },
    { 
      value: "standard", 
      label: "Standard Privacy", 
      emoji: "🛡️", 
      description: "Balanced privacy with some data sharing" 
    },
    { 
      value: "high", 
      label: "High Privacy", 
      emoji: "🔒", 
      description: "Minimal data sharing, maximum privacy" 
    }
  ];

  const themeOptions = [
    { value: "light", label: "Light Theme", emoji: "☀️", description: "Clean and bright interface" },
    { value: "dark", label: "Dark Theme", emoji: "🌙", description: "Easy on the eyes, dark interface" },
    { value: "auto", label: "Auto", emoji: "🔄", description: "Matches your device settings" }
  ];

  const accessibilityOptions = [
    { key: "large_text", label: "Large Text", emoji: "🔍", description: "Bigger fonts for easier reading" },
    { key: "high_contrast", label: "High Contrast", emoji: "⚫⚪", description: "Better visibility with high contrast" },
    { key: "voice_feedback", label: "Voice Feedback", emoji: "🔊", description: "Audio confirmation of actions" },
    { key: "reduced_motion", label: "Reduced Motion", emoji: "⏸️", description: "Minimize animations and transitions" }
  ];

  const handlePreferenceUpdate = (field, value) => {
    const currentPreferences = data.preferences || {};
    updateData({
      preferences: {
        ...currentPreferences,
        [field]: value
      }
    });
  };

  const toggleAccessibility = (key) => {
    const currentPreferences = data.preferences || {};
    const currentAccessibility = currentPreferences.accessibility || {};
    
    handlePreferenceUpdate('accessibility', {
      ...currentAccessibility,
      [key]: !currentAccessibility[key]
    });
  };

  const preferences = data.preferences || {};
  const accessibility = preferences.accessibility || {};

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cog6ToothIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize your experience</h2>
          <p className="text-gray-600">Set up your preferences for the best possible experience</p>
        </div>

        {/* Voice and Communication */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <SpeakerWaveIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Voice & Communication</h3>
          </div>

          {/* Voice Type */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Preferred Voice Type</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {voiceTypes.map((voice) => (
                <button
                  key={voice.value}
                  onClick={() => handlePreferenceUpdate('voice_type', voice.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    preferences.voice_type === voice.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-2">{voice.emoji}</div>
                  <div className="font-medium text-sm mb-1">{voice.label}</div>
                  <div className="text-xs text-gray-500">{voice.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Length */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Conversation Length</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {conversationLengths.map((length) => (
                <button
                  key={length.value}
                  onClick={() => handlePreferenceUpdate('conversation_length', length.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    preferences.conversation_length === length.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-2">{length.emoji}</div>
                  <div className="font-medium text-sm mb-1">{length.label}</div>
                  <div className="text-xs text-blue-600 font-medium mb-1">{length.time}</div>
                  <div className="text-xs text-gray-500">{length.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <BellIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications & Reminders</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reminderStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => handlePreferenceUpdate('reminder_style', style.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  preferences.reminder_style === style.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{style.emoji}</div>
                  <div>
                    <div className="font-medium text-sm mb-1">{style.label}</div>
                    <div className="text-xs text-gray-500">{style.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Level */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <EyeIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Privacy Level</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Choose how much information you're comfortable sharing for personalization
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {privacyLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => handlePreferenceUpdate('privacy_level', level.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  preferences.privacy_level === level.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-2">{level.emoji}</div>
                <div className="font-medium text-sm mb-1">{level.label}</div>
                <div className="text-xs text-gray-500">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance & Accessibility */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Theme */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Theme Preference
            </h3>

            <div className="space-y-3">
              {themeOptions.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handlePreferenceUpdate('theme', theme.value)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    preferences.theme === theme.value
                      ? 'border-gray-500 bg-gray-50 text-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{theme.emoji}</span>
                    <div>
                      <div className="font-medium text-sm">{theme.label}</div>
                      <div className="text-xs text-gray-500">{theme.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Accessibility Options
            </h3>

            <div className="space-y-3">
              {accessibilityOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => toggleAccessibility(option.key)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    accessibility[option.key]
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{option.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                    {accessibility[option.key] && (
                      <div className="text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600">✨</span>
            </div>
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">Your Personalized Experience</h4>
              <p className="text-purple-800 text-sm leading-relaxed">
                Your AI companion will use a{" "}
                <span className="font-medium">
                  {voiceTypes.find(v => v.value === preferences.voice_type)?.label.toLowerCase() || "female voice"}
                </span>
                {" "}with{" "}
                <span className="font-medium">
                  {conversationLengths.find(c => c.value === preferences.conversation_length)?.label.toLowerCase() || "medium"}
                </span>
                {" "}conversations and{" "}
                <span className="font-medium">
                  {reminderStyles.find(r => r.value === preferences.reminder_style)?.label.toLowerCase() || "gentle"}
                </span>
                . Your privacy level is set to{" "}
                <span className="font-medium">
                  {privacyLevels.find(p => p.value === preferences.privacy_level)?.label.toLowerCase() || "standard"}
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Customization Note */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            All preferences can be changed anytime in your dashboard settings. We'll start with these defaults and learn your preferences over time.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PreferencesStep;
