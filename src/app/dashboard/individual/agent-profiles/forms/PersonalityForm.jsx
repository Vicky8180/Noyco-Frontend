

"use client";

import { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const PersonalityForm = ({ data = {}, updateData }) => {
  const [newTrait, setNewTrait] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newDislike, setNewDislike] = useState("");

  // Initialize arrays if they don't exist
  const safeData = {
    personality_traits: data.personality_traits || [],
    hobbies: data.hobbies || [],
    interests: data.interests || [],
    hates: data.hates || [],
    ...data
  };

  const suggestedTraits = [
    "Empathetic", "Professional", "Caring", "Analytical", "Optimistic",
    "Patient", "Supportive", "Energetic", "Calm", "Reliable"
  ];

  const suggestedHobbies = [
    "Reading", "Exercise", "Meditation", "Cooking", "Music",
    "Yoga", "Photography", "Learning", "Art", "Volunteering"
  ];

  const suggestedInterests = [
    "Nutrition", "Mental Health", "Fitness", "Wellness", "Technology",
    "Psychology", "Medicine", "Research", "Education", "Mindfulness"
  ];

  const addItem = (field, value, setter) => {
    if (value.trim() && !safeData[field].includes(value.trim())) {
      updateData({ [field]: [...safeData[field], value.trim()] });
      setter("");
    }
  };

  const removeItem = (field, index) => {
    updateData({ [field]: safeData[field].filter((_, i) => i !== index) });
  };

  const addSuggested = (field, value) => {
    if (!safeData[field].includes(value)) {
      updateData({ [field]: [...safeData[field], value] });
    }
  };

  const TagInput = ({ label, field, value, setValue, suggestions, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {/* Input Row */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem(field, value, setValue);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
        />
        <button
          type="button"
          onClick={() => addItem(field, value, setValue)}
          className="px-3 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-md transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Current Tags */}
      {safeData[field].length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {safeData[field].map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 text-xs"
            >
              {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
              <button
                type="button"
                onClick={() => removeItem(field, index)}
                className="hover:text-gray-600"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {suggestions && (
        <div className="flex flex-wrap gap-1">
          {suggestions
            .filter(suggestion => !safeData[field].includes(suggestion))
            .slice(0, 6)
            .map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSuggested(field, suggestion)}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs hover:bg-gray-200 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Personality & Interests</h2>
        <p className="text-sm text-gray-600 mt-1">Define your agent's character and preferences</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          <TagInput
            label="Personality Traits"
            field="personality_traits"
            value={newTrait}
            setValue={setNewTrait}
            suggestions={suggestedTraits}
            placeholder="Add personality trait"
          />

          <TagInput
            label="Hobbies & Activities"
            field="hobbies"
            value={newHobby}
            setValue={setNewHobby}
            suggestions={suggestedHobbies}
            placeholder="Add hobby or activity"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <TagInput
            label="Professional Interests"
            field="interests"
            value={newInterest}
            setValue={setNewInterest}
            suggestions={suggestedInterests}
            placeholder="Add professional interest"
          />

          <TagInput
            label="Dislikes & Concerns"
            field="hates"
            value={newDislike}
            setValue={setNewDislike}
            suggestions={null}
            placeholder="Add dislikes or concerns"
          />
        </div>
      </div>

      {/* Preview Section */}
      {(safeData.personality_traits.length > 0 || safeData.hobbies.length > 0 || safeData.interests.length > 0) && (
        <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👁</span>
            </div>
            <h4 className="font-medium text-gray-900 text-sm">Personality Preview</h4>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {data.name || "Your agent"} is{" "}
            {safeData.personality_traits.length > 0 
              ? safeData.personality_traits.slice(0, 2).join(" and ").toLowerCase() 
              : "professional"}{" "}
            {safeData.hobbies.length > 0 && (
              <>and enjoys {safeData.hobbies.slice(0, 2).join(" and ").toLowerCase()}</>
            )}. 
            {safeData.interests.length > 0 && (
              <> They're particularly interested in {safeData.interests.slice(0, 2).join(" and ").toLowerCase()}.</>
            )}
          </p>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border border-accent p-4">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-gray-800 text-xs">💡</span>
          </div>
          <div className="text-sm text-gray-800">
            <p className="font-medium mb-1">Personality Tips:</p>
            <p>Add 3-5 personality traits and interests to make your agent more engaging. Use dislikes to define boundaries and sensitive topics to avoid.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityForm;