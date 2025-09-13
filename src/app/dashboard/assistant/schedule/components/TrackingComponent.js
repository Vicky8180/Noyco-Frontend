"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown, ArrowUp, Calendar, Download,
  Filter, Phone, RefreshCw, Search,
  Clock, CheckCircle, XCircle, AlertCircle, PauseCircle
} from "lucide-react";

// Placeholder for API calls - replace with your actual API functions
const api = {
  getCallStatistics: async (filters) => {
    // Mock data - replace with actual API call
    return {
      total_calls: 458,
      completed: 312,
      failed: 46,
      cancelled: 22,
      in_progress: 78,
      avg_duration: 420, // seconds
      completion_rate: 0.68,
      time_distribution: {
        morning: 0.4,
        afternoon: 0.35,
        evening: 0.25
      }
    };
  },
  getCallHistory: async (filters) => {
    // Mock data - replace with actual API call
    return {
      total: 458,
      page: filters.page || 1,
      per_page: filters.per_page || 10,
      total_pages: 46,
      data: Array(10).fill(0).map((_, i) => ({
        id: `call-${i + (filters.page - 1) * 10 + 1}`,
        patient_id: `pat-${100 + i}`,
        patient_name: `Patient ${100 + i}`,
        hospital_id: "hosp-001",
        phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        call_type: ["followup", "initial", "emergency", "routine"][Math.floor(Math.random() * 4)],
        status: ["completed", "failed", "cancelled", "in_progress"][Math.floor(Math.random() * 4)],
        start_time: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        duration: Math.floor(Math.random() * 600), // seconds
        notes: Math.random() > 0.5 ? "Patient reported improvement in symptoms" : null
      }))
    };
  },
  updateCallStatus: async (callId, status, notes) => {
    // Replace with actual API call
    console.log(`Updating call ${callId} status to ${status} with notes: ${notes}`);
    return { success: true };
  }
};

// Utility functions
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getStatusColor = (status) => {
  switch (status) {
    case "completed": return "text-green-600 bg-green-50 border-green-200";
    case "failed": return "text-red-600 bg-red-50 border-red-200";
    case "cancelled": return "text-gray-600 bg-gray-50 border-gray-200";
    case "in_progress": return "text-blue-600 bg-blue-50 border-blue-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "completed": return <CheckCircle className="w-4 h-4" />;
    case "failed": return <XCircle className="w-4 h-4" />;
    case "cancelled": return <XCircle className="w-4 h-4" />;
    case "in_progress": return <Clock className="w-4 h-4" />;
    case "paused": return <PauseCircle className="w-4 h-4" />;
    default: return <AlertCircle className="w-4 h-4" />;
  }
};

const getCallTypeLabel = (type) => {
  switch (type) {
    case "followup": return "Follow-up";
    case "initial": return "Initial";
    case "emergency": return "Emergency";
    case "routine": return "Routine";
    default: return type;
  }
};

export default function TrackingComponent() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [callHistory, setCallHistory] = useState(null);
  const [loading, setLoading] = useState({
    stats: true,
    history: true
  });
  const [filters, setFilters] = useState({
    patient_id: "",
    hospital_id: "",
    call_type: "",
    start_date: "",
    end_date: "",
    page: 1,
    per_page: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({
    isOpen: false,
    callId: null,
    status: "",
    notes: ""
  });

  // Load initial data
  useEffect(() => {
    fetchStatistics();
    fetchCallHistory();
  }, []);

  // Reload history when filters or pagination change
  useEffect(() => {
    fetchCallHistory();
  }, [filters.page, filters.per_page]);

  const fetchStatistics = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const statsData = await api.getCallStatistics({
        hospital_id: filters.hospital_id,
        start_date: filters.start_date,
        end_date: filters.end_date
      });
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch call statistics:", error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const fetchCallHistory = async () => {
    setLoading(prev => ({ ...prev, history: true }));
    try {
      const historyData = await api.getCallHistory(filters);
      setCallHistory(historyData);
    } catch (error) {
      console.error("Failed to fetch call history:", error);
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  const applyFilters = () => {
    setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchCallHistory();
    fetchStatistics();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      patient_id: "",
      hospital_id: "",
      call_type: "",
      start_date: "",
      end_date: "",
      page: 1,
      per_page: 10
    });
    setShowFilters(false);
    fetchCallHistory();
    fetchStatistics();
  };

  const handleStatusUpdate = async () => {
    if (!updateStatus.callId || !updateStatus.status) return;

    try {
      await api.updateCallStatus(
        updateStatus.callId,
        updateStatus.status,
        updateStatus.notes
      );
      // Refresh call history
      fetchCallHistory();
      setUpdateStatus({
        isOpen: false,
        callId: null,
        status: "",
        notes: ""
      });
    } catch (error) {
      console.error("Failed to update call status:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (callHistory?.total_pages || 1)) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-xl">📞</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Call Tracking</h2>
          <p className="text-gray-600">Monitor call activity and performance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Total Calls</div>
          <div className="text-2xl font-bold text-gray-900">{stats?.total_calls || "—"}</div>
          <div className="mt-3 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Completion Rate</div>
          <div className="text-2xl font-bold text-gray-900">{stats ? `${Math.round(stats.completion_rate * 100)}%` : "—"}</div>
          <div className="mt-3 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats ? stats.completion_rate * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Average Duration</div>
          <div className="text-2xl font-bold text-gray-900">{stats ? formatDuration(stats.avg_duration) : "—"}</div>
          <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Minutes:Seconds</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Call Status Breakdown</div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Completed</span>
              <span className="text-xs font-medium text-green-600">{stats?.completed || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">In Progress</span>
              <span className="text-xs font-medium text-blue-600">{stats?.in_progress || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Failed</span>
              <span className="text-xs font-medium text-red-600">{stats?.failed || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Cancelled</span>
              <span className="text-xs font-medium text-gray-500">{stats?.cancelled || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Time Distribution Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Call Time Distribution</h3>
        <div className="h-40 flex items-end gap-6 px-10">
          {stats?.time_distribution && (
            <>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-100 rounded-t" style={{ height: `${stats.time_distribution.morning * 100}%` }}></div>
                <div className="mt-2 text-sm font-medium">Morning</div>
                <div className="text-xs text-gray-500">{Math.round(stats.time_distribution.morning * 100)}%</div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-300 rounded-t" style={{ height: `${stats.time_distribution.afternoon * 100}%` }}></div>
                <div className="mt-2 text-sm font-medium">Afternoon</div>
                <div className="text-xs text-gray-500">{Math.round(stats.time_distribution.afternoon * 100)}%</div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${stats.time_distribution.evening * 100}%` }}></div>
                <div className="mt-2 text-sm font-medium">Evening</div>
                <div className="text-xs text-gray-500">{Math.round(stats.time_distribution.evening * 100)}%</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Call History Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Call History</h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <button
                onClick={() => {
                  fetchCallHistory();
                  fetchStatistics();
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>

              <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  value={filters.patient_id}
                  onChange={(e) => setFilters(prev => ({ ...prev, patient_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital ID</label>
                <input
                  type="text"
                  value={filters.hospital_id}
                  onChange={(e) => setFilters(prev => ({ ...prev, hospital_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hospital ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Call Type</label>
                <select
                  value={filters.call_type}
                  onChange={(e) => setFilters(prev => ({ ...prev, call_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="followup">Follow-up</option>
                  <option value="initial">Initial</option>
                  <option value="emergency">Emergency</option>
                  <option value="routine">Routine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => setFilters(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => setFilters(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Call History Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Call Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading.history ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading call history...
                  </td>
                </tr>
              ) : callHistory?.data?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No call records found
                  </td>
                </tr>
              ) : (
                callHistory?.data?.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{call.patient_name}</div>
                          <div className="text-xs text-gray-500">ID: {call.patient_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{getCallTypeLabel(call.call_type)}</div>
                      <div className="text-xs text-gray-500">{call.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{new Date(call.start_time).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(call.start_time).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDuration(call.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                        {getStatusIcon(call.status)}
                        <span className="ml-1 capitalize">{call.status.replace("_", " ")}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCall(call)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setUpdateStatus({
                            isOpen: true,
                            callId: call.id,
                            status: call.status,
                            notes: call.notes || ""
                          })}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {callHistory && callHistory.total_pages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(callHistory.page - 1) * callHistory.per_page + 1} to {Math.min(callHistory.page * callHistory.per_page, callHistory.total)} of {callHistory.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                className={`p-1.5 rounded-md ${filters.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ArrowDown className="w-4 h-4 transform rotate-90" />
              </button>

              {Array.from({ length: Math.min(5, callHistory.total_pages) }, (_, i) => {
                let pageNum;
                if (callHistory.total_pages <= 5) {
                  pageNum = i + 1;
                } else if (filters.page <= 3) {
                  pageNum = i + 1;
                } else if (filters.page >= callHistory.total_pages - 2) {
                  pageNum = callHistory.total_pages - 4 + i;
                } else {
                  pageNum = filters.page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      filters.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= callHistory.total_pages}
                className={`p-1.5 rounded-md ${
                  filters.page >= callHistory.total_pages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowUp className="w-4 h-4 transform rotate-90" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Call Details</h3>
                <button
                  onClick={() => setSelectedCall(null)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 font-medium">Patient Name</div>
                  <div className="text-base">{selectedCall.patient_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Patient ID</div>
                  <div className="text-base">{selectedCall.patient_id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Phone Number</div>
                  <div className="text-base">{selectedCall.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Hospital ID</div>
                  <div className="text-base">{selectedCall.hospital_id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Call Type</div>
                  <div className="text-base">{getCallTypeLabel(selectedCall.call_type)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Status</div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCall.status)}`}>
                      {getStatusIcon(selectedCall.status)}
                      <span className="ml-1 capitalize">{selectedCall.status.replace("_", " ")}</span>
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Start Time</div>
                  <div className="text-base">{new Date(selectedCall.start_time).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Duration</div>
                  <div className="text-base">{formatDuration(selectedCall.duration)}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 font-medium mb-1">Notes</div>
                <div className="text-base bg-gray-50 p-3 rounded-md border border-gray-200 min-h-[80px]">
                  {selectedCall.notes || "No notes available for this call."}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setUpdateStatus({
                    isOpen: true,
                    callId: selectedCall.id,
                    status: selectedCall.status,
                    notes: selectedCall.notes || ""
                  });
                  setSelectedCall(null);
                }}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
              >
                Update Status
              </button>
              <button
                onClick={() => setSelectedCall(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {updateStatus.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Update Call Status</h3>
                <button
                  onClick={() => setUpdateStatus({ isOpen: false, callId: null, status: "", notes: "" })}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={updateStatus.status}
                  onChange={(e) => setUpdateStatus(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={updateStatus.notes}
                  onChange={(e) => setUpdateStatus(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes about this call status update..."
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setUpdateStatus({ isOpen: false, callId: null, status: "", notes: "" })}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
