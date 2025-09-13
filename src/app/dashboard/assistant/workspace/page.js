"use client";

import { useState } from "react";

export default function AssistantWorkspacePage() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleOptionSelect = (option) => {
    if (selectedOption === option) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOption(option);
      setIsTransitioning(false);
    }, 200);
  };

  const options = [
    {
      id: 'call',
      title: 'Voice Call',
      subtitle: 'Connect with patients through voice',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: 'from-green-400 to-green-600',
      description: 'Real-time voice conversations with advanced AI assistance',
      features: ['HD Voice Quality', 'Real-time Transcription', 'Smart Suggestions', 'Call Recording']
    },
    {
      id: 'chat',
      title: 'Text Chat',
      subtitle: 'Communicate through messages',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: 'from-blue-400 to-blue-600',
      description: 'Intelligent text-based conversations with contextual awareness',
      features: ['Instant Messaging', 'Smart Replies', 'File Sharing', 'Message History']
    }
  ];

    return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Workspace
            </h1>
            <p className="text-lg text-gray-600 font-normal">
              Choose how you'd like to connect with patients
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Options Grid */}
        <div className="space-y-6">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] ${
                selectedOption?.id === option.id
                  ? 'border-blue-200 shadow-2xl shadow-blue-500/20 bg-white'
                  : 'border-gray-200/60 hover:border-gray-300/80 hover:shadow-xl shadow-lg'
              }`}
            >
              {/* Selection Indicator */}
              {selectedOption?.id === option.id && (
                <div className="absolute top-6 right-6">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${option.color} mb-6 shadow-lg`}>
                <div className="text-white">
                  {option.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {option.subtitle}
                  </p>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {option.description}
                </p>

                {/* Features */}
                <div className="pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/60 shadow-xl overflow-hidden">
            {selectedOption ? (
              <div className={`transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {/* Header */}
                <div className={`p-8 bg-gradient-to-br ${selectedOption.color} text-white`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      {selectedOption.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {selectedOption.title}
                      </h3>
                      <p className="text-white/80 font-medium">
                        Ready to connect
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-800 font-semibold text-sm">
                        System Ready
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-900 tracking-tight">
                        Quick Actions
                      </h4>
                      <div className="space-y-2">
                        {selectedOption.id === 'call' ? (
                          <>
                            <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">Start New Call</div>
                                <div className="text-sm text-gray-600">Begin voice consultation</div>
                              </div>
                            </button>
                            <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">Call History</div>
                                <div className="text-sm text-gray-600">View previous calls</div>
                              </div>
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">New Conversation</div>
                                <div className="text-sm text-gray-600">Start text chat</div>
                              </div>
                            </button>
                            <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">Chat History</div>
                                <div className="text-sm text-gray-600">View conversations</div>
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-2">
                  Select Communication Method
                </h3>
                <p className="text-gray-600 font-medium">
                  Choose call or chat to get started with patient consultations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
