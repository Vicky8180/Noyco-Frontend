

"use client";

import { useState } from "react";
import { PlusIcon, XMarkIcon, HeartIcon } from "@heroicons/react/24/outline";

const RelationshipsForm = ({ data = {}, updateData }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLovedOne, setNewLovedOne] = useState({
    name: "",
    relation: "",
    memories: []
  });
  const [newMemory, setNewMemory] = useState("");

  // Initialize arrays if they don't exist
  const safeData = {
    loved_ones: data.loved_ones || [],
    ...data
  };

  const relationshipTypes = [
    "Parent", "Child", "Spouse", "Partner", "Sibling", "Grandparent", 
    "Grandchild", "Friend", "Colleague", "Mentor", "Pet", "Other"
  ];

  const addLovedOne = () => {
    console.log('DEBUG - addLovedOne called');
    console.log('DEBUG - current newLovedOne:', newLovedOne);
    console.log('DEBUG - newLovedOne.memories:', newLovedOne.memories);
    console.log('DEBUG - memories length:', newLovedOne.memories.length);
    
    if (newLovedOne.name.trim()) {
      const lovedOneToAdd = { ...newLovedOne, name: newLovedOne.name.trim() };
      console.log('DEBUG - loved one to add:', lovedOneToAdd);
      
      updateData({ 
        loved_ones: [...safeData.loved_ones, lovedOneToAdd] 
      });
      setNewLovedOne({ name: "", relation: "", memories: [] });
      setShowAddForm(false);
    }
  };

  const removeLovedOne = (index) => {
    updateData({ 
      loved_ones: safeData.loved_ones.filter((_, i) => i !== index) 
    });
  };

  const addMemoryToNew = () => {
    console.log('DEBUG - addMemoryToNew called with:', newMemory);
    console.log('DEBUG - current memories before add:', newLovedOne.memories);
    
    if (newMemory.trim()) {
      const updatedMemories = [...newLovedOne.memories, newMemory.trim()];
      console.log('DEBUG - updated memories:', updatedMemories);
      
      setNewLovedOne(prev => ({
        ...prev,
        memories: updatedMemories
      }));
      setNewMemory("");
    }
  };

  const removeMemoryFromNew = (index) => {
    setNewLovedOne(prev => ({
      ...prev,
      memories: prev.memories.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Important Relationships</h2>
        <p className="text-sm text-gray-600 mt-1">Add people who matter most to you for personalized interactions</p>
      </div>

      {/* Current Loved Ones */}
      {safeData.loved_ones.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HeartIcon className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-medium text-gray-900">
              Important People ({safeData.loved_ones.length})
            </h3>
          </div>
          
          <div className="grid gap-3">
            {safeData.loved_ones.map((person, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{person.name}</h4>
                    {person.relation && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs mt-1">
                        {person.relation}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeLovedOne(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {person.memories.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Memories:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {person.memories.map((memory, memIndex) => (
                        <li key={memIndex} className="flex items-start gap-1">
                          <span className="text-red-400 mt-0.5 text-xs">•</span>
                          <span>{memory}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Person */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-accent text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium text-sm">Add Important Person</span>
        </button>
      ) : (
        <div className="bg-beige border border-accent p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Add Important Person</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewLovedOne({ name: "", relation: "", memories: [] });
                setNewMemory("");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Name and Relation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newLovedOne.name}
                  onChange={(e) => setNewLovedOne(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter their name"
                  className="w-full px-3 py-2 border border-accent focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Relationship</label>
                <select
                  value={newLovedOne.relation}
                  onChange={(e) => setNewLovedOne(prev => ({ ...prev, relation: e.target.value }))}
                  className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm bg-beige hover:bg-gradient-to-r hover:from-[#E6D3E7] hover:via-[#F6D9D5] hover:to-[#D6E3EC]"
                >
                  <option value="">Select relationship</option>
                  {relationshipTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Memories */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Special Memories (Required)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Add at least one memory to create this relationship
              </p>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newMemory}
                  onChange={(e) => {
                    console.log('DEBUG - Memory input changed:', e.target.value);
                    setNewMemory(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    console.log('DEBUG - Key pressed:', e.key);
                    if (e.key === "Enter") {
                      e.preventDefault();
                      console.log('DEBUG - Enter key pressed, calling addMemoryToNew');
                      addMemoryToNew();
                    }
                  }}
                  placeholder="Add a special memory..."
                  className="flex-1 px-3 py-2 border border-accent focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    console.log('DEBUG - Add memory button clicked');
                    addMemoryToNew();
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 rounded-lg hover:shadow-md transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {newLovedOne.memories.length > 0 ? (
                <div className="space-y-1">
                  {newLovedOne.memories.map((memory, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                      <span className="flex-1 text-xs text-gray-700">{memory}</span>
                      <button
                        type="button"
                        onClick={() => removeMemoryFromNew(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    No memories added yet. Please add at least one memory before creating this relationship.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={addLovedOne}
                disabled={!newLovedOne.name.trim() || newLovedOne.memories.length === 0}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Add Person {newLovedOne.memories.length === 0 && newLovedOne.name.trim() && "(Add at least one memory first)"}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewLovedOne({ name: "", relation: "", memories: [] });
                  setNewMemory("");
                }}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border border-accent p-4">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-gray-800 text-xs">💡</span>
          </div>
          <div className="text-sm text-gray-800">
            <p className="font-medium mb-1">Relationship Tips:</p>
            <p>Your agent will remember these people in conversations and can provide more personalized support by understanding your relationships and support system.</p>
          </div>
        </div>
      </div>

      {/* Skip Option */}
      {safeData.loved_ones.length === 0 && !showAddForm && (
        <div className="text-center py-2">
          <p className="text-gray-500 text-xs">
            You can skip this step and add important people later if you prefer.
          </p>
        </div>
      )}
    </div>
  );
};

export default RelationshipsForm;