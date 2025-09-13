"use client";

import { PlusIcon } from "@heroicons/react/24/outline";

const EmptyState = ({ onCreateProfile }) => {
  return (
    <div className="mt-16 text-center">
      <div className="max-w-md mx-auto">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] opacity-80 flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
          </div>
          
          {/* Floating elements for visual appeal */}
          <div className="absolute top-4 left-8 w-8 h-8 bg-yellow-100 flex items-center justify-center animate-pulse">
            <span className="text-lg">💡</span>
          </div>
          <div className="absolute top-8 right-12 w-6 h-6 bg-green-100 flex items-center justify-center animate-pulse delay-300">
            <span className="text-sm">✨</span>
          </div>
          <div className="absolute bottom-4 left-12 w-6 h-6 bg-purple-100 flex items-center justify-center animate-pulse delay-700">
            <span className="text-sm">🎯</span>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Create Your First Agent Profile
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Design personalized AI agents with unique personalities, traits, and preferences. 
          Each profile can be tailored for different health and wellness scenarios.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mb-8 text-left">
          <div className="flex items-center gap-3 p-3 bg-blue-50">
            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600">👤</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Personalized Personalities</p>
              <p className="text-sm text-gray-600">Define traits, hobbies, and preferences</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50">
            <div className="w-8 h-8 bg-green-100 flex items-center justify-center">
              <span className="text-green-600">❤️</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Emotional Connections</p>
              <p className="text-sm text-gray-600">Add loved ones and meaningful stories</p>
            </div>
          </div>
          
        </div>

        {/* CTA Button */}
        <button
          onClick={onCreateProfile}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create Your First Profile</span>
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          Takes just 2-3 minutes to set up
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
