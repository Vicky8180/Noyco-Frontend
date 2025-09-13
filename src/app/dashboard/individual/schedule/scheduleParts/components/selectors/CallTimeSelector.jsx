"use client";

import React from 'react';
import { useIntegratedFlow } from '../../context/IntegratedFlowContext';
import { Clock, Calendar, RefreshCw } from 'lucide-react';

const CallTimeSelector = () => {
  const { callSettings, actions } = useIntegratedFlow();

  const handleCallSettingsChange = (updates) => {
    actions.setCallTime(updates);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not scheduled yet';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
      
        <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
          Choose Call Time
        </h2>
        <p className="max-w-2xl mx-auto" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
          Configure when and how often you want your AI agent to contact you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Call Timing Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4" style={{ color: 'var(--foreground)' }}>Call Timing</label>
            <div className="space-y-3">
              {/* Immediate Option */}
              <label 
                className="flex items-center p-4 border cursor-pointer transition-colors"
                style={{
                  borderColor: callSettings.callTime === 'immediate' ? 'var(--border-accent)' : '#d1d5db',
                  backgroundColor: callSettings.callTime === 'immediate' ? 'var(--beige)' : ''
                }}
                onMouseEnter={(e) => {
                  if (callSettings.callTime !== 'immediate') {
                    e.target.style.backgroundColor = 'var(--beige)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (callSettings.callTime !== 'immediate') {
                    e.target.style.backgroundColor = '';
                  }
                }}
              >
                <input
                  type="radio"
                  name="callTime"
                  value="immediate"
                  checked={callSettings.callTime === 'immediate'}
                  onChange={(e) => handleCallSettingsChange({ callTime: e.target.value })}
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--primary-100)' }}
                />
                <div className="ml-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>Immediate</span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Call will be initiated right away</p>
                </div>
              </label>
              
              {/* Scheduled Option */}
              <label 
                className="flex items-start p-4 border cursor-pointer transition-colors"
                style={{
                  borderColor: callSettings.callTime === 'scheduled' ? 'var(--border-accent)' : '#d1d5db',
                  backgroundColor: callSettings.callTime === 'scheduled' ? 'var(--beige)' : ''
                }}
                onMouseEnter={(e) => {
                  if (callSettings.callTime !== 'scheduled') {
                    e.target.style.backgroundColor = 'var(--beige)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (callSettings.callTime !== 'scheduled') {
                    e.target.style.backgroundColor = '';
                  }
                }}
              >
                <input
                  type="radio"
                  name="callTime"
                  value="scheduled"
                  checked={callSettings.callTime === 'scheduled'}
                  onChange={(e) => handleCallSettingsChange({ callTime: e.target.value })}
                  className="w-4 h-4 mt-0.5"
                  style={{ accentColor: 'var(--primary-100)' }}
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: 'var(--border-accent)' }} />
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>Scheduled</span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Call will be made at a specific date and time</p>
                  
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
                            // You might want to show a toast here
                            return;
                          }
                          
                          handleCallSettingsChange({ scheduledDateTime: e.target.value });
                        }}
                        className="w-full px-3 py-2 border text-sm"
                        style={{
                          borderColor: 'var(--border-accent)',
                          backgroundColor: '',
                          color: 'var(--foreground)'
                        }}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      <p className="text-xs mt-1" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Select a future date and time for the scheduled call</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Call Frequency Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4" style={{ color: 'var(--foreground)' }}>Call Frequency</label>
            <select
              value={callSettings.frequency}
              onChange={(e) => handleCallSettingsChange({ frequency: e.target.value })}
              className="w-full px-4 py-3 border"
              style={{
                borderColor: 'var(--border-accent)',
                backgroundColor: '',
                color: 'var(--foreground)'
              }}
            >
              <option value="once">One-time call</option>
              <option value="daily">Daily follow-up</option>
              <option value="weekly">Weekly check-in</option>
              <option value="monthly">Monthly follow-up</option>
              <option value="custom">Custom frequency</option>
            </select>

            {/* Weekly Days Selection */}
            {callSettings.frequency === 'weekly' && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Select days of the week</label>
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
                        
                        handleCallSettingsChange({ selectedDays: newSelectedDays });
                      }}
                      className="px-3 py-2 text-sm font-medium transition-colors border"
                      style={{
                        backgroundColor: callSettings.selectedDays?.includes(day) ? 'var(--border-accent)' : 'var(--beige)',
                        color: callSettings.selectedDays?.includes(day) ? '' : 'var(--foreground)',
                        borderColor: callSettings.selectedDays?.includes(day) ? 'var(--border-accent)' : '#d1d5db'
                      }}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-sm mt-2" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  {callSettings.selectedDays && callSettings.selectedDays.length > 0
                    ? `Selected: ${callSettings.selectedDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}`
                    : 'Please select at least one day'}
                </p>
              </div>
            )}
            
            {/* Custom Frequency */}
            {callSettings.frequency === 'custom' && (
              <div className="mt-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Repeat every</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g., 3"
                      value={callSettings.repeatInterval || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        handleCallSettingsChange({ 
                          repeatInterval: isNaN(value) ? '' : value,
                          customFrequency: `Every ${e.target.value || '___'} ${callSettings.repeatUnit || 'days'}` 
                        });
                      }}
                      className="w-full px-4 py-3 border"
                      style={{
                        borderColor: 'var(--border-accent)',
                        backgroundColor: '',
                        color: 'var(--foreground)'
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Unit</label>
                    <select
                      value={callSettings.repeatUnit || 'days'}
                      onChange={(e) => {
                        handleCallSettingsChange({ 
                          repeatUnit: e.target.value,
                          customFrequency: `Every ${callSettings.repeatInterval || '___'} ${e.target.value}`
                        });
                      }}
                      className="w-full px-4 py-3 border"
                      style={{
                        borderColor: 'var(--border-accent)',
                        backgroundColor: '',
                        color: 'var(--foreground)'
                      }}
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>
                <p className="text-sm mt-2" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Custom repeat: {callSettings.customFrequency || 'Every ___ days'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call Summary Preview */}
      <div 
        className="border p-6"
        style={{ 
          backgroundColor: 'var(--beige)',
          borderColor: 'var(--border-accent)'
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-10 h-10 flex items-center justify-center"
            style={{ 
              backgroundColor: 'var(--beige)',
              border: '1px solid var(--border-accent)'
            }}
          >
            <RefreshCw className="w-5 h-5" style={{ color: 'var(--border-accent)' }} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-3" style={{ color: 'var(--border-accent)' }}>Call Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium" style={{ color: 'var(--border-accent)' }}>Timing:</span>
                <p className="mt-1" style={{ color: 'var(--border-accent)', opacity: 0.8 }}>
                  {callSettings.callTime === 'immediate' 
                    ? 'Immediate' 
                    : formatDateTime(callSettings.scheduledDateTime)
                  }
                </p>
              </div>
              <div>
                <span className="font-medium" style={{ color: 'var(--border-accent)' }}>Frequency:</span>
                <p className="mt-1" style={{ color: 'var(--border-accent)', opacity: 0.8 }}>
                  {callSettings.frequency === 'custom' 
                    ? callSettings.customFrequency || 'Not specified'
                    : callSettings.frequency.charAt(0).toUpperCase() + callSettings.frequency.slice(1)
                  }
                </p>
              </div>
              {callSettings.frequency === 'weekly' && callSettings.selectedDays && callSettings.selectedDays.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-medium" style={{ color: 'var(--border-accent)' }}>Selected Days:</span>
                  <p className="mt-1" style={{ color: 'var(--border-accent)', opacity: 0.8 }}>
                    {callSettings.selectedDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {callSettings.callTime === 'scheduled' && !callSettings.scheduledDateTime && (
        <div className="text-center py-6">
          <p style={{ color: '#f97316' }}>Please select a date and time for your scheduled call</p>
        </div>
      )}
    </div>
  );
};

export default CallTimeSelector;
