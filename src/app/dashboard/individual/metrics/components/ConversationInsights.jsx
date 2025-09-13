'use client';
import { useState, useEffect } from 'react';
import { MessageCircleIcon, ClockIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { useMetrics } from '../../../../../store/hooks';
import ConversationList from './ConversationList';
import ConversationDetail from './ConversationDetail';

export default function ConversationInsights({ onConversationSelect }) {
  const { agentTypes, fetchAgentTypes } = useMetrics();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedAgentType, setSelectedAgentType] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  const timeframes = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' }
  ];

  useEffect(() => {
    fetchAgentTypes();
  }, []);

  const handleAgentTypeChange = (e) => {
    const agentType = e.target.value;
    setSelectedAgentType(agentType);
    setSelectedConversation(null); // Clear selected conversation when switching agent types
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    if (onConversationSelect) {
      onConversationSelect(conversation);
    }
  };

  const handleCloseConversation = () => {
    setSelectedConversation(null);
  };

  const getAgentTypeDisplayName = (agentType) => {
    const names = {
      'loneliness': 'Loneliness Agent',
      'accountability': 'Accountability Agent', 
      'mental_therapist': 'Mental Therapist',
      'nutrition': 'Nutrition Agent',
      'medication': 'Medication Agent'
    };
    return names[agentType] || agentType;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Conversation Insights</h2>

        {/* Right side wrapper */}
        <div className="flex items-center gap-3">
          <select 
            className="px-3 py-1 text-sm bg-gray-100 font-medium rounded-md transition-colors text-gray-600 hover:text-gray-900"
            value={selectedAgentType}
            onChange={handleAgentTypeChange}
          >
            <option value="">All Agents</option>
            {agentTypes.map((agentType) => (
              <option key={agentType.agent_type} value={agentType.agent_type}>
                {getAgentTypeDisplayName(agentType.agent_type)} ({agentType.count})
              </option>
            ))}
          </select>

          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Left: Conversation List */}
        <div className="overflow-hidden">
          <ConversationList 
            selectedAgentType={selectedAgentType}
            onConversationSelect={handleConversationSelect}
          />
        </div>

        {/* Right: Conversation Detail */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {selectedConversation ? (
            <ConversationDetail 
              conversation={selectedConversation}
              onClose={handleCloseConversation}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircleIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p>Select a conversation from the left panel to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
