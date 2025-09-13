"use client";
import React, { useState, useEffect } from 'react';
import { X, Check, Info, Loader2, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { showToast } from '@/lib/toast';

export default function ServicesManager({ hospitalId, planType, onClose }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [defaultServices, setDefaultServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  // Fetch available services and currently selected services
  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError(null);
      try {
        // Get available services for the hospital
        const response = await apiRequest('/billing/services');
        
        if (response && response.services) {
          // Extract default and optional services
          const allServices = response.services || [];
          
          // Default services that are always selected
          const defaults = allServices.filter(s => s.is_default === true);
          
          // Optional services that can be selected based on plan
          const optionals = allServices.filter(s => s.is_default !== true);
            
          setDefaultServices(defaults);
          setAvailableServices(optionals);
          
          // Set selected services based on the is_selected flag from backend
          const selected = allServices
            .filter(s => s.is_selected === true)
            .map(s => s.id);
          setSelectedServices(selected);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services. Please try again later.');
        showToast('Failed to load services', 'error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchServices();
  }, [hospitalId]);

  // Toggle service selection
  const toggleService = (serviceId) => {
    // Find the service
    const service = availableServices.find(s => s.id === serviceId);
    if (!service) return;
    
    // Don't allow toggling if not available
    if (service.is_available === false) {
      return;
    }
    
    // Check if this service is already selected
    const isSelected = selectedServices.includes(serviceId);
    
    if (isSelected) {
      // Remove service
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    } else {
      // For lite plan, we can only select one optional service
      if (planType === 'lite') {
        // Get currently selected optional services
        const selectedOptionals = selectedServices.filter(id => 
          availableServices.some(s => s.id === id));
        
        if (selectedOptionals.length > 0) {
          // Replace the current optional service
          const defaultServiceIds = defaultServices.map(s => s.id);
          setSelectedServices([
            ...defaultServiceIds,
            serviceId
          ]);
        } else {
          // Add service (no optional service selected yet)
          setSelectedServices(prev => [...prev, serviceId]);
        }
      } else {
        // For pro plan, just add the service
        setSelectedServices(prev => [...prev, serviceId]);
      }
    }
  };

  // Save selected services
  const saveServices = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiRequest('/billing/services/select', {
        method: 'POST',
        body: JSON.stringify({
          hospital_id: hospitalId,
          services: selectedServices
        })
      });
      
      if (response) {
        showToast('Services updated successfully', 'success');
        onClose();
      }
    } catch (error) {
      console.error('Error saving services:', error);
      setError('Failed to update services. Please try again.');
      showToast('Failed to update services', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Check if service can be selected based on availability
  const canSelect = (service) => {
    return service.is_available !== false;
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

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Services</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-10">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Error Loading Services</h3>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Services</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-6">
        {planType === 'lite' 
          ? 'Your plan includes default services and allows you to choose one additional service.' 
          : 'Your plan includes default services and allows you to choose all additional services.'}
      </p>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Default Services</h3>
        <div className="space-y-3">
          {defaultServices.map(service => (
            <div 
              key={service.id}
              className="flex items-start p-4 bg-blue-50 border border-blue-100 rounded-lg"
            >
              <div className="h-6 w-6 mr-3 flex-shrink-0 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mt-0.5">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-base font-medium">{service.name}</h4>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Optional Services</h3>
        {planType === 'lite' && (
          <div className="mb-2 flex items-center text-sm text-amber-700 bg-amber-50 p-2 rounded-md">
            <Info className="h-4 w-4 mr-1" />
            <span>Your plan allows you to choose one optional service</span>
          </div>
        )}
        <div className="space-y-3">
          {availableServices.map(service => {
            const isSelected = selectedServices.includes(service.id);
            const isDisabled = !canSelect(service);
            
            return (
              <div 
                key={service.id}
                className={`flex items-start p-4 border rounded-lg transition-colors ${
                  isSelected 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200'
                } ${isDisabled && !isSelected ? 'opacity-60' : ''}`}
              >
                <div 
                  className={`h-6 w-6 mr-3 flex-shrink-0 rounded-full flex items-center justify-center mt-0.5 ${
                    isSelected 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isSelected && <Check className="h-4 w-4" />}
                </div>
                <div className="flex-grow">
                  <h4 className="text-base font-medium">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
                <button
                  onClick={() => toggleService(service.id)}
                  disabled={isDisabled && !isSelected}
                  className={`ml-2 px-3 py-1 rounded text-sm ${
                    isSelected 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${isDisabled && !isSelected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={saveServices}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 flex items-center"
        >
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
} 