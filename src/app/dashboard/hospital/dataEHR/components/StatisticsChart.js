"use client";

import React from 'react';

const StatisticsChart = ({ statistics }) => {
  if (!statistics) return null;

  const { gender_distribution, resource_counts } = statistics;

  // Calculate percentages for gender distribution
  const totalPatients = statistics.total_patients || 0;
  const genderData = Object.entries(gender_distribution || {}).map(([gender, count]) => ({
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    count,
    percentage: totalPatients > 0 ? (count / totalPatients) * 100 : 0
  }));

  // Resource data for visualization
  const resourceData = Object.entries(resource_counts || {}).map(([resource, count]) => ({
    resource: resource.charAt(0).toUpperCase() + resource.slice(1),
    count
  }));

  const maxResourceCount = Math.max(...resourceData.map(r => r.count));

  return (
    <div className="space-y-8">
      {/* Gender Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Gender Distribution</h3>
        <div className="space-y-4">
          {genderData.map((item, index) => {
            const colors = [
              'bg-blue-500',
              'bg-pink-500', 
              'bg-purple-500',
              'bg-gray-500'
            ];
            return (
              <div key={item.gender} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-700">
                  {item.gender}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full ${colors[index]} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.count}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resource Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Clinical Data Distribution</h3>
        <div className="space-y-4">
          {resourceData.map((item, index) => {
            const colors = [
              'bg-green-500',
              'bg-blue-500',
              'bg-orange-500',
              'bg-purple-500'
            ];
            const percentage = maxResourceCount > 0 ? (item.count / maxResourceCount) * 100 : 0;
            
            return (
              <div key={item.resource} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {item.resource}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full ${colors[index]} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart; 