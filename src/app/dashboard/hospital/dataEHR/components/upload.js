"use client"
import React, { useState } from 'react';
import Papa from 'papaparse';
import { useAuth } from '../../../../../store/hooks';
import { apiRequest } from '../../../../../lib/api';

const FHIR_FIELDS = {
  Patient: [
    { key: 'id', label: 'Patient ID', required: true },
    { key: 'name.family', label: 'Family Name', required: true },
    { key: 'name.given', label: 'Given Name', required: true },
    { key: 'birthDate', label: 'Birth Date', required: false },
    { key: 'gender', label: 'Gender', required: false },
    { key: 'address.city', label: 'City', required: false },
    { key: 'address.state', label: 'State', required: false },
    { key: 'address.postalCode', label: 'Postal Code', required: false },
    { key: 'telecom', label: 'Phone/Email', required: false },
  ],
  Condition: [
    { key: 'code', label: 'Condition Code', required: true },
    { key: 'clinicalStatus', label: 'Clinical Status', required: true },
    { key: 'verificationStatus', label: 'Verification Status', required: false },
    { key: 'onsetDateTime', label: 'Onset Date', required: false },
    { key: 'recordedDate', label: 'Recorded Date', required: false },
  ],
  Observation: [
    { key: 'code', label: 'Observation Code', required: true },
    { key: 'status', label: 'Status', required: true },
    { key: 'effectiveDateTime', label: 'Effective Date', required: false },
    { key: 'valueQuantity.value', label: 'Value', required: false },
    { key: 'valueQuantity.unit', label: 'Unit', required: false },
  ],
  Encounter: [
    { key: 'status', label: 'Encounter Status', required: true },
    { key: 'class.code', label: 'Class Code', required: true },
    { key: 'period.start', label: 'Start Date', required: false },
    { key: 'period.end', label: 'End Date', required: false },
  ],
  Procedure: [
    { key: 'code', label: 'Procedure Code', required: true },
    { key: 'performedDateTime', label: 'Performed Date', required: false },
  ],
};

const STEPS = [
  { id: 1, name: 'Upload CSV', description: 'Upload your CSV file' },
  { id: 2, name: 'Map Fields', description: 'Map CSV columns to FHIR fields' },
  { id: 3, name: 'Review & Submit', description: 'Review and save your mapping' },
];

export default function MappingPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [headers, setHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [mapping, setMapping] = useState({});
  const [allMappings, setAllMappings] = useState(() => {
    // Initialize mapping for all resource types
    const initial = {};
    Object.keys(FHIR_FIELDS).forEach(resource => {
      initial[resource] = {};
    });
    return initial;
  });
  const [selectedResource, setSelectedResource] = useState('Patient');
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    setIsUploading(true);
    setFileName(file.name);
    setError('');
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 5, // Preview first 5 rows
      complete: (results) => {
        setHeaders(Object.keys(results.data[0] || {}));
        setCsvData(results.data);
        setIsUploading(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setIsUploading(false);
        setError('Error parsing CSV file. Please check the file format.');
      }
    });
  };

  const handleSelect = (fieldKey, value) => {
    setMapping((prev) => ({ ...prev, [fieldKey]: value }));
    setAllMappings((prev) => {
      const [resource, key] = fieldKey.split('.');
      return {
        ...prev,
        [resource]: {
          ...prev[resource],
          [fieldKey]: value
        }
      };
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user?.role_entity_id) {
      setError('User authentication required');
      return;
    }

    if (!uploadedFile) {
      setError('No file selected for upload.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('role_entity_id', user.role_entity_id);
      formData.append('file_name', fileName);
      formData.append('all_mappings', JSON.stringify(allMappings));

      // Send to backend using centralized apiRequest
      const response = await apiRequest('/api/fhir/upload-csv', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData - let the browser set it
      });

      // Show success feedback
      alert(response.message || 'Mapping template saved and data uploaded successfully!');
      
      // Optionally reset form or redirect
      // resetForm();
      
    } catch (err) {
      console.error('Error saving mapping:', err);
      setError(err.message || 'Failed to save mapping. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRequiredFieldsCount = () => {
    const requiredFields = FHIR_FIELDS[selectedResource].filter(field => field.required);
    const mappedRequiredFields = requiredFields.filter(field => 
      mapping[`${selectedResource}.${field.key}`]
    );
    return { required: requiredFields.length, mapped: mappedRequiredFields.length };
  };

  const canProceedToNextStep = () => {
    if (currentStep === 1) return headers.length > 0;
    if (currentStep === 2) {
      const { required, mapped } = getRequiredFieldsCount();
      return mapped === required;
    }
    return true;
  };

  // Get mappings grouped by resource type
  const getMappingsByResource = () => {
    const mappingsByResource = {};
    
    // Initialize all resource types
    Object.keys(FHIR_FIELDS).forEach(resource => {
      mappingsByResource[resource] = [];
    });
    
    // Group mappings by resource
    Object.entries(allMappings).forEach(([resource, resourceMappings]) => {
      Object.entries(resourceMappings).forEach(([fieldKey, csvColumn]) => {
        if (csvColumn) { // Only include mapped fields
          const field = FHIR_FIELDS[resource].find(f => `${resource}.${f.key}` === fieldKey);
          if (field) {
            mappingsByResource[resource].push({
              fieldKey,
              field,
              csvColumn
            });
          }
        }
      });
    });
    
    // Filter out resources with no mappings
    return Object.fromEntries(
      Object.entries(mappingsByResource).filter(([_, mappings]) => mappings.length > 0)
    );
  };

  // Step 1: Upload CSV
  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your CSV File</h2>
        <p className="text-gray-600">Select a CSV file to begin the FHIR mapping process</p>
      </div>
      
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:border-blue-400">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV files only (MAX. 10MB)</p>
            </div>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
        
        {isUploading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-lg text-blue-600 bg-blue-50 border border-blue-200">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing {fileName}...
            </div>
          </div>
        )}
        
        {headers.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">File uploaded successfully!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">Found {headers.length} columns and {csvData.length} rows</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8 9.414l1.293-1.293a1 1 0 111.414 1.414L9.414 10l1.293 1.293a1 1 0 01-1.414 1.414L8 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L6.586 10 5.293 8.707a1 1 0 011.414-1.414L8 8.586l1.293-1.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Step 2: Map Fields
  const renderMappingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Map Your Fields</h2>
        <p className="text-gray-600">Connect CSV columns to FHIR resource fields</p>
      </div>

      {/* Resource Selector & Progress */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              {Object.keys(FHIR_FIELDS).map((resource) => (
                <option key={resource} value={resource}>{resource}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {getRequiredFieldsCount().mapped}/{getRequiredFieldsCount().required} required
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getRequiredFieldsCount().mapped / getRequiredFieldsCount().required) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Compact Field Mapping Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
            <div className="col-span-4">FHIR Field</div>
            <div className="col-span-4">CSV Column</div>
            <div className="col-span-3">Sample Data</div>
            <div className="col-span-1">Status</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {FHIR_FIELDS[selectedResource].map(({ key, label, required }) => {
            const fieldKey = `${selectedResource}.${key}`;
            const isMapped = !!mapping[fieldKey];
            const sampleData = isMapped && csvData.length > 0 ? csvData[0][mapping[fieldKey]] : null;
            
            return (
              <div key={key} className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors ${
                required && !isMapped ? 'bg-red-50' : ''
              }`}>
                {/* FHIR Field */}
                <div className="col-span-4 flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    required ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{key}</p>
                  </div>
                </div>
                
                {/* CSV Column Selector */}
                <div className="col-span-4">
                  <select
                    value={mapping[fieldKey] || ''}
                    onChange={(e) => handleSelect(fieldKey, e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                      isMapped ? 'border-green-300' : required ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select column...</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
                
                {/* Sample Data */}
                <div className="col-span-3 flex items-center">
                  {sampleData ? (
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-800 truncate">
                      {sampleData}
                    </code>
                  ) : (
                    <span className="text-xs text-gray-400">No data</span>
                  )}
                </div>
                
                {/* Status */}
                <div className="col-span-1 flex items-center justify-center">
                  {isMapped ? (
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : required ? (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Required</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Optional</span>
          </div>
        </div>
        <div>
          {Object.keys(mapping).length} of {FHIR_FIELDS[selectedResource].length} fields mapped
        </div>
      </div>

      {/* Completion Status */}
      {!canProceedToNextStep() && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-yellow-800">
              Please map all required fields to continue
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Step 3: Review & Submit - More Compact Version
  const renderReviewStep = () => {
    const mappingsByResource = getMappingsByResource();
    const totalMappings = Object.values(mappingsByResource).reduce((sum, mappings) => sum + mappings.length, 0);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Mapping</h2>
          <p className="text-gray-600">Review your field mappings before saving</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Compact File Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
                File Information
              </h3>
              <span className="text-sm text-blue-700 font-medium">{totalMappings} fields mapped</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div className="bg-white/60 rounded p-2">
                <p className="text-blue-600 font-medium">{fileName}</p>
                <p className="text-xs text-blue-700">{headers.length} cols, {csvData.length} rows</p>
              </div>
              <div className="bg-white/60 rounded p-2">
                <p className="text-blue-600 font-medium">User</p>
                <p className="text-xs text-blue-700 truncate">{user?.email || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Compact Resource Mappings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              FHIR Resource Mappings
            </h3>

            {Object.keys(mappingsByResource).length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-sm">No field mappings configured</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {Object.entries(mappingsByResource).map(([resourceType, mappings]) => (
                  <div key={resourceType} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Compact Resource Header */}
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          <h4 className="font-semibold text-gray-900">{resourceType}</h4>
                          <span className="ml-2 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded">
                            {mappings.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Compact Mappings Grid */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mappings.map(({ fieldKey, field, csvColumn }) => (
                          <div key={fieldKey} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${field.required ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">{field.label}</p>
                                {field.required && (
                                  <span className="text-xs text-red-600">Required</span>
                                )}
                              </div>
                            </div>
                            <svg className="w-3 h-3 text-gray-400 mx-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="text-right min-w-0 flex-1">
                              <p className="text-sm font-medium text-blue-600 truncate">{csvColumn}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compact Sample Data Preview */}
          {csvData.length > 0 && Object.keys(mappingsByResource).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Sample Data (3 rows)
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.values(allMappings).flatMap(resourceMappings => 
                        Object.values(resourceMappings).filter(Boolean)
                      ).map((column, idx) => (
                        <th key={idx} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 3).map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {Object.values(allMappings).flatMap(resourceMappings => 
                          Object.values(resourceMappings).filter(Boolean)
                        ).map((column, colIdx) => (
                          <td key={colIdx} className="px-3 py-2 text-gray-600 border-b">
                            <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                              {row[column] || '-'}
                            </code>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8 9.414l1.293-1.293a1 1 0 111.414 1.414L9.414 10l1.293 1.293a1 1 0 01-1.414 1.414L8 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L6.586 10 5.293 8.707a1 1 0 011.414-1.414L8 8.586l1.293-1.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isActive 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-12 h-0.5 ml-8 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {currentStep === 1 && renderUploadStep()}
          {currentStep === 2 && renderMappingStep()}
          {currentStep === 3 && renderReviewStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              disabled={!canProceedToNextStep()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !user?.role_entity_id}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Save Mapping Template'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}