"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusIcon, XMarkIcon, HeartIcon } from "@heroicons/react/24/outline";

const HealthGoalsStep = ({ data, updateData }) => {
  const [customGoal, setCustomGoal] = useState("");
  const [customCondition, setCustomCondition] = useState("");
  const [customMedication, setCustomMedication] = useState("");

  const healthGoalOptions = [
    { value: "weight_management", label: "Weight Management", emoji: "⚖️", description: "Maintain healthy weight" },
    { value: "fitness", label: "Fitness & Exercise", emoji: "💪", description: "Stay active and strong" },
    { value: "nutrition", label: "Better Nutrition", emoji: "🥗", description: "Eat healthier foods" },
    { value: "sleep", label: "Better Sleep", emoji: "😴", description: "Improve sleep quality" },
    { value: "stress", label: "Stress Management", emoji: "🧘‍♀️", description: "Reduce stress levels" },
    { value: "mental_health", label: "Mental Wellness", emoji: "🧠", description: "Support mental health" },
    { value: "hydration", label: "Stay Hydrated", emoji: "💧", description: "Drink more water" },
    { value: "quit_smoking", label: "Quit Smoking", emoji: "🚭", description: "Stop smoking habit" },
    { value: "limit_alcohol", label: "Limit Alcohol", emoji: "🚫", description: "Reduce alcohol intake" },
    { value: "preventive_care", label: "Preventive Care", emoji: "🩺", description: "Regular checkups" }
  ];

  const commonConditions = [
    { value: "diabetes", label: "Diabetes", emoji: "🩸" },
    { value: "hypertension", label: "High Blood Pressure", emoji: "❤️" },
    { value: "anxiety", label: "Anxiety", emoji: "😰" },
    { value: "depression", label: "Depression", emoji: "😔" },
    { value: "asthma", label: "Asthma", emoji: "🫁" },
    { value: "arthritis", label: "Arthritis", emoji: "🦴" },
    { value: "allergies", label: "Allergies", emoji: "🤧" },
    { value: "migraine", label: "Migraines", emoji: "🤕" }
  ];

  const wellnessFocusAreas = [
    { value: "physical", label: "Physical Health", emoji: "🏃‍♀️", description: "Body fitness and strength" },
    { value: "mental", label: "Mental Health", emoji: "🧠", description: "Emotional wellbeing" },
    { value: "social", label: "Social Wellness", emoji: "👥", description: "Relationships and connections" },
    { value: "spiritual", label: "Spiritual Health", emoji: "🙏", description: "Inner peace and purpose" },
    { value: "environmental", label: "Environmental", emoji: "🌍", description: "Healthy surroundings" },
    { value: "occupational", label: "Work-Life Balance", emoji: "⚖️", description: "Career satisfaction" }
  ];

  const addItem = (field, value, setter) => {
    if (value.trim() && !data[field]?.includes(value.trim())) {
      const currentItems = data[field] || [];
      updateData({ [field]: [...currentItems, value.trim()] });
      setter("");
    }
  };

  const removeItem = (field, index) => {
    const currentItems = data[field] || [];
    updateData({ [field]: currentItems.filter((_, i) => i !== index) });
  };

  const togglePresetItem = (field, value) => {
    const currentItems = data[field] || [];
    if (currentItems.includes(value)) {
      updateData({ [field]: currentItems.filter(item => item !== value) });
    } else {
      updateData({ [field]: [...currentItems, value] });
    }
  };

  const selectedGoals = data.health_goals || [];
  const selectedConditions = data.medical_conditions || [];
  const selectedMedications = data.medications || [];
  const selectedWellnessFocus = data.wellness_focus || [];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wellness journey</h2>
          <p className="text-gray-600">Help us understand your health goals and current situation</p>
        </div>

        {/* Health Goals */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Health Goals
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            What would you like to focus on for your health? (Optional)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {healthGoalOptions.map((goal) => (
              <button
                key={goal.value}
                onClick={() => togglePresetItem('health_goals', goal.value)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  selectedGoals.includes(goal.value)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-lg mb-1">{goal.emoji}</div>
                <div className="font-medium text-sm">{goal.label}</div>
                <div className="text-xs text-gray-500 mt-1">{goal.description}</div>
              </button>
            ))}
          </div>

          {/* Custom goal input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem('health_goals', customGoal, setCustomGoal);
                }
              }}
              placeholder="Add a custom health goal..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <button
              onClick={() => addItem('health_goals', customGoal, setCustomGoal)}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Medical Conditions and Medications */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Medical Conditions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Medical Conditions
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Any conditions we should be aware of? (Optional & Private)
            </p>

            <div className="grid grid-cols-1 gap-2 mb-4">
              {commonConditions.map((condition) => (
                <button
                  key={condition.value}
                  onClick={() => togglePresetItem('medical_conditions', condition.value)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    selectedConditions.includes(condition.value)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm">{condition.emoji} {condition.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem('medical_conditions', customCondition, setCustomCondition);
                  }
                }}
                placeholder="Add condition..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => addItem('medical_conditions', customCondition, setCustomCondition)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Medications */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Current Medications
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Medications you're currently taking (Optional & Private)
            </p>

            {/* Selected medications display */}
            {selectedMedications.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMedications.map((medication, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    💊 {medication}
                    <button
                      onClick={() => removeItem('medications', index)}
                      className="hover:text-blue-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={customMedication}
                onChange={(e) => setCustomMedication(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem('medications', customMedication, setCustomMedication);
                  }
                }}
                placeholder="Add medication..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => addItem('medications', customMedication, setCustomMedication)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Wellness Focus Areas */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wellness Focus Areas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Which areas of wellness are most important to you?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellnessFocusAreas.map((area) => (
              <button
                key={area.value}
                onClick={() => togglePresetItem('wellness_focus', area.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedWellnessFocus.includes(area.value)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-2">{area.emoji}</div>
                <div className="font-medium text-sm mb-1">{area.label}</div>
                <div className="text-xs text-gray-500">{area.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600">🔒</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Your Health Information is Private</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                All health information you share is encrypted and stored securely. We only use this 
                information to provide you with personalized wellness support and will never share 
                it with third parties without your explicit consent.
              </p>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            All health information is optional. You can always add or update this later in your profile settings.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthGoalsStep;
