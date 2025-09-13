import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Filter, ChevronDown, X, Check } from 'lucide-react';

// Mock data structure - replace with actual import from data/patients.js
const mockPatients = [
  { id: 1, name: 'John Doe', age: 65, conditions: ['sugar', 'BP'], gender: 'Male', language: 'English', location: 'New York', diagnosedDate: '2024-07-01', phone: '+1234567890' },
  { id: 2, name: 'Jane Smith', age: 58, conditions: ['BP'], gender: 'Female', language: 'Spanish', location: 'California', diagnosedDate: '2024-07-03', phone: '+1234567891' },
  { id: 3, name: 'Robert Johnson', age: 72, conditions: ['sugar'], gender: 'Male', language: 'English', location: 'Texas', diagnosedDate: '2024-06-25', phone: '+1234567892' },
  { id: 4, name: 'Maria Garcia', age: 45, conditions: ['BP', 'sugar'], gender: 'Female', language: 'Spanish', location: 'Florida', diagnosedDate: '2024-07-05', phone: '+1234567893' },
  { id: 5, name: 'David Lee', age: 68, conditions: ['sugar'], gender: 'Male', language: 'English', location: 'New York', diagnosedDate: '2024-07-02', phone: '+1234567894' },
];

const BulkSchedulingComponent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patients, setPatients] = useState(mockPatients);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    minAge: '',
    maxAge: '',
    diagnosedWithin: '',
    conditions: [],
    gender: '',
    language: '',
    location: ''
  });

  // Schedule states
  const [scheduleSettings, setScheduleSettings] = useState({
    frequency: 'once',
    time: '10:00',
    startDate: '',
    endDate: '',
    customDays: []
  });

  const conditions = ['sugar', 'BP', 'diabetes', 'hypertension', 'heart'];
  const frequencies = [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom' }
  ];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Apply filters
  useEffect(() => {
    let filtered = [...patients];

    // Age filter
    if (filters.minAge) {
      filtered = filtered.filter(p => p.age >= parseInt(filters.minAge));
    }
    if (filters.maxAge) {
      filtered = filtered.filter(p => p.age <= parseInt(filters.maxAge));
    }

    // Diagnosed within filter
    if (filters.diagnosedWithin) {
      const days = parseInt(filters.diagnosedWithin);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(p => new Date(p.diagnosedDate) >= cutoffDate);
    }

    // Conditions filter
    if (filters.conditions.length > 0) {
      filtered = filtered.filter(p =>
        filters.conditions.some(condition => p.conditions.includes(condition))
      );
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(p => p.gender === filters.gender);
    }

    // Language filter
    if (filters.language) {
      filtered = filtered.filter(p => p.language === filters.language);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    setFilteredPatients(filtered);
    setSelectedPatients(filtered.map(p => p.id));
  }, [filters, patients]);

  const handleConditionToggle = (condition) => {
    setFilters(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const handlePatientToggle = (patientId) => {
    setSelectedPatients(prev =>
      prev.includes(patientId)
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPatients(filteredPatients.map(p => p.id));
  };

  const handleDeselectAll = () => {
    setSelectedPatients([]);
  };

  const clearFilters = () => {
    setFilters({
      minAge: '',
      maxAge: '',
      diagnosedWithin: '',
      conditions: [],
      gender: '',
      language: '',
      location: ''
    });
  };

  const handleCustomDayToggle = (day) => {
    setScheduleSettings(prev => ({
      ...prev,
      customDays: prev.customDays.includes(day)
        ? prev.customDays.filter(d => d !== day)
        : [...prev.customDays, day]
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Patient Filters
          </h3>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {/* Age Filters */}
          <div >
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minAge}
                onChange={(e) => setFilters(prev => ({ ...prev, minAge: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAge}
                onChange={(e) => setFilters(prev => ({ ...prev, maxAge: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Diagnosed Within */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosed Within (days)</label>
            <input
              type="number"
              placeholder="e.g., 7"
              value={filters.diagnosedWithin}
              onChange={(e) => setFilters(prev => ({ ...prev, diagnosedWithin: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conditions</label>
            <div className="flex flex-wrap gap-2">
              {conditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => handleConditionToggle(condition)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.conditions.includes(condition)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Clear All Filters
          </button>
          <div className="text-sm text-gray-600">
            {filteredPatients.length} patients match your criteria
          </div>
        </div>
      </div>

      {filteredPatients.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setCurrentStep(2)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Matching Patients
          </button>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Matching Patients ({filteredPatients.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredPatients.map(patient => (
            <div
              key={patient.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedPatients.includes(patient.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePatientToggle(patient.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedPatients.includes(patient.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedPatients.includes(patient.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{patient.name}</h4>
                    <p className="text-sm text-gray-600">
                      Age: {patient.age} | {patient.gender} | {patient.language}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 mb-1">
                    {patient.conditions.map(condition => (
                      <span
                        key={condition}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{patient.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            {selectedPatients.length} of {filteredPatients.length} patients selected
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back to Filters
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={selectedPatients.length === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedPatients.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Set Schedule
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-blue-600" />
          Schedule Settings
        </h3>

        <div className="space-y-6">
          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Call Frequency</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {frequencies.map(freq => (
                <button
                  key={freq.value}
                  onClick={() => setScheduleSettings(prev => ({ ...prev, frequency: freq.value }))}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    scheduleSettings.frequency === freq.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Days */}
          {scheduleSettings.frequency === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Days</label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map(day => (
                  <button
                    key={day}
                    onClick={() => handleCustomDayToggle(day)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      scheduleSettings.customDays.includes(day)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Call Time</label>
            <input
              type="time"
              value={scheduleSettings.time}
              onChange={(e) => setScheduleSettings(prev => ({ ...prev, time: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={scheduleSettings.startDate}
                onChange={(e) => setScheduleSettings(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {scheduleSettings.frequency !== 'once' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  value={scheduleSettings.endDate}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back to Patients
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          disabled={!scheduleSettings.startDate || !scheduleSettings.time}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !scheduleSettings.startDate || !scheduleSettings.time
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Review & Confirm
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-blue-600" />
          Review & Confirm
        </h3>

        <div className="space-y-6">
          {/* Schedule Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Schedule Summary</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Frequency:</span> {scheduleSettings.frequency}</p>
              {scheduleSettings.frequency === 'custom' && (
                <p><span className="font-medium">Days:</span> {scheduleSettings.customDays.join(', ')}</p>
              )}
              <p><span className="font-medium">Time:</span> {scheduleSettings.time}</p>
              <p><span className="font-medium">Start Date:</span> {scheduleSettings.startDate}</p>
              {scheduleSettings.endDate && (
                <p><span className="font-medium">End Date:</span> {scheduleSettings.endDate}</p>
              )}
              <p><span className="font-medium">Total Patients:</span> {selectedPatients.length}</p>
            </div>
          </div>

          {/* Patient List Preview */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Selected Patients ({selectedPatients.length})</h4>
            <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {filteredPatients
                  .filter(p => selectedPatients.includes(p.id))
                  .map(patient => (
                    <div key={patient.id} className="flex justify-between items-center py-2">
                      <div>
                        <span className="font-medium">{patient.name}</span>
                        <span className="text-gray-600 ml-2">({patient.age}, {patient.gender})</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.conditions.join(', ')}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back to Schedule
        </button>
        <button
          onClick={() => {
            // Handle final submission here
            alert(`Scheduling ${selectedPatients.length} calls successfully!`);
            // Reset to step 1
            setCurrentStep(1);
          }}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Schedule All Calls
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}


      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {['Apply Filters', 'Select Patients', 'Set Schedule', 'Review & Confirm'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index + 1 <= currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 font-medium ${
                index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step}
              </span>
              {index < 3 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
    </div>
  );
};

export default BulkSchedulingComponent;
