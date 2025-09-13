"use client";

import { motion } from "framer-motion";
import { SunIcon, MoonIcon, BriefcaseIcon, ClockIcon } from "@heroicons/react/24/outline";

const LifestyleStep = ({ data, updateData }) => {
  const workScheduleTypes = [
    { value: "traditional", label: "Traditional 9-5", emoji: "🕘", description: "Standard business hours" },
    { value: "flexible", label: "Flexible Hours", emoji: "⏰", description: "Varied work schedule" },
    { value: "remote", label: "Work from Home", emoji: "🏠", description: "Remote work setup" },
    { value: "shift_work", label: "Shift Work", emoji: "🔄", description: "Rotating or night shifts" },
    { value: "freelance", label: "Freelance/Contract", emoji: "💼", description: "Independent work" },
    { value: "part_time", label: "Part Time", emoji: "⏱️", description: "Less than full time" },
    { value: "student", label: "Student", emoji: "📚", description: "In school/education" },
    { value: "retired", label: "Retired", emoji: "🌴", description: "No longer working" },
    { value: "unemployed", label: "Between Jobs", emoji: "🔍", description: "Currently seeking work" },
    { value: "other", label: "Other", emoji: "❓", description: "Different arrangement" }
  ];

  const sleepPatterns = [
    { value: "early_bird", label: "Early Bird", emoji: "🌅", time: "Sleep: 9-10 PM, Wake: 5-6 AM", description: "Early to bed, early to rise" },
    { value: "regular", label: "Regular Schedule", emoji: "😴", time: "Sleep: 10-11 PM, Wake: 6-7 AM", description: "Standard sleep schedule" },
    { value: "night_owl", label: "Night Owl", emoji: "🦉", time: "Sleep: 11 PM-1 AM, Wake: 7-9 AM", description: "Prefer staying up late" },
    { value: "irregular", label: "Irregular", emoji: "🔄", time: "Varies day to day", description: "No consistent pattern" }
  ];

  const activityLevels = [
    { value: "sedentary", label: "Mostly Sedentary", emoji: "🪑", description: "Desk job, limited exercise" },
    { value: "lightly_active", label: "Lightly Active", emoji: "🚶‍♀️", description: "Some walking, occasional exercise" },
    { value: "moderately_active", label: "Moderately Active", emoji: "🏃‍♂️", description: "Regular exercise 3-4x/week" },
    { value: "very_active", label: "Very Active", emoji: "💪", description: "Daily exercise or physical job" },
    { value: "extremely_active", label: "Extremely Active", emoji: "🏋️‍♀️", description: "Intense daily training" }
  ];

  const stressLevels = [
    { value: "low", label: "Low Stress", emoji: "😌", description: "Generally calm and relaxed" },
    { value: "moderate", label: "Moderate Stress", emoji: "😐", description: "Some stress but manageable" },
    { value: "high", label: "High Stress", emoji: "😰", description: "Often feeling overwhelmed" },
    { value: "varies", label: "Varies", emoji: "🔄", description: "Stress levels change frequently" }
  ];

  const handleUpdate = (category, field, value) => {
    const currentData = data[category] || {};
    updateData({
      [category]: {
        ...currentData,
        [field]: value
      }
    });
  };

  const currentWorkSchedule = data.work_schedule || {};
  const currentSleepPattern = data.sleep_pattern || {};
  const currentDailyRoutine = data.daily_routine || {};

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SunIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your daily patterns</h2>
          <p className="text-gray-600">Help us understand your lifestyle and routine</p>
        </div>

        {/* Work Schedule */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <BriefcaseIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Work Schedule</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            What's your typical work or daily schedule like?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workScheduleTypes.map((schedule) => (
              <button
                key={schedule.value}
                onClick={() => handleUpdate('work_schedule', 'type', schedule.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  currentWorkSchedule.type === schedule.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-2">{schedule.emoji}</div>
                <div className="font-medium text-sm mb-1">{schedule.label}</div>
                <div className="text-xs text-gray-500">{schedule.description}</div>
              </button>
            ))}
          </div>

          {/* Work hours input */}
          {currentWorkSchedule.type && currentWorkSchedule.type !== 'retired' && currentWorkSchedule.type !== 'unemployed' && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typical Start Time
                </label>
                <input
                  type="time"
                  value={currentWorkSchedule.start_time || ""}
                  onChange={(e) => handleUpdate('work_schedule', 'start_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typical End Time
                </label>
                <input
                  type="time"
                  value={currentWorkSchedule.end_time || ""}
                  onChange={(e) => handleUpdate('work_schedule', 'end_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sleep Pattern */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <MoonIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sleep Pattern</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            When do you typically sleep and wake up?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sleepPatterns.map((pattern) => (
              <button
                key={pattern.value}
                onClick={() => handleUpdate('sleep_pattern', 'type', pattern.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  currentSleepPattern.type === pattern.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{pattern.emoji}</div>
                  <div>
                    <div className="font-medium text-sm mb-1">{pattern.label}</div>
                    <div className="text-xs text-blue-600 font-medium mb-1">{pattern.time}</div>
                    <div className="text-xs text-gray-500">{pattern.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Sleep quality */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your sleep quality? (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={currentSleepPattern.quality || 5}
              onChange={(e) => handleUpdate('sleep_pattern', 'quality', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Poor (1)</span>
              <span className="font-medium text-indigo-600">
                Current: {currentSleepPattern.quality || 5}
              </span>
              <span>Excellent (10)</span>
            </div>
          </div>
        </div>

        {/* Activity Level and Stress */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Activity Level */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Level
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              How active are you on a typical day?
            </p>

            <div className="space-y-3">
              {activityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleUpdate('daily_routine', 'activity_level', level.value)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    currentDailyRoutine.activity_level === level.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{level.emoji}</span>
                    <div>
                      <div className="font-medium text-sm">{level.label}</div>
                      <div className="text-xs text-gray-500">{level.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Stress Level
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              How would you describe your typical stress level?
            </p>

            <div className="space-y-3">
              {stressLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleUpdate('daily_routine', 'stress_level', level.value)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    currentDailyRoutine.stress_level === level.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{level.emoji}</span>
                    <div>
                      <div className="font-medium text-sm">{level.label}</div>
                      <div className="text-xs text-gray-500">{level.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Routine Notes */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Daily Routine Notes</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Any specific routines or patterns that are important to you? (Optional)
          </p>

          <textarea
            value={currentDailyRoutine.notes || ""}
            onChange={(e) => handleUpdate('daily_routine', 'notes', e.target.value)}
            placeholder="e.g., Morning meditation, evening walks, meal times, medication schedules..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Lifestyle Summary */}
        {(currentWorkSchedule.type || currentSleepPattern.type) && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600">📋</span>
              </div>
              <div>
                <h4 className="font-semibold text-orange-900 mb-2">Lifestyle Summary</h4>
                <p className="text-orange-800 text-sm leading-relaxed">
                  Your AI companion will understand that you have a{" "}
                  {currentWorkSchedule.type && (
                    <span className="font-medium">
                      {workScheduleTypes.find(w => w.value === currentWorkSchedule.type)?.label.toLowerCase()} schedule
                    </span>
                  )}
                  {currentSleepPattern.type && (
                    <span>
                      {currentWorkSchedule.type ? " and are a " : "you are a "}
                      <span className="font-medium">
                        {sleepPatterns.find(s => s.value === currentSleepPattern.type)?.label.toLowerCase()}
                      </span>
                    </span>
                  )}
                  . This helps provide more relevant timing and suggestions for your wellness activities.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            This information helps us provide better-timed support and suggestions. You can always update this later.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LifestyleStep;
