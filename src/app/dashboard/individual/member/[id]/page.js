"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest, mediscanApi } from "@/lib/api";
import { 
  ChevronLeft, Plus, Eye, Pencil, Trash2, X, Calendar, Activity, 
  FileText, Heart, Pill, TestTube, User, Phone, Mail, MapPin,
  TrendingUp, AlertCircle, Clock, Filter, Search, MoreHorizontal,
  Download, Share, Settings, Stethoscope, Clipboard, FileCheck
} from "lucide-react";

export default function MemberDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id;
  const [member, setMember] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [visitForm, setVisitForm] = useState({ 
    diagnosis: "", 
    visit_notes: "", 
    prescriptions: [], 
    lab_results: [] 
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const m = await apiRequest(`/patients/${memberId}`);
      const docs = await mediscanApi.listDocuments(memberId);
      setMember(m);
      setVisits(docs.documents || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [memberId]);

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         visit.visit_notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'prescriptions' && visit.prescriptions?.length > 0) ||
                         (filterType === 'lab_results' && visit.lab_results?.length > 0);
    return matchesSearch && matchesFilter;
  });

  const getMedicalStats = () => {
    const totalVisits = visits.length;
    const totalPrescriptions = visits.reduce((sum, visit) => sum + (visit.prescriptions?.length || 0), 0);
    const totalLabResults = visits.reduce((sum, visit) => sum + (visit.lab_results?.length || 0), 0);
    const recentVisits = visits.filter(visit => {
      const visitDate = new Date(visit.visit_date || visit.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return visitDate >= thirtyDaysAgo;
    }).length;

    return { totalVisits, totalPrescriptions, totalLabResults, recentVisits };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medical records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Records</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchAll}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Member Not Found</h3>
          <p className="text-gray-600">This family member could not be found.</p>
        </div>
      </div>
    );
  }

  const stats = getMedicalStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
                <p className="text-gray-600">Medical Profile</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Share className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-8 border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{member.name}</h2>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <span className="capitalize">{member.gender}</span>
                  <span>•</span>
                  <span>{member.age ? `${member.age} years old` : 'Age not specified'}</span>
                  {member.dob && (
                    <>
                      <span>•</span>
                      <span>Born {new Date(member.dob).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-3">
                  {member.contact_number && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{member.contact_number}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => router.push('/dashboard/individual')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Upload Documents</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalVisits}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Total Visits</h3>
            <p className="text-gray-600 text-sm">Medical records</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <Pill className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalPrescriptions}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Prescriptions</h3>
            <p className="text-gray-600 text-sm">Medications tracked</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <TestTube className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalLabResults}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Lab Results</h3>
            <p className="text-gray-600 text-sm">Tests recorded</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.recentVisits}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Recent Visits</h3>
            <p className="text-gray-600 text-sm">Last 30 days</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'timeline', label: 'Medical Timeline', icon: Calendar },
                { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
                { id: 'lab_results', label: 'Lab Results', icon: TestTube },
                { id: 'summary', label: 'Health Summary', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medical records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
              >
                <option value="all">All Records</option>
                <option value="prescriptions">With Prescriptions</option>
                <option value="lab_results">With Lab Results</option>
              </select>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'timeline' && <TimelineView visits={filteredVisits} onEditVisit={(visit) => {
              setEditingVisit(visit);
              setVisitForm({
                diagnosis: visit.diagnosis || "",
                visit_notes: visit.visit_notes || "",
                prescriptions: visit.prescriptions || [],
                lab_results: visit.lab_results || [],
              });
            }} onViewVisit={(visit) => setEditingVisit({ ...visit, readOnly: true })} onDeleteVisit={async (visit) => {
              if (confirm("Delete this visit?")) {
                await mediscanApi.deleteDocument(member.id, visit.id);
                fetchAll();
              }
            }} />}
            
            {activeTab === 'prescriptions' && <PrescriptionsView visits={filteredVisits} />}
            
            {activeTab === 'lab_results' && <LabResultsView visits={filteredVisits} />}
            
            {activeTab === 'summary' && <HealthSummaryView member={member} visits={visits} />}
          </div>
        </div>
      </div>

      {/* Edit Visit Modal */}
      {editingVisit && (
        <EditVisitModal
          visit={editingVisit}
          readOnly={editingVisit.readOnly}
          form={visitForm}
          setForm={setVisitForm}
          onClose={() => setEditingVisit(null)}
          onSave={async () => {
            await mediscanApi.updateDocument(member.id, editingVisit.id, visitForm);
            setEditingVisit(null);
            fetchAll();
          }}
        />
      )}
    </div>
  );
}

// Timeline View Component
const TimelineView = ({ visits, onEditVisit, onViewVisit, onDeleteVisit }) => {
  const sortedVisits = [...visits].sort((a, b) => 
    new Date(b.visit_date || b.created_at) - new Date(a.visit_date || a.created_at)
  );

  if (visits.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Records</h3>
        <p className="text-gray-600">Upload documents to start building the medical timeline.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedVisits.map((visit, index) => (
        <div key={visit.id} className="relative">
          {index !== sortedVisits.length - 1 && (
            <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200"></div>
          )}
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="flex-1 bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {visit.diagnosis || 'Medical Visit'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(visit.visit_date || visit.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewVisit(visit)}
                    className="w-8 h-8 bg-white hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors border border-gray-200"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onEditVisit(visit)}
                    className="w-8 h-8 bg-white hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors border border-gray-200"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDeleteVisit(visit)}
                    className="w-8 h-8 bg-white hover:bg-red-50 rounded-xl flex items-center justify-center transition-colors border border-gray-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              {visit.visit_notes && (
                <p className="text-gray-700 mb-4 line-clamp-3">{visit.visit_notes}</p>
              )}
              
              <div className="flex flex-wrap gap-3">
                {visit.prescriptions && visit.prescriptions.length > 0 && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <Pill className="w-4 h-4" />
                    <span>{visit.prescriptions.length} prescription{visit.prescriptions.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {visit.lab_results && visit.lab_results.length > 0 && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    <TestTube className="w-4 h-4" />
                    <span>{visit.lab_results.length} lab result{visit.lab_results.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Prescriptions View Component
const PrescriptionsView = ({ visits }) => {
  const allPrescriptions = visits.flatMap(visit => 
    (visit.prescriptions || []).map(prescription => ({
      ...prescription,
      visitDate: visit.visit_date || visit.created_at,
      diagnosis: visit.diagnosis
    }))
  ).sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

  if (allPrescriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prescriptions</h3>
        <p className="text-gray-600">Prescription information will appear here when available.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {allPrescriptions.map((prescription, index) => (
        <div key={index} className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{prescription.medication}</h3>
              <p className="text-gray-600 text-sm">
                Prescribed on {new Date(prescription.visitDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <Pill className="w-4 h-4" />
              <span>Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Dosage</p>
              <p className="text-gray-900">{prescription.dosage || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Frequency</p>
              <p className="text-gray-900">{prescription.frequency || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Duration</p>
              <p className="text-gray-900">{prescription.duration || 'Not specified'}</p>
            </div>
          </div>
          
          {prescription.diagnosis && (
            <div className="pt-4 border-t border-green-200">
              <p className="text-sm font-medium text-gray-700 mb-1">Related to</p>
              <p className="text-gray-900">{prescription.diagnosis}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Lab Results View Component
const LabResultsView = ({ visits }) => {
  const allLabResults = visits.flatMap(visit => 
    (visit.lab_results || []).map(result => ({
      ...result,
      visitDate: visit.visit_date || visit.created_at,
      diagnosis: visit.diagnosis
    }))
  ).sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

  if (allLabResults.length === 0) {
    return (
      <div className="text-center py-12">
        <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Lab Results</h3>
        <p className="text-gray-600">Lab test results will appear here when available.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {allLabResults.map((result, index) => (
        <div key={index} className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{result.test_name}</h3>
              <p className="text-gray-600 text-sm">
                Tested on {new Date(result.visitDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{result.value}</p>
              <p className="text-gray-600 text-sm">{result.unit}</p>
            </div>
          </div>
          
          {result.reference_range && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Reference Range</p>
              <p className="text-gray-900">{result.reference_range}</p>
            </div>
          )}
          
          {result.diagnosis && (
            <div className="pt-4 border-t border-purple-200">
              <p className="text-sm font-medium text-gray-700 mb-1">Related to</p>
              <p className="text-gray-900">{result.diagnosis}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Health Summary View Component
const HealthSummaryView = ({ member, visits }) => {
  const getHealthInsights = () => {
    const recentVisits = visits.slice(0, 5);
    const commonConditions = {};
    const recentMedications = [];
    
    visits.forEach(visit => {
      if (visit.diagnosis) {
        commonConditions[visit.diagnosis] = (commonConditions[visit.diagnosis] || 0) + 1;
      }
      if (visit.prescriptions) {
        visit.prescriptions.forEach(prescription => {
          if (recentMedications.length < 10) {
            recentMedications.push({
              ...prescription,
              date: visit.visit_date || visit.created_at
            });
          }
        });
      }
    });

    return { recentVisits, commonConditions, recentMedications };
  };

  const insights = getHealthInsights();

  return (
    <div className="space-y-8">
      {/* Health Overview */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Health Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {insights.recentVisits.slice(0, 3).map((visit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700 text-sm">
                    {visit.diagnosis || 'Medical visit'} - {new Date(visit.visit_date || visit.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Common Conditions</h4>
            <div className="space-y-2">
              {Object.entries(insights.commonConditions).slice(0, 3).map(([condition, count]) => (
                <div key={condition} className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">{condition}</span>
                  <span className="text-blue-600 font-medium text-sm">{count} visits</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Medications */}
      {insights.recentMedications.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Medications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.recentMedications.slice(0, 6).map((medication, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-100">
                <Pill className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{medication.medication}</p>
                  <p className="text-gray-600 text-sm">{medication.dosage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Metrics */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Health Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Health Score</h4>
            <p className="text-3xl font-bold text-blue-600 mb-1">85</p>
            <p className="text-gray-600 text-sm">Good</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Trend</h4>
            <p className="text-3xl font-bold text-green-600 mb-1">↗</p>
            <p className="text-gray-600 text-sm">Improving</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Risk Level</h4>
            <p className="text-3xl font-bold text-purple-600 mb-1">Low</p>
            <p className="text-gray-600 text-sm">Healthy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Edit Visit Modal
const EditVisitModal = ({ visit, readOnly, form, setForm, onClose, onSave }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {readOnly ? 'Visit Details' : 'Edit Visit'}
          </h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-2xl hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {readOnly ? (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Diagnosis</h3>
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-gray-900 text-lg">{visit.diagnosis || 'No diagnosis recorded'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Visit Notes</h3>
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                  {visit.visit_notes || 'No notes available'}
                </p>
              </div>
            </div>

            {visit.prescriptions && visit.prescriptions.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Prescriptions</h3>
                <div className="space-y-3">
                  {visit.prescriptions.map((p, idx) => (
                    <div key={idx} className="bg-green-50 rounded-2xl p-6 border border-green-100">
                      <p className="font-bold text-gray-900 text-lg mb-2">{p.medication}</p>
                      {p.dosage && <p className="text-gray-700 mb-1"><span className="font-medium">Dosage:</span> {p.dosage}</p>}
                      {p.frequency && <p className="text-gray-700"><span className="font-medium">Frequency:</span> {p.frequency}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visit.lab_results && visit.lab_results.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Lab Results</h3>
                <div className="space-y-3">
                  {visit.lab_results.map((l, idx) => (
                    <div key={idx} className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                      <p className="font-bold text-gray-900 text-lg mb-2">{l.test_name}</p>
                      <p className="text-gray-700">
                        <span className="font-medium">Result:</span> {l.value} {l.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Diagnosis</label>
                <input
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-lg"
                  placeholder="Enter diagnosis"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Visit Notes</label>
                <textarea
                  value={form.visit_notes}
                  onChange={(e) => setForm({ ...form, visit_notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-lg"
                  placeholder="Enter visit notes"
                  rows="4"
                />
              </div>
            </div>

            {/* Prescriptions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Prescriptions</h3>
                <button
                  onClick={() => setForm({ 
                    ...form, 
                    prescriptions: [...form.prescriptions, { medication: "", dosage: "", frequency: "", duration: "" }] 
                  })}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Prescription</span>
                </button>
              </div>
              
              {form.prescriptions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No prescriptions added</p>
              ) : (
                <div className="space-y-4">
                  {form.prescriptions.map((p, idx) => (
                    <div key={idx} className="bg-green-50 rounded-2xl p-6 border border-green-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input 
                          value={p.medication || ''} 
                          onChange={e => {
                            const arr = [...form.prescriptions];
                            arr[idx].medication = e.target.value;
                            setForm({...form, prescriptions: arr});
                          }} 
                          className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors" 
                          placeholder="Medication name" 
                        />
                        <input 
                          value={p.dosage || ''} 
                          onChange={e => {
                            const arr = [...form.prescriptions];
                            arr[idx].dosage = e.target.value;
                            setForm({...form, prescriptions: arr});
                          }} 
                          className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors" 
                          placeholder="Dosage" 
                        />
                        <input 
                          value={p.frequency || ''} 
                          onChange={e => {
                            const arr = [...form.prescriptions];
                            arr[idx].frequency = e.target.value;
                            setForm({...form, prescriptions: arr});
                          }} 
                          className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors" 
                          placeholder="Frequency" 
                        />
                        <div className="flex items-center space-x-2">
                          <input 
                            value={p.duration || ''} 
                            onChange={e => {
                              const arr = [...form.prescriptions];
                              arr[idx].duration = e.target.value;
                              setForm({...form, prescriptions: arr});
                            }} 
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors" 
                            placeholder="Duration" 
                          />
                          <button 
                            onClick={() => {
                              const arr = [...form.prescriptions];
                              arr.splice(idx, 1);
                              setForm({...form, prescriptions: arr});
                            }} 
                            className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lab Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Lab Results</h3>
                <button
                  onClick={() => setForm({
                    ...form, 
                    lab_results: [...form.lab_results, { test_name: "", value: "", unit: "" }]
                  })}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lab Result</span>
                </button>
              </div>
              
              {form.lab_results.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No lab results added</p>
              ) : (
                <div className="space-y-4">
                  {form.lab_results.map((l, idx) => (
                    <div key={idx} className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <input 
                          value={l.test_name || ''} 
                          onChange={e => {
                            const arr = [...form.lab_results];
                            arr[idx].test_name = e.target.value;
                            setForm({...form, lab_results: arr});
                          }} 
                          className="md:col-span-2 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors" 
                          placeholder="Test name" 
                        />
                        <input 
                          value={l.value || ''} 
                          onChange={e => {
                            const arr = [...form.lab_results];
                            arr[idx].value = e.target.value;
                            setForm({...form, lab_results: arr});
                          }} 
                          className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors" 
                          placeholder="Value" 
                        />
                        <div className="flex items-center space-x-2">
                          <input 
                            value={l.unit || ''} 
                            onChange={e => {
                              const arr = [...form.lab_results];
                              arr[idx].unit = e.target.value;
                              setForm({...form, lab_results: arr});
                            }} 
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors" 
                            placeholder="Unit" 
                          />
                          <button 
                            onClick={() => {
                              const arr = [...form.lab_results];
                              arr.splice(idx, 1);
                              setForm({...form, lab_results: arr});
                            }} 
                            className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
          >
            {readOnly ? 'Close' : 'Cancel'}
          </button>
          {!readOnly && (
            <button 
              onClick={onSave} 
              className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
); 