"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusIcon, XMarkIcon, HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const RelationshipsStep = ({ data, updateData }) => {
  const [newLovedOne, setNewLovedOne] = useState({ name: "", relation: "", memories: [""] });
  const [showAddForm, setShowAddForm] = useState(false);

  const relationshipTypes = [
    { value: "spouse", label: "Spouse/Partner", emoji: "💑" },
    { value: "parent", label: "Parent", emoji: "👨‍👩‍👧‍👦" },
    { value: "child", label: "Child", emoji: "👶" },
    { value: "sibling", label: "Sibling", emoji: "👫" },
    { value: "friend", label: "Friend", emoji: "👥" },
    { value: "grandparent", label: "Grandparent", emoji: "👴👵" },
    { value: "other_family", label: "Other Family", emoji: "👪" },
    { value: "colleague", label: "Colleague", emoji: "👔" },
    { value: "caregiver", label: "Caregiver", emoji: "🩺" },
    { value: "other", label: "Other", emoji: "❤️" }
  ];

  const supportNetworkTypes = [
    { value: "family", label: "Family Members", emoji: "👨‍👩‍👧‍👦", description: "Close family support" },
    { value: "friends", label: "Close Friends", emoji: "👥", description: "Trusted friends" },
    { value: "healthcare", label: "Healthcare Team", emoji: "⚕️", description: "Doctors, therapists, etc." },
    { value: "community", label: "Community Groups", emoji: "🏘️", description: "Local support groups" },
    { value: "online", label: "Online Communities", emoji: "💻", description: "Digital support networks" },
    { value: "spiritual", label: "Spiritual Community", emoji: "🙏", description: "Religious or spiritual support" },
    { value: "professional", label: "Professional Support", emoji: "💼", description: "Counselors, coaches" },
    { value: "none", label: "Prefer not to share", emoji: "🔒", description: "Keep this private" }
  ];

  const addLovedOne = () => {
    if (newLovedOne.name.trim() && newLovedOne.relation) {
      const lovedOnes = data.loved_ones || [];
      const lovedOneToAdd = {
        name: newLovedOne.name.trim(),
        relation: newLovedOne.relation,
        memories: newLovedOne.memories.filter(memory => memory.trim() !== "")
      };
      
      updateData({ loved_ones: [...lovedOnes, lovedOneToAdd] });
      setNewLovedOne({ name: "", relation: "", memories: [""] });
      setShowAddForm(false);
    }
  };

  const removeLovedOne = (index) => {
    const lovedOnes = data.loved_ones || [];
    updateData({ loved_ones: lovedOnes.filter((_, i) => i !== index) });
  };

  const addMemoryField = () => {
    setNewLovedOne({
      ...newLovedOne,
      memories: [...newLovedOne.memories, ""]
    });
  };

  const updateMemory = (index, value) => {
    const newMemories = [...newLovedOne.memories];
    newMemories[index] = value;
    setNewLovedOne({ ...newLovedOne, memories: newMemories });
  };

  const removeMemory = (index) => {
    if (newLovedOne.memories.length > 1) {
      const newMemories = newLovedOne.memories.filter((_, i) => i !== index);
      setNewLovedOne({ ...newLovedOne, memories: newMemories });
    }
  };

  const toggleSupportType = (type) => {
    const currentSupport = data.support_network || [];
    if (currentSupport.includes(type)) {
      updateData({ support_network: currentSupport.filter(item => item !== type) });
    } else {
      // If selecting "none", clear all others
      if (type === 'none') {
        updateData({ support_network: ['none'] });
      } else {
        // If selecting anything else, remove "none"
        const newSupport = currentSupport.filter(item => item !== 'none');
        updateData({ support_network: [...newSupport, type] });
      }
    }
  };

  const lovedOnes = data.loved_ones || [];
  const supportNetwork = data.support_network || [];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartIcon className="w-8 h-8 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your support network</h2>
          <p className="text-gray-600">Tell us about the important people in your life</p>
        </div>

        {/* Loved Ones */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Important People in Your Life
            </h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Person</span>
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Share details about people who matter to you. This helps your AI companion understand your relationships and provide more personalized support.
          </p>

          {/* Existing Loved Ones */}
          {lovedOnes.length > 0 && (
            <div className="space-y-4 mb-6">
              {lovedOnes.map((person, index) => (
                <div key={index} className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">
                          {relationshipTypes.find(r => r.value === person.relation)?.emoji || "❤️"}
                        </span>
                        <h4 className="font-semibold text-gray-900">{person.name}</h4>
                        <span className="text-sm text-gray-500">
                          ({relationshipTypes.find(r => r.value === person.relation)?.label || person.relation})
                        </span>
                      </div>
                      {person.memories && person.memories.length > 0 && (
                        <div className="text-sm text-gray-700">
                          <strong>Memories:</strong> {person.memories.join(", ")}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeLovedOne(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Loved One Form */}
          {showAddForm && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-4">
              <h4 className="font-semibold text-gray-900 mb-4">Add Someone Important</h4>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newLovedOne.name}
                    onChange={(e) => setNewLovedOne({ ...newLovedOne, name: e.target.value })}
                    placeholder="Enter their name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={newLovedOne.relation}
                    onChange={(e) => setNewLovedOne({ ...newLovedOne, relation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select relationship</option>
                    {relationshipTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.emoji} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Memories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Memories or Details (Optional)
                  </label>
                  {newLovedOne.memories.map((memory, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={memory}
                        onChange={(e) => updateMemory(index, e.target.value)}
                        placeholder="Share a memory or detail about them..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      />
                      {newLovedOne.memories.length > 1 && (
                        <button
                          onClick={() => removeMemory(index)}
                          className="px-2 py-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addMemoryField}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    + Add another memory
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={addLovedOne}
                    disabled={!newLovedOne.name.trim() || !newLovedOne.relation}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Person
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewLovedOne({ name: "", relation: "", memories: [""] });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {lovedOnes.length === 0 && !showAddForm && (
            <div className="text-center py-8 text-gray-500">
              <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No loved ones added yet. Click "Add Person" to get started.</p>
            </div>
          )}
        </div>

        {/* Support Network */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Support Network
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            What types of support do you have in your life? (Select all that apply)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportNetworkTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => toggleSupportType(type.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  supportNetwork.includes(type.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-2">{type.emoji}</div>
                <div className="font-medium text-sm mb-1">{type.label}</div>
                <div className="text-xs text-gray-500">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6 border border-pink-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-pink-600">🔒</span>
            </div>
            <div>
              <h4 className="font-semibold text-pink-900 mb-2">Your Relationships are Private</h4>
              <p className="text-pink-800 text-sm leading-relaxed">
                Information about your loved ones and support network is kept completely private 
                and secure. We use this only to provide more personalized and meaningful conversations 
                with your AI companion.
              </p>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            This information is optional and helps create more meaningful conversations. You can always add or update this later.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RelationshipsStep;
