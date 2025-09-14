'use client';
import { useState, useEffect } from 'react';
import { useAgentMetrics } from '../../../../../store/hooks';
import { 
  TrendingUpIcon, 
  TargetIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ArrowRightIcon,
  InfoIcon 
} from 'lucide-react';
import { MetricCard } from './MetricCards';
import AgentGoalCharts from './AgentGoalCharts';
import AgentGoalsList from './AgentGoalsList';

export default function AgentMetrics() {
  const { 
    agentTypes, 
    agentMetrics, 
    loading, 
    error, 
    fetchAgentTypes,
    fetchAgentMetrics,
    fetchAgentAnalyticsSummary 
  } = useAgentMetrics();
  
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);

  const timeframes = [
    { value: '1d', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '14d', label: '14 Days' },
    { value: '30d', label: '30 Days' }
  ];

  useEffect(() => {
    fetchAgentTypes();
    loadAnalyticsSummary();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      fetchAgentMetrics(selectedAgent, selectedTimeframe);
    }
  }, [selectedAgent, selectedTimeframe]);

  const loadAnalyticsSummary = async () => {
    try {
      const summary = await fetchAgentAnalyticsSummary(selectedTimeframe);
      setAnalyticsSummary(summary);
    } catch (err) {
      console.error('Failed to load analytics summary:', err);
    }
  };

  const handleAgentChange = (e) => {
    const agentType = e.target.value;
    setSelectedAgent(agentType);
    setSelectedGoal(null); // Clear selected goal when changing agent
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    loadAnalyticsSummary();
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  if (loading && !agentMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium mb-2">Error Loading Agent Metrics</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-beige p-6   ">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agent Goal Analytics</h2>
            <p className="text-gray-600 mt-2">
              Monitor your AI health agents' performance and track goal progress over time
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
            {/* Step indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  selectedAgent ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium text-gray-700">Select Agent Type</span>
              </div>
              <div className="w-6 h-0.5 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  selectedGoal ? 'bg-green-500 text-white' : selectedAgent ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  2
                </div>
                <span className={`text-sm font-medium ${selectedAgent ? 'text-gray-700' : 'text-gray-400'}`}>
                  Choose Goal for Details
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Agent Type Selector */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Agent Type</label>
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-beige"
                  value={selectedAgent}
                  onChange={handleAgentChange}
                >
                  <option value="">Choose an agent type...</option>
                  {agentTypes.map((agent) => (
                    <option key={agent.agent_type} value={agent.agent_type}>
                      {agent.display_name} ({agent.total_goals} goals)
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeframe Selector */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Time Range</label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe.value}
                      onClick={() => handleTimeframeChange(timeframe.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        selectedTimeframe === timeframe.value
                          ? 'bg-beige text-gray-900 '
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {timeframe.label.replace('Last ', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {!selectedAgent ? (
        /* Agent Selection Prompt */
        <div className="'bg-beige  p-8 text-center ">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TargetIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Your Agent</h3>
            <p className="text-gray-600 mb-6">
              Select an agent type from the dropdown above to explore detailed goal metrics, progress tracking, and performance analytics.
            </p>
            
            {agentTypes.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Available Agents:</p>
                <div className="grid grid-cols-1 gap-2">
                  {agentTypes.map((agent) => (
                    <button
                      key={agent.agent_type}
                      onClick={() => setSelectedAgent(agent.agent_type)}
                      className="flex items-center justify-between p-3 bg-beige rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-blue-700">
                        {agent.display_name}
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-blue-600">
                        {agent.total_goals} goals
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  No agents found. Create some goals with your AI agents to start tracking metrics.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : !agentMetrics ? (
        /* Loading State */
        <div className="bg-beige rounded-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Agent Data</h3>
            <p className="text-gray-600">Fetching {selectedAgent} metrics and analytics...</p>
          </div>
        </div>
      ) : (
        /* Agent Metrics Display */
        <div className="space-y-6">
          {/* Agent Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Goals"
              value={agentMetrics.summary.total_goals}
              subtitle={`Across ${agentMetrics.agents.length} agent instances`}
              icon={<TargetIcon className="w-6 h-6" />}
              color="blue"
              trend={{
                direction: 'up',
                value: '+12%',
                period: 'vs last period'
              }}
            />
            <MetricCard
              title="Active Goals"
              value={agentMetrics.summary.active_goals}
              subtitle={`${((agentMetrics.summary.active_goals / agentMetrics.summary.total_goals) * 100 || 0).toFixed(1)}% of total`}
              icon={<ClockIcon className="w-6 h-6" />}
              color="green"
              trend={{
                direction: 'up',
                value: '+5%',
                period: 'vs last period'
              }}
            />
            <MetricCard
              title="Completed Goals"
              value={agentMetrics.summary.completed_goals}
              subtitle={`${agentMetrics.summary.completion_rate.toFixed(1)}% completion rate`}
              icon={<CheckCircleIcon className="w-6 h-6" />}
              color="purple"
              trend={{
                direction: 'up',
                value: '+8%',
                period: 'vs last period'
              }}
            />
            <MetricCard
              title="Avg Goals/Agent"
              value={agentMetrics.summary.average_goals_per_agent.toFixed(1)}
              subtitle="Goals per agent instance"
              icon={<TrendingUpIcon className="w-6 h-6" />}
              color="orange"
            />
          </div>

          {/* Instruction Banner */}
          {!selectedGoal && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Select a Goal for Detailed Analytics</h4>
                  <p className="text-sm text-blue-700">
                    Click on any goal in the list below to view progress charts, check-in patterns, and mood trends.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goals List */}
            <div className="lg:col-span-1">
              <AgentGoalsList 
                agentMetrics={agentMetrics}
                selectedGoal={selectedGoal}
                onGoalSelect={handleGoalSelect}
                timeframe={selectedTimeframe}
              />
            </div>

            {/* Charts and Progress */}
            <div className="lg:col-span-1">
              <AgentGoalCharts 
                agentMetrics={agentMetrics}
                selectedGoal={selectedGoal}
                selectedAgent={selectedAgent}
                timeframe={selectedTimeframe}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
