
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '@/lib/api';
import { showToast } from '@/lib/toast';
import StatisticsChart from './StatisticsChart';

// Icons components
const ChevronRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const DocumentIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const EyeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const BeakerIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
  </svg>
);

const DownloadIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function ViewComponent() {
  // State management
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Data states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [patients, setPatients] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalPatients, setTotalPatients] = useState(0);

  // Get user role entity ID from auth context or local storage
  const reduxUser = useSelector((state) => state.auth?.user);

  const getRoleEntityId = useCallback(() => {
    // Priority: Redux auth state → localStorage fallback
    if (reduxUser && reduxUser.role_entity_id) return reduxUser.role_entity_id;
    if (reduxUser && reduxUser.id) return reduxUser.id;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role_entity_id || user.id || null;
    } catch {
      return null;
    }
  }, [reduxUser]);

  // Fetch uploaded files/conversions
  const fetchUploadedFiles = useCallback(async () => {
    const roleEntityId = getRoleEntityId();
    if (!roleEntityId) return;

    setLoading(true);
    try {
      const response = await apiRequest(`/api/fhir/conversions/${roleEntityId}`);
      setUploadedFiles(response.conversions || []);
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
      showToast('Failed to fetch uploaded files', 'error');
    } finally {
      setLoading(false);
    }
  }, [getRoleEntityId]);

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    const roleEntityId = getRoleEntityId();
    if (!roleEntityId) return;

    setLoading(true);
    try {
      const response = await apiRequest(`/api/fhir/patients?role_entity_id=${roleEntityId}&limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      setPatients(response.patients || []);
      setTotalPatients(response.total || response.patients?.length || 0);
    } catch (error) {
      console.error('Error fetching patients:', error);
      showToast('Failed to fetch patients', 'error');
    } finally {
      setLoading(false);
    }
  }, [getRoleEntityId, currentPage, itemsPerPage, searchQuery]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    const roleEntityId = getRoleEntityId();
    if (!roleEntityId) return;

    try {
      const response = await apiRequest(`/api/fhir/patients/stats/${roleEntityId}`);
      setStatistics(response);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }, [getRoleEntityId]);

  // Fetch patient details
  const fetchPatientDetails = useCallback(async (patientId) => {
    const roleEntityId = getRoleEntityId();
    if (!roleEntityId || !patientId) return;

    setLoading(true);
    try {
      const response = await apiRequest(`/api/fhir/patients/${patientId}/full-data?role_entity_id=${roleEntityId}`);
      setPatientDetails(response);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      showToast('Failed to fetch patient details', 'error');
    } finally {
      setLoading(false);
    }
  }, [getRoleEntityId]);

  // Initial data loading
  useEffect(() => {
    if (activeView === 'overview') {
      fetchUploadedFiles();
      fetchStatistics();
    } else if (activeView === 'patients') {
      fetchPatients();
    }
  }, [activeView, fetchUploadedFiles, fetchPatients, fetchStatistics]);

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    fetchPatientDetails(patient.id);
    setActiveView('patient-detail');
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setActiveView('file-detail');
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (activeView === 'patients') {
      fetchPatients();
    }
  };

  // Export functions
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle nested objects and arrays
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data exported successfully', 'success');
  };

  const exportPatientData = () => {
    if (!patients || patients.length === 0) {
      showToast('No patient data to export', 'warning');
      return;
    }

    const exportData = patients.map(patient => ({
      id: patient.id,
      name: formatName(patient.name),
      gender: patient.gender || 'Unknown',
      birthDate: patient.birthDate || 'Unknown',
      identifier: patient.identifier?.[0]?.value || 'N/A',
      active: patient.active ? 'Yes' : 'No'
    }));

    exportToCSV(exportData, `patients_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportPatientDetails = () => {
    if (!patientDetails) {
      showToast('No patient details to export', 'warning');
      return;
    }

    const { patient, conditions, observations, encounters, procedures } = patientDetails;
    
    const exportData = {
      patient: {
        id: patient.id,
        name: formatName(patient.name),
        gender: patient.gender,
        birthDate: patient.birthDate,
        identifier: patient.identifier?.[0]?.value
      },
      conditions: conditions?.map(c => ({
        code: c.code?.text || c.code?.coding?.[0]?.display,
        status: c.clinicalStatus?.coding?.[0]?.code,
        recordedDate: c.recordedDate
      })) || [],
      observations: observations?.map(o => ({
        code: o.code?.text || o.code?.coding?.[0]?.display,
        value: o.valueQuantity?.value,
        unit: o.valueQuantity?.unit,
        effectiveDateTime: o.effectiveDateTime
      })) || [],
      encounters: encounters?.map(e => ({
        type: e.type?.[0]?.text || e.type?.[0]?.coding?.[0]?.display,
        status: e.status,
        period: e.period?.start
      })) || [],
      procedures: procedures?.map(p => ({
        code: p.code?.text || p.code?.coding?.[0]?.display,
        status: p.status,
        performedDateTime: p.performedDateTime
      })) || []
    };

    // Export each section as separate CSV files
    const patientName = formatName(patient.name).replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    
    exportToCSV([exportData.patient], `${patientName}_patient_${timestamp}.csv`);
    if (exportData.conditions.length > 0) {
      exportToCSV(exportData.conditions, `${patientName}_conditions_${timestamp}.csv`);
    }
    if (exportData.observations.length > 0) {
      exportToCSV(exportData.observations, `${patientName}_observations_${timestamp}.csv`);
    }
    if (exportData.encounters.length > 0) {
      exportToCSV(exportData.encounters, `${patientName}_encounters_${timestamp}.csv`);
    }
    if (exportData.procedures.length > 0) {
      exportToCSV(exportData.procedures, `${patientName}_procedures_${timestamp}.csv`);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format name from FHIR format
  const formatName = (nameArray) => {
    if (!nameArray || !Array.isArray(nameArray) || nameArray.length === 0) return 'Unknown';
    const name = nameArray[0];
    const given = name.given ? name.given.join(' ') : '';
    const family = name.family || '';
    return `${given} ${family}`.trim() || 'Unknown';
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'processed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Navigation component
  const Navigation = () => (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {activeView !== 'overview' && (
              <button
                onClick={() => {
                  if (activeView === 'patient-detail') {
                    setActiveView('patients');
                    setSelectedPatient(null);
                    setPatientDetails(null);
                  } else if (activeView === 'file-detail') {
                    setActiveView('overview');
                    setSelectedFile(null);
                  } else {
                    setActiveView('overview');
                  }
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'overview' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              {activeView === 'patients' || activeView === 'patient-detail' ? (
                <>
                  <button
                    onClick={() => setActiveView('patients')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeView === 'patients' 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Patients
                  </button>
                  {activeView === 'patient-detail' && (
                    <>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 font-medium rounded-lg">
                        {selectedPatient ? formatName(selectedPatient.name) : 'Patient Details'}
                      </span>
                    </>
                  )}
                </>
              ) : activeView === 'file-detail' ? (
                <>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 font-medium rounded-lg">
                    {selectedFile?.file_name || 'File Details'}
                  </span>
                </>
              ) : null}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {(activeView === 'patients' || activeView === 'overview') && (
              <form onSubmit={handleSearch} className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </form>
            )}
            
            {/* Export buttons */}
            {activeView === 'patients' && patients.length > 0 && (
              <button
                onClick={exportPatientData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
            
            {activeView === 'patient-detail' && patientDetails && (
              <button
                onClick={exportPatientDetails}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Export Details</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Overview component
  const OverviewView = () => (
    <div className="space-y-8">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-blue-900">{statistics.total_patients?.toLocaleString()}</p>
              </div>
              <UserIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Conditions</p>
                <p className="text-3xl font-bold text-green-900">{statistics.resource_counts?.conditions?.toLocaleString()}</p>
              </div>
              <HeartIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Observations</p>
                <p className="text-3xl font-bold text-purple-900">{statistics.resource_counts?.observations?.toLocaleString()}</p>
              </div>
              <EyeIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Procedures</p>
                <p className="text-3xl font-bold text-orange-900">{statistics.resource_counts?.procedures?.toLocaleString()}</p>
              </div>
              <BeakerIcon className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setActiveView('patients')}
          className="group bg-white rounded-2xl p-8 border border-gray-200/50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Browse Patients
              </h3>
              <p className="text-gray-600 mt-2">View and search through patient records</p>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
          </div>
        </button>

        <div className="bg-white rounded-2xl p-8 border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {uploadedFiles.slice(0, 3).map((file, index) => (
              <button
                key={index}
                onClick={() => handleFileSelect(file)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 truncate">{file.file_name}</p>
                    <p className="text-sm text-gray-500">{formatDate(file.started_at)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(file.status)}`}>
                  {file.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Visualization */}
      {statistics && <StatisticsChart statistics={statistics} />}
    </div>
  );

  // Pagination component
  const Pagination = () => {
    const totalPages = Math.ceil(totalPatients / itemsPerPage);
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

  return (
      <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-gray-200/50">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalPatients)} of {totalPatients} patients
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
          >
            Previous
          </button>
          
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Patients list view
  const PatientsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900">Patient Records</h3>
          <p className="text-sm text-gray-600 mt-1">{totalPatients} patients found</p>
        </div>
        
        <div className="divide-y divide-gray-200/50">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="p-8 text-center">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No patients found</p>
            </div>
          ) : (
            patients.map((patient, index) => (
              <button
                key={patient.id || index}
                onClick={() => handlePatientSelect(patient)}
                className="w-full p-6 hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {formatName(patient.name)}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="capitalize">{patient.gender || 'Unknown'}</span>
                        <span>•</span>
                        <span>DOB: {formatDate(patient.birthDate)}</span>
                        {patient.identifier && patient.identifier[0] && (
                          <>
                            <span>•</span>
                            <span>ID: {patient.identifier[0].value}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Pagination />
        {totalPatients > itemsPerPage && (
          <button
            onClick={() => setItemsPerPage(totalPatients)}
            className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
          >
            Show All
          </button>
        )}
      </div>
    </div>
  );

  // Patient detail view
  const PatientDetailView = () => {
    if (!selectedPatient || !patientDetails) {
      return (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading patient details...</p>
        </div>
      );
    }

    const { patient, conditions, observations, encounters, procedures } = patientDetails;

    return (
      <div className="space-y-6">
        {/* Patient Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/50">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{formatName(patient.name)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-600">Gender</p>
                  <p className="font-medium capitalize">{patient.gender || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date of Birth</p>
                  <p className="font-medium">{formatDate(patient.birthDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Patient ID</p>
                  <p className="font-medium">{patient.identifier?.[0]?.value || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conditions */}
          <div className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-red-50">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <HeartIcon className="w-5 h-5 text-red-500 mr-2" />
                Conditions ({conditions?.length || 0})
              </h3>
            </div>
            <div className="p-6">
              {conditions && conditions.length > 0 ? (
                <div className="space-y-3">
                  {conditions.slice(0, 5).map((condition, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {condition.code?.text || condition.code?.coding?.[0]?.display || 'Unknown Condition'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Status: {condition.clinicalStatus?.coding?.[0]?.code || 'Unknown'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No conditions recorded</p>
              )}
            </div>
          </div>

          {/* Observations */}
          <div className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-blue-50">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <EyeIcon className="w-5 h-5 text-blue-500 mr-2" />
                Observations ({observations?.length || 0})
              </h3>
            </div>
            <div className="p-6">
              {observations && observations.length > 0 ? (
                <div className="space-y-3">
                  {observations.slice(0, 5).map((observation, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {observation.code?.text || observation.code?.coding?.[0]?.display || 'Unknown Observation'}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600">
                          Value: {observation.valueQuantity?.value || 'N/A'} {observation.valueQuantity?.unit || ''}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(observation.effectiveDateTime)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No observations recorded</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Encounters and Procedures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Encounters */}
          <div className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-green-50">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <CalendarIcon className="w-5 h-5 text-green-500 mr-2" />
                Encounters ({encounters?.length || 0})
              </h3>
            </div>
            <div className="p-6">
              {encounters && encounters.length > 0 ? (
                <div className="space-y-3">
                  {encounters.slice(0, 5).map((encounter, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {encounter.type?.[0]?.text || encounter.type?.[0]?.coding?.[0]?.display || 'Unknown Encounter'}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600 capitalize">
                          Status: {encounter.status || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(encounter.period?.start)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No encounters recorded</p>
              )}
            </div>
          </div>

          {/* Procedures */}
          <div className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-purple-50">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <BeakerIcon className="w-5 h-5 text-purple-500 mr-2" />
                Procedures ({procedures?.length || 0})
              </h3>
            </div>
            <div className="p-6">
              {procedures && procedures.length > 0 ? (
                <div className="space-y-3">
                  {procedures.slice(0, 5).map((procedure, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {procedure.code?.text || procedure.code?.coding?.[0]?.display || 'Unknown Procedure'}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600 capitalize">
                          Status: {procedure.status || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(procedure.performedDateTime)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No procedures recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // File detail view
  const FileDetailView = () => {
    if (!selectedFile) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200/50">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <DocumentIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{selectedFile.file_name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-600">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedFile.status)}`}>
                    {selectedFile.status}
                    </span>
                </div>
                <div>
                  <p className="text-gray-600">Uploaded</p>
                  <p className="font-medium">{formatDate(selectedFile.started_at)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Rows</p>
                  <p className="font-medium">{selectedFile.total_rows?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Processed</p>
                  <p className="font-medium">{selectedFile.processed_rows?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource counts */}
        {selectedFile.resource_counts && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(selectedFile.resource_counts).map(([resource, count]) => (
              <div key={resource} className="bg-white rounded-xl p-4 border border-gray-200/50">
                <p className="text-gray-600 text-sm capitalize">{resource}</p>
                <p className="text-2xl font-bold text-gray-900">{count?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* Errors if any */}
        {selectedFile.errors && selectedFile.errors.length > 0 && (
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200/50">
            <h3 className="font-semibold text-red-900 mb-4">Processing Errors</h3>
            <div className="space-y-2">
              {selectedFile.errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded-lg">
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activeView === 'overview' && 'Data Overview'}
            {activeView === 'patients' && 'Patient Records'}
            {activeView === 'patient-detail' && 'Patient Details'}
            {activeView === 'file-detail' && 'File Details'}
          </h1>
          <p className="text-gray-600">
            {activeView === 'overview' && 'Comprehensive view of your healthcare data'}
            {activeView === 'patients' && 'Browse and search through patient records'}
            {activeView === 'patient-detail' && 'Detailed view of patient medical information'}
            {activeView === 'file-detail' && 'Information about uploaded data file'}
          </p>
        </div>

        {activeView === 'overview' && <OverviewView />}
        {activeView === 'patients' && <PatientsView />}
        {activeView === 'patient-detail' && <PatientDetailView />}
        {activeView === 'file-detail' && <FileDetailView />}
      </div>
    </div>
  );
}