"use client";
import React, { useState, useEffect } from 'react';
import { Phone, Loader2, Check, Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { showToast } from '@/lib/toast';

export default function PhoneNumberGenerator({ hospitalId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [phoneConfig, setPhoneConfig] = useState(null);
  const [areaCode, setAreaCode] = useState('');

  // Fetch existing phone configuration on mount
  useEffect(() => {
    async function fetchPhoneConfig() {
      if (!hospitalId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiRequest(`/phone/config/${hospitalId}`, {
          suppressError: true
        });
        
        if (response && response.status === 'not_found') {
          setPhoneConfig(null);
        } else if (response && response.twilio_config && response.twilio_config.phone_number) {
          // Normalize
          setPhoneConfig({
            phone_number: response.twilio_config.phone_number,
            area_code: response.twilio_config.area_code,
            country_code: response.twilio_config.country_code,
            status: response.twilio_config.status
          });
        }
      } catch (err) {
        // If backend indicates no Twilio config, that's expected (no number yet)
        const detail = err?.detail || err?.message || '';
        if (detail.includes('No Twilio configuration')) {
          // No phone number yet – not an error case
          setPhoneConfig(null);
        } else if (err.status && err.status === 404) {
          // Generic 404 from API – treat as no number yet
          setPhoneConfig(null);
        } else {
          console.error('Error fetching phone config:', err);
          setError('Failed to load phone configuration');
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchPhoneConfig();
  }, [hospitalId]);

  // Generate a new phone number
  const generatePhoneNumber = async () => {
    if (!hospitalId) return;
    
    setGenerating(true);
    setError(null);
    
    try {
      const url = `/phone/generate/${hospitalId}${areaCode ? `?area_code=${areaCode}` : ''}`;
      const response = await apiRequest(url, {
        method: 'POST'
      });
      
      if (response && response.phone_number) {
        setPhoneConfig({
          phone_number: response.phone_number,
          area_code: response.area_code || areaCode,
          country_code: response.country_code || 'US',
          status: 'active'
        });
        showToast('Phone number generated successfully!', 'success');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error generating phone number:', err);
      setError('Failed to generate phone number. Please try again.');
      showToast('Failed to generate phone number', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Copy phone number to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => showToast('Copied to clipboard!', 'success'),
      () => showToast('Failed to copy', 'error')
    );
  };

  // Format phone number for display
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Handle different formats
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+91 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return phoneNumber;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Phone Number Management</h2>
        <p className="text-gray-600 mt-2">
          {phoneConfig ? 'Manage your dedicated phone number' : 'Generate a dedicated phone number for your hospital'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {phoneConfig ? (
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Your Dedicated Number</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => copyToClipboard(phoneConfig.phone_number)}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center py-4">
              <span className="text-3xl font-semibold text-gray-800">
                {formatPhoneNumber(phoneConfig.phone_number)}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-50">
                <span className="text-sm text-gray-500 block mb-1">Area Code</span>
                <span className="font-medium">{phoneConfig.area_code || 'Default'}</span>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-50">
                <span className="text-sm text-gray-500 block mb-1">Country</span>
                <span className="font-medium">{phoneConfig.country_code || 'US'}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="bg-white rounded-lg p-4 border border-blue-50">
                <span className="text-sm text-gray-500 block mb-1">Status</span>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium text-green-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-4">
                <Phone className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Phone Number Generated</h3>
              <p className="text-gray-600 mb-4">
                Generate a dedicated phone number for your hospital to enable voice calling features.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Area Code (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={areaCode}
                onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').substring(0, 3))}
                placeholder="e.g. 415"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                maxLength={3}
              />
              <button
                onClick={generatePhoneNumber}
                disabled={generating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Number
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to get a random area code. If specified, we'll try to find a number with this area code.
            </p>
          </div>
        </div>
      )}

      {phoneConfig && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">Regenerate Phone Number</h3>
          <p className="text-gray-600 mb-4">
            If you need to change your phone number, you can generate a new one. Note that this will replace your current number.
          </p>
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').substring(0, 3))}
              placeholder="Area code (optional)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              maxLength={3}
            />
            <button
              onClick={generatePhoneNumber}
              disabled={generating}
              className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Regenerate
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-8">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
} 