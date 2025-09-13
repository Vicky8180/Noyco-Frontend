import React from 'react';

export default function PatientStatistics({ stats }) {
  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-700 font-medium">Total Patients</div>
          <div className="mt-1 text-2xl font-bold text-blue-800">
            {stats.total_patients || 0}
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-700 font-medium">Active Conditions</div>
          <div className="mt-1 text-2xl font-bold text-green-800">
            {stats.active_conditions || 0}
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="text-sm text-amber-700 font-medium">Observations</div>
          <div className="mt-1 text-2xl font-bold text-amber-800">
            {stats.total_observations || 0}
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-700 font-medium">Encounters</div>
          <div className="mt-1 text-2xl font-bold text-purple-800">
            {stats.total_encounters || 0}
          </div>
        </div>
      </div>
      
      {/* Gender Distribution */}
      {stats.gender_distribution && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Gender Distribution</h3>
          <div className="flex items-center space-x-1">
            {/* Male */}
            <div 
              className="bg-blue-500 h-4 rounded-l-full"
              style={{ 
                width: `${((stats.gender_distribution.male || 0) / stats.total_patients) * 100}%` 
              }}
            ></div>
            {/* Female */}
            <div 
              className="bg-pink-500 h-4"
              style={{ 
                width: `${((stats.gender_distribution.female || 0) / stats.total_patients) * 100}%` 
              }}
            ></div>
            {/* Other/Unknown */}
            <div 
              className="bg-gray-500 h-4 rounded-r-full"
              style={{ 
                width: `${((stats.gender_distribution.other || 0) / stats.total_patients) * 100}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <div>Male: {stats.gender_distribution.male || 0}</div>
            <div>Female: {stats.gender_distribution.female || 0}</div>
            <div>Other: {stats.gender_distribution.other || 0}</div>
          </div>
        </div>
      )}
      
      {/* Age Distribution */}
      {stats.age_distribution && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Age Distribution</h3>
          <div className="space-y-2">
            {Object.entries(stats.age_distribution).map(([ageRange, count]) => (
              <div key={ageRange}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{ageRange}</span>
                  <span>{count} patients</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${(count / stats.total_patients) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}