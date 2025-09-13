"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

const ReviewStep = ({ data, onNext, isCompleting }) => {
  const sections = [
    {
      title: "Basic Information",
      icon: "👤",
      items: [
        { label: "Name", value: data.name },
        { label: "Age", value: data.age },
        { label: "Gender", value: data.gender },
        { label: "Phone", value: data.phone },
        { label: "Location", value: data.location },
        { label: "Language", value: data.language }
      ]
    },
    {
      title: "Personality & Interests",
      icon: "🧠",
      items: [
        { label: "Personality Traits", value: data.personality_traits?.join(", ") },
        { label: "Hobbies", value: data.hobbies?.join(", ") },
        { label: "Professional Interests", value: data.interests?.join(", ") },
        { label: "Communication Style", value: data.emotional_baseline }
      ]
    },
    {
      title: "Health & Wellness",
      icon: "🎯",
      items: [
        { label: "Health Goals", value: data.health_goals?.join(", ") },
        { label: "Medical Conditions", value: data.medical_conditions?.join(", ") },
        { label: "Medications", value: data.medications?.join(", ") },
        { label: "Wellness Focus", value: data.wellness_focus?.join(", ") }
      ]
    },
    {
      title: "Communication Preferences",
      icon: "💬",
      items: [
        { label: "Preferred Time", value: data.preferred_communication_time },
        { label: "Frequency", value: data.communication_frequency },
        { label: "Style", value: data.communication_style },
        { label: "Conversation Length", value: data.preferences?.conversation_length }
      ]
    },
    {
      title: "Relationships",
      icon: "❤️",
      items: [
        { label: "Loved Ones", value: data.loved_ones?.map(person => `${person.name} (${person.relation})`).join(", ") },
        { label: "Support Network", value: data.support_network?.join(", ") }
      ]
    },
    {
      title: "Lifestyle",
      icon: "🌅",
      items: [
        { label: "Work Schedule", value: data.work_schedule?.type },
        { label: "Sleep Pattern", value: data.sleep_pattern?.type },
        { label: "Activity Level", value: data.daily_routine?.activity_level },
        { label: "Stress Level", value: data.daily_routine?.stress_level }
      ]
    },
    {
      title: "App Preferences",
      icon: "⚙️",
      items: [
        { label: "Voice Type", value: data.preferences?.voice_type },
        { label: "Reminder Style", value: data.preferences?.reminder_style },
        { label: "Privacy Level", value: data.preferences?.privacy_level },
        { label: "Theme", value: data.preferences?.theme }
      ]
    },
    {
      title: "Emergency Contact",
      icon: "🚨",
      items: [
        { label: "Name", value: data.emergency_contact?.name },
        { label: "Relationship", value: data.emergency_contact?.relationship },
        { label: "Phone", value: data.emergency_contact?.phone },
        { label: "Email", value: data.emergency_contact?.email }
      ]
    },
    {
      title: "Privacy Settings",
      icon: "🔒",
      items: [
        { label: "Data Sharing", value: data.data_sharing_consent ? "Enabled" : "Disabled" },
        { label: "Marketing", value: data.marketing_consent ? "Enabled" : "Disabled" },
        { label: "Analytics", value: data.analytics_consent ? "Enabled" : "Disabled" }
      ]
    }
  ];

  const formatValue = (value) => {
    if (!value) return "Not specified";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "string" && value.trim() === "") return "Not specified";
    return value;
  };

  const getCompletionStats = () => {
    let totalFields = 0;
    let completedFields = 0;

    sections.forEach(section => {
      section.items.forEach(item => {
        totalFields++;
        if (item.value && item.value !== "Not specified" && item.value.trim() !== "") {
          completedFields++;
        }
      });
    });

    return {
      total: totalFields,
      completed: completedFields,
      percentage: Math.round((completedFields / totalFields) * 100)
    };
  };

  const stats = getCompletionStats();

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <EyeIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review your profile</h2>
          <p className="text-gray-600">Take a moment to review your information before we create your AI companion</p>
        </div>

        {/* Completion Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Profile Completion</h3>
                <p className="text-blue-700 text-sm">
                  {stats.completed} of {stats.total} fields completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">{stats.percentage}%</div>
              <div className="text-xs text-blue-700">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-blue-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Profile Sections */}
        <div className="grid gap-6">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-gray-700">{item.label}</dt>
                      <dd className={`mt-1 text-sm ${
                        item.value && item.value !== "Not specified" && item.value.trim() !== ""
                          ? "text-gray-900"
                          : "text-gray-400 italic"
                      }`}>
                        {formatValue(item.value)}
                      </dd>
                    </div>
                    {item.value && item.value !== "Not specified" && item.value.trim() !== "" && (
                      <CheckCircleIcon className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Companion Preview */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Your AI Companion Preview
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <p className="text-sm text-gray-700 italic">
                  "Hello {data.name || "there"}! I'm excited to be your wellness companion. 
                  I understand you're interested in {data.interests?.slice(0, 2).join(" and ") || "health and wellness"}, 
                  and I'm here to support you with {data.health_goals?.slice(0, 2).join(" and ") || "your wellness goals"}. 
                  I'll communicate in a {data.communication_style || "supportive"} way and reach out 
                  {data.preferred_communication_time ? ` during ${data.preferred_communication_time}` : " when convenient"}. 
                  Let's work together on your wellness journey!"
                </p>
              </div>
              <p className="text-purple-800 text-sm">
                Your AI companion has been personalized based on your responses and will continue 
                to learn and adapt to better support your wellness goals.
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Confirmation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ready to Complete Your Setup?
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Your profile information will be securely stored and encrypted
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                You can update or modify any information in your dashboard settings
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Your AI companion will begin learning your preferences immediately
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Emergency contacts will only be used when absolutely necessary for your safety
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              By completing setup, you confirm that the information provided is accurate and agree to our{" "}
              <button className="text-blue-600 hover:text-blue-700 underline">Terms of Service</button> and{" "}
              <button className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</button>.
              You can review and modify your privacy settings at any time in your dashboard.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <button
            onClick={onNext}
            disabled={isCompleting}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isCompleting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Your Profile...</span>
              </>
            ) : (
              <>
                <span>Complete Setup & Create Profile</span>
                <CheckCircleIcon className="w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            This will take you to your personalized wellness dashboard
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewStep;
