
'use client';
import React, { useState, useEffect } from 'react';
import { Search, Phone, Calendar, Clock, User, Check, X, ChevronRight, Pill, FileText, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
// import PatientsComponent from '../schedule/components/Patients'; // Import the separate component
import { useSelector } from 'react-redux';
import { getApiUrl } from '@/lib/api';
import { showToast } from '@/lib/toast';

const ManualCallScheduling = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [callSettings, setCallSettings] = useState({
    callTime: 'immediate',
    scheduledDateTime: '',
    frequency: 'once',
    customFrequency: '',
    repeatInterval: '',
    repeatUnit: 'days',
    selectedDays: []
  });
  const [expandedSections, setExpandedSections] = useState({
    prescriptions: false,
    labResults: false,
    notes: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get current user from Redux store
  const user = useSelector((state) => state.auth.user);
  
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handlePatientVisitSelect = (patient, visit) => {
    setSelectedPatient(patient);
    setSelectedVisit(visit);
  };

  const handleScheduleCall = async () => {
    if (!selectedPatient || !user) {
      showToast("Missing required information for scheduling", "error");
      return;
    }
    
    if (!selectedPatient.contact_number || selectedPatient.contact_number.trim() === '') {
      showToast("Patient must have a valid phone number", "error");
      return;
    }
    
    // Validate custom frequency settings
    if (callSettings.frequency === 'custom') {
      if (!callSettings.repeatInterval || parseInt(callSettings.repeatInterval) < 1) {
        showToast("Please specify a valid repeat interval for custom frequency", "error");
        return;
      }
      if (!callSettings.repeatUnit) {
        showToast("Please select a time unit for custom frequency", "error");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      // Map the frontend callSettings to the backend schema
      let repeatType = "once"; // Default to once
      let repeatInterval = null;
      let repeatDays = null;
      
      // Map frontend frequency to backend RepeatType
      switch (callSettings.frequency) {
        case 'daily':
          repeatType = 'daily';
          break;
        case 'weekly':
          repeatType = 'weekly';
          // For weekly, we should have the days of the week
          // Default to current day of week if none selected
          if (!callSettings.selectedDays || callSettings.selectedDays.length === 0) {
            const today = new Date();
            const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'lowercase' });
            repeatDays = [dayOfWeek];
          } else {
            repeatDays = callSettings.selectedDays;
          }
          break;
        case 'monthly':
          repeatType = 'monthly';
          break;
        case 'custom':
          repeatType = 'custom';
          // Handle custom repeat interval - use as is since we now send repeat_unit
          repeatInterval = parseInt(callSettings.repeatInterval) || 1;
          break;
        default:
          repeatType = 'once';
      }
      
      // Create schedule request payload
      const scheduleRequest = {
        created_by: user.id || "system", // Ensure a default value if user.id is undefined
        schedule_time: callSettings.callTime === 'immediate' 
          ? new Date().toISOString() 
          : new Date(callSettings.scheduledDateTime).toISOString(),
        repeat_type: repeatType,
        repeat_interval: repeatInterval !== null ? Number(repeatInterval) : null, // Ensure it's a number
        repeat_unit: repeatType === 'custom' ? callSettings.repeatUnit : null, // Include the repeat_unit field
        repeat_days: repeatDays ? repeatDays.map(day => day.toLowerCase()) : null, // Ensure lowercase for backend
        patient_id: selectedPatient.patient_id,
        individual_id: user.role_entity_id,
        hospital_id: null, // Set to null explicitly for individual users
        user_type: "individual", // Match the enum in the backend
        phone: selectedPatient.contact_number,
        notes: `Follow-up call for visit on ${formatDateTime(selectedVisit?.visit_date)}${selectedVisit?.diagnosis ? ` regarding ${selectedVisit.diagnosis}` : ''}`
      };

      // Log the request payload for debugging
      console.log('Sending schedule request:', scheduleRequest);
      
      // Call the API to schedule
      const response = await fetch(getApiUrl('/schedule/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleRequest),
        credentials: 'include'
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('Server error response:', errorData);
        } catch (jsonError) {
          // If response is not valid JSON
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        // Handle validation errors (422 responses)
        if (response.status === 422 && errorData.detail) {
          // Format validation errors into a readable message
          let errorMessage = '';
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(err => {
              if (err.loc && err.loc.length > 1) {
                return `${err.loc[1]}: ${err.msg}`;
              }
              return err.msg;
            }).join(', ');
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
          throw new Error(errorMessage);
        } else if (response.status === 401) {
          throw new Error('Authentication error: Please log in again');
        } else if (response.status === 403) {
          throw new Error('Permission denied: You do not have access to this feature');
        } else if (response.status === 404) {
          throw new Error('Not found: The requested resource does not exist');
        } else if (response.status === 500) {
          throw new Error('Server error: Something went wrong on our end. Please try again later');
        } else {
          throw new Error(errorData.detail || errorData.message || `Failed to schedule call: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Call scheduled successfully:', data);
      showToast('Call scheduled successfully!', 'info');
      
      // Reset form
      setCurrentStep(1);
      setSelectedPatient(null);
      setSelectedVisit(null);
      setCallSettings({
        callTime: 'immediate',
        scheduledDateTime: '',
        frequency: 'once',
        customFrequency: '',
        repeatInterval: '',
        repeatUnit: 'days',
        selectedDays: []
      });
    } catch (error) {
      console.error('Error scheduling call:', error);
      
      // Provide more helpful error message
      let errorMessage = error.message || 'Unknown error occurred';
      if (errorMessage === 'Failed to fetch') {
        errorMessage = 'Network error: Could not connect to the server. Please check your connection.';
      } else if (errorMessage.includes('SyntaxError')) {
        errorMessage = 'Server returned an invalid response. Please try again later.';
      } else if (errorMessage === '[object Object]') {
        // Handle case where error message is an object that got stringified
        errorMessage = 'Validation error in the request. Please check your input.';
      }
      
      // Check for specific validation errors related to new fields
      if (errorMessage.includes('repeat_unit') || errorMessage.includes('invalid keyword argument')) {
        showToast(`Validation error: There was an issue with the frequency settings. Please try again with a simpler configuration.`, 'error');
      } else if (errorMessage.includes('repeat_interval')) {
        showToast(`Validation error: Please provide a valid number for the repeat interval`, 'error'); 
      } else if (errorMessage.includes(':')) {
        showToast(`Validation error: ${errorMessage}`, 'error');
      } else {
        showToast(`Failed to schedule call: ${errorMessage}`, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Select Patient & Visit', icon: User },
    { number: 2, title: 'Choose Call Time', icon: Clock },
    { number: 3, title: 'Review & Confirm', icon: Check }
  ];

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
     

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Patient & Visit */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Select Patient & Visit</h2>
                <p className="text-gray-600 mt-1">Choose a patient and specific visit to schedule a follow-up call</p>
              </div>
              {selectedPatient && selectedVisit && (
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  Ready to proceed to call scheduling
                </div>
              )}
            </div>
            
            {/* Integrated Patients Component */}
            {/* <PatientsComponent 
              mode="view"
              onPatientVisitSelect={handlePatientVisitSelect}
              selectedPatient={selectedPatient}
              selectedVisit={selectedVisit}
              showHeader={false}
              enableScheduling={true}
            /> */}

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedPatient || !selectedVisit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next: Choose Call Time
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Call Time */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Call Time</h2>
            <p className="text-gray-600 mb-6">Configure when and how often you want to call this patient</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Call Timing</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="callTime"
                        value="immediate"
                        checked={callSettings.callTime === 'immediate'}
                        onChange={(e) => setCallSettings({ ...callSettings, callTime: e.target.value })}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900">Immediate</span>
                        <p className="text-sm text-gray-600">Call will be initiated right away</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="callTime"
                        value="scheduled"
                        checked={callSettings.callTime === 'scheduled'}
                        onChange={(e) => setCallSettings({ ...callSettings, callTime: e.target.value })}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                      <div className="ml-3 flex-1">
                        <span className="font-medium text-gray-900">Scheduled</span>
                        <p className="text-sm text-gray-600 mb-3">Call will be made at a specific date and time</p>
                        
                        {callSettings.callTime === 'scheduled' && (
                          <div>
                            <input
                              type="datetime-local"
                              value={callSettings.scheduledDateTime}
                              onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
                                const now = new Date();
                                
                                // Ensure selected date is in the future
                                if (selectedDate < now) {
                                  showToast("Please select a future date and time", "error");
                                  return;
                                }
                                
                                setCallSettings({ ...callSettings, scheduledDateTime: e.target.value });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              min={new Date().toISOString().slice(0, 16)}
                            />
                            <p className="text-xs text-gray-500 mt-1">Select a future date and time for the scheduled call</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Call Frequency</label>
                  <select
                    value={callSettings.frequency}
                    onChange={(e) => setCallSettings({ ...callSettings, frequency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="once">One-time call</option>
                    <option value="daily">Daily follow-up</option>
                    <option value="weekly">Weekly check-in</option>
                    <option value="monthly">Monthly follow-up</option>
                    <option value="custom">Custom frequency</option>
                  </select>

                  {callSettings.frequency === 'weekly' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select days of the week</label>
                      <div className="flex flex-wrap gap-2">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const selectedDays = callSettings.selectedDays || [];
                              const newSelectedDays = selectedDays.includes(day)
                                ? selectedDays.filter(d => d !== day)
                                : [...selectedDays, day];
                              
                              setCallSettings({
                                ...callSettings,
                                selectedDays: newSelectedDays
                              });
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${
                              callSettings.selectedDays?.includes(day)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {callSettings.selectedDays && callSettings.selectedDays.length > 0
                          ? `Selected: ${callSettings.selectedDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}`
                          : 'Please select at least one day'}
                      </p>
                    </div>
                  )}
                  
                  {callSettings.frequency === 'custom' && (
                    <div className="mt-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Repeat every</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g., 3"
                            value={callSettings.repeatInterval || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              setCallSettings({ 
                                ...callSettings, 
                                repeatInterval: isNaN(value) ? '' : value,
                                customFrequency: `Every ${e.target.value || '___'} ${callSettings.repeatUnit || 'days'}` 
                              });
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                          <select
                            value={callSettings.repeatUnit || 'days'}
                            onChange={(e) => {
                              setCallSettings({ 
                                ...callSettings, 
                                repeatUnit: e.target.value,
                                customFrequency: `Every ${callSettings.repeatInterval || '___'} ${e.target.value}`
                              });
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                          </select>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Custom repeat: {callSettings.customFrequency || 'Every ___ days'}</p>
                    </div>
                  )}
                </div>

                {/* Call Preview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Call Summary</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Timing:</strong> {
                      callSettings.callTime === 'immediate' 
                        ? 'Immediate' 
                        : callSettings.scheduledDateTime 
                          ? new Date(callSettings.scheduledDateTime).toLocaleString()
                          : 'Not scheduled yet'
                    }</p>
                    <p><strong>Frequency:</strong> {
                      callSettings.frequency === 'custom' 
                        ? callSettings.customFrequency || 'Not specified'
                        : callSettings.frequency.charAt(0).toUpperCase() + callSettings.frequency.slice(1)
                    }</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={callSettings.callTime === 'scheduled' && !callSettings.scheduledDateTime}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next: Review & Confirm
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Confirm</h2>
            <p className="text-gray-600 mb-8">Please review all details before scheduling the call</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Patient & Visit Details */}
              <div className="space-y-6">
                {/* Patient Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Patient Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                        {selectedPatient?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{selectedPatient?.name}</p>
                        <p className="text-sm text-gray-600">
                          {selectedPatient?.age ? `${selectedPatient.age} years` : 'Age N/A'} • {selectedPatient?.gender}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Phone:</span>
                        <span className="text-gray-900">{selectedPatient?.contact_number || 'Not available'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="text-gray-900 truncate ml-2">{selectedPatient?.email || 'Not available'}</span>
                      </div>
                      {selectedPatient?.address && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Address:</span>
                          <span className="text-gray-900 truncate ml-2">{selectedPatient.address}</span>
                        </div>
                      )}
                      {selectedPatient?.medical_record_number && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">MRN:</span>
                          <span className="text-gray-900 font-mono text-xs">{selectedPatient.medical_record_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visit Basic Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Visit Overview
                  </h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Visit Date:</span>
                        <span className="text-gray-900">{formatDateTime(selectedVisit?.visit_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Provider:</span>
                        <span className="text-gray-900">{selectedVisit?.provider || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Visit Type:</span>
                        <span className="text-gray-900">{selectedVisit?.visit_type || 'Regular checkup'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedVisit?.status === 'completed' ? 'bg-green-100 text-green-800' :
                          selectedVisit?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedVisit?.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedVisit?.status || 'Unknown'}
                        </span>
                      </div>
                      {selectedVisit?.follow_up_date && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Follow-up Date:</span>
                          <span className="text-gray-900">{formatDateTime(selectedVisit.follow_up_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Diagnosis Information */}
                {selectedVisit?.diagnosis && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-purple-600" />
                      Diagnosis Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-600 text-sm">Primary Diagnosis:</span>
                          <p className="text-gray-900 mt-1 p-3 bg-white rounded border border-gray-200">
                            {selectedVisit.diagnosis}
                          </p>
                        </div>
                        
                        {selectedVisit?.secondary_diagnosis && (
                          <div>
                            <span className="font-medium text-gray-600 text-sm">Secondary Diagnosis:</span>
                            <p className="text-gray-900 mt-1 p-3 bg-white rounded border border-gray-200">
                              {selectedVisit.secondary_diagnosis}
                            </p>
                          </div>
                        )}
                        
                        {selectedVisit?.diagnosis_notes && (
                          <div>
                            <span className="font-medium text-gray-600 text-sm">Clinical Notes:</span>
                            <p className="text-gray-900 mt-1 p-3 bg-white rounded border border-gray-200 text-sm">
                              {selectedVisit.diagnosis_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Medical Details & Call Settings */}
              <div className="space-y-6">
                {/* Prescriptions */}
                <div>
                  <button 
                    onClick={() => toggleSection('prescriptions')} 
                    className="w-full flex items-center justify-between font-semibold text-gray-900 mb-2"
                  >
                    <div className="flex items-center">
                      <Pill className="w-5 h-5 mr-2 text-blue-600" />
                      <h3>Prescriptions ({selectedVisit?.prescriptions?.length || 0})</h3>
                    </div>
                    {expandedSections.prescriptions ? 
                      <ChevronUp className="w-5 h-5 text-gray-600" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    }
                  </button>
                  
                  {expandedSections.prescriptions && selectedVisit?.prescriptions && selectedVisit.prescriptions.length > 0 && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4 max-h-60 overflow-y-auto">
                      {selectedVisit.prescriptions.map((med, index) => (
                        <div 
                          key={index} 
                          className="bg-white rounded-lg border border-gray-200 p-3 mb-2 last:mb-0"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-800">{med.name}</span>
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                              {med.status || 'Active'}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <p><span className="font-medium">Dosage:</span> {med.dosage}</p>
                            <p><span className="font-medium">Frequency:</span> {med.frequency}</p>
                            {med.instructions && (
                              <p><span className="font-medium">Instructions:</span> {med.instructions}</p>
                            )}
                            {med.end_date && (
                              <p><span className="font-medium">End Date:</span> {formatDateTime(med.end_date).split(',')[0]}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {expandedSections.prescriptions && (!selectedVisit?.prescriptions || selectedVisit.prescriptions.length === 0) && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center text-gray-500">
                      No prescriptions recorded for this visit
                    </div>
                  )}
                </div>

                {/* Lab Results */}
                <div>
                  <button 
                    onClick={() => toggleSection('labResults')} 
                    className="w-full flex items-center justify-between font-semibold text-gray-900 mb-2"
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      <h3>Lab Results ({selectedVisit?.lab_results?.length || 0})</h3>
                    </div>
                    {expandedSections.labResults ? 
                      <ChevronUp className="w-5 h-5 text-gray-600" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    }
                  </button>
                  
                  {expandedSections.labResults && selectedVisit?.lab_results && selectedVisit.lab_results.length > 0 && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4 max-h-60 overflow-y-auto">
                      {selectedVisit.lab_results.map((lab, index) => (
                        <div 
                          key={index} 
                          className="bg-white rounded-lg border border-gray-200 p-3 mb-2 last:mb-0"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-800">{lab.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              lab.status === 'normal' ? 'bg-green-50 text-green-700' :
                              lab.status === 'abnormal' ? 'bg-red-50 text-red-700' :
                              lab.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                              'bg-gray-50 text-gray-700'
                            }`}>
                              {lab.status || 'Completed'}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <p><span className="font-medium">Value:</span> {lab.value} {lab.unit || ''}</p>
                            <p><span className="font-medium">Reference Range:</span> {lab.reference_range || 'Not provided'}</p>
                            {lab.test_date && (
                              <p><span className="font-medium">Test Date:</span> {formatDateTime(lab.test_date).split(',')[0]}</p>
                            )}
                            {lab.notes && (
                              <p><span className="font-medium">Notes:</span> {lab.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {expandedSections.labResults && (!selectedVisit?.lab_results || selectedVisit.lab_results.length === 0) && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center text-gray-500">
                      No lab results recorded for this visit
                    </div>
                  )}
                </div>

                {/* Visit Notes */}
                {selectedVisit?.notes && (
                  <div>
                    <button 
                      onClick={() => toggleSection('notes')} 
                      className="w-full flex items-center justify-between font-semibold text-gray-900 mb-2"
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-orange-600" />
                        <h3>Visit Notes</h3>
                      </div>
                      {expandedSections.notes ? 
                        <ChevronUp className="w-5 h-5 text-gray-600" /> : 
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      }
                    </button>
                    
                    {expandedSections.notes && (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
                        <p className="text-sm text-gray-700">{selectedVisit.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Call Settings */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                    Call Configuration
                  </h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                    <div>
                      <span className="font-medium text-gray-600">Call Timing:</span>
                      <div className="text-gray-900 mt-1">
                        {callSettings.callTime === 'immediate' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Immediate
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3 mr-2" />
                            {callSettings.scheduledDateTime ? 
                              new Date(callSettings.scheduledDateTime).toLocaleString() : 
                              'Not scheduled'
                            }
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Frequency:</span>
                      <div className="text-gray-900 mt-1">
                        {callSettings.frequency === 'custom' 
                          ? callSettings.customFrequency || 'Custom frequency not specified'
                          : callSettings.frequency.charAt(0).toUpperCase() + callSettings.frequency.slice(1)
                        }
                      </div>
                    </div>

                    {/* Call Context Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="font-medium text-gray-600">Call Context:</span>
                      <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                        <div className="text-sm text-gray-700">
                          Follow-up call for {selectedPatient?.name}'s visit on {formatDateTime(selectedVisit?.visit_date)}
                          {selectedVisit?.diagnosis && ` regarding ${selectedVisit.diagnosis}`}.
                          {selectedVisit?.prescriptions?.length > 0 && ` Includes medication review (${selectedVisit.prescriptions.length} prescriptions).`}
                          {selectedVisit?.lab_results?.length > 0 && ` Will discuss lab results (${selectedVisit.lab_results.length} tests).`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Actions */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  All information verified and ready to schedule
                </div>
                <button
                  onClick={handleScheduleCall}
                  disabled={isSubmitting || !selectedPatient?.contact_number}
                  className={`flex items-center px-8 py-3 ${
                    isSubmitting 
                      ? 'bg-blue-400' 
                      : !selectedPatient?.contact_number 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                  } text-white rounded-lg transition-colors font-medium shadow-sm`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Confirm & Schedule Call
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualCallScheduling;