"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle, ArrowDown, ArrowUp, Calendar, Check,
  CheckCircle, ChevronDown, Filter, ListFilter, MoreHorizontal,
  Pause, Play, RefreshCw, Search, Trash, X, XCircle
} from "lucide-react";

// Placeholder for API calls - replace with your actual API functions
const api = {
  getScheduleStats: async (hospitalId) => {
    // Replace with actual API call
    return {
      pending: 42,
      completed: 156,
      failed: 8,
      cancelled: 15
    };
  },

  getSchedules: async (filters) => {
    // Replace with actual API call
    return {
      total: 221,
      page: filters.page || 1,
      per_page: filters.per_page || 10,
      total_pages: Math.ceil(221 / (filters.per_page || 10)),
      data: Array(10).fill(0).map((_, i) => ({
        id: `sch-${i + (filters.page - 1) * 10 + 1}`,
        patient_id: `pat-${100 + i}`,
        patient_name: `Patient ${100 + i}`,
        hospital_id: "hosp-001",
        hospital_name: "General Hospital",
        status: ["pending", "completed", "failed", "cancelled", "paused"][Math.floor(Math.random() * 5)],
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        scheduled_at: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        completed_at: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString() : null,
        frequency: ["once", "daily", "weekly", "monthly"][Math.floor(Math.random() * 4)],
        call_type: ["followup", "reminder", "check-in", "appointment"][Math.floor(Math.random() * 4)],
        notes: Math.random() > 0.7 ? "Priority patient follow-up" : null
      }))
    };
  },

  updateSchedule: async (scheduleId, data) => {
    // Replace with actual API call
    console.log(`Updating schedule ${scheduleId} with data:`, data);
    return { success: true };
  },

  pauseSchedule: async (scheduleId) => {
    // Replace with actual API call
    console.log(`Pausing schedule ${scheduleId}`);
    return { success: true };
  },

  resumeSchedule: async (scheduleId) => {
    // Replace with actual API call
    console.log(`Resuming schedule ${scheduleId}`);
    return { success: true };
  },

  cancelSchedule: async (scheduleId) => {
    // Replace with actual API call
    console.log(`Canceling schedule ${scheduleId}`);
    return { success: true };
  },

  deleteSchedule: async (scheduleId) => {
    // Replace with actual API call
    console.log(`Deleting schedule ${scheduleId}`);
    return { success: true };
  },

  cancelPendingSchedules: async (filters) => {
    // Replace with actual API call
    console.log(`Canceling all pending schedules with filters:`, filters);
    return { success: true, count: 5 };
  }
};

// Utility functions
const getStatusColor = (status) => {
  switch (status) {
    case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "completed": return "text-green-600 bg-green-50 border-green-200";
    case "failed": return "text-red-600 bg-red-50 border-red-200";
    case "cancelled": return "text-gray-600 bg-gray-50 border-gray-200";
    case "paused": return "text-blue-600 bg-blue-50 border-blue-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pending": return <Clock className="w-4 h-4" />;
    case "completed": return <CheckCircle className="w-4 h-4" />;
    case "failed": return <XCircle className="w-4 h-4" />;
    case "cancelled": return <XCircle className="w-4 h-4" />;
    case "paused": return <Pause className="w-4 h-4" />;
    default: return <AlertCircle className="w-4 h-4" />;
  }
};

const formatFrequency = (frequency) => {
  switch (frequency) {
    case "once": return "One Time";
    case "daily": return "Daily";
    case "weekly": return "Weekly";
    case "monthly": return "Monthly";
    default: return frequency;
  }
};

const formatCallType = (type) => {
  switch (type) {
    case "followup": return "Follow-up";
    case "reminder": return "Reminder";
    case "check-in": return "Check-in";
    case "appointment": return "Appointment";
    default: return type;
  }
};

// Icon component for schedule list
const Clock = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default function ScheduleComponent() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [schedules, setSchedules] = useState(null);
  const [loading, setLoading] = useState({
    stats: true,
    schedules: true
  });
  const [filters, setFilters] = useState({
    hospital_id: "",
    status: "",
    page: 1,
    per_page: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    open: false,
    scheduleId: null,
    position: { top: 0, left: 0 }
  });
  const [confirmAction, setConfirmAction] = useState({
    open: false,
    type: null, // "cancel", "delete", "cancel-all-pending"
    scheduleId: null
  });
  const [updateScheduleModal, setUpdateScheduleModal] = useState({
    open: false,
    scheduleId: null,
    data: {
      notes: "",
      scheduled_at: ""
    },
    original: null
  });

  // Load initial data
  useEffect(() => {
    fetchStats();
    fetchSchedules();
  }, []);

  // Reload schedules when filters or pagination change
  useEffect(() => {
    fetchSchedules();
  }, [filters.page, filters.per_page]);

  const fetchStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const statsData = await api.getScheduleStats(filters.hospital_id);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch schedule statistics:", error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const fetchSchedules = async () => {
    setLoading(prev => ({ ...prev, schedules: true }));
    try {
      const schedulesData = await api.getSchedules(filters);
      setSchedules(schedulesData);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setLoading(prev => ({ ...prev, schedules: false }));
    }
  };

  const applyFilters = () => {
    setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchSchedules();
    fetchStats();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      hospital_id: "",
      status: "",
      page: 1,
      per_page: 10
    });
    setShowFilters(false);
    fetchSchedules();
    fetchStats();
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (schedules?.total_pages || 1)) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleActionClick = (e, scheduleId) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    setActionMenu({
      open: true,
      scheduleId,
      position: {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      }
    });
  };

  const closeActionMenu = () => {
    setActionMenu({
      open: false,
      scheduleId: null,
      position: { top: 0, left: 0 }
    });
  };

  const handleAction = async (action, scheduleId) => {
    closeActionMenu();

    if (action === "view") {
      const schedule = schedules.data.find(s => s.id === scheduleId);
      setSelectedSchedule(schedule);
      return;
    }

    if (action === "update") {
      const schedule = schedules.data.find(s => s.id === scheduleId);
      setUpdateScheduleModal({
        open: true,
        scheduleId,
        data: {
          notes: schedule.notes || "",
          scheduled_at: schedule.scheduled_at ? new Date(schedule.scheduled_at).toISOString().slice(0, 16) : ""
        },
        original: schedule
      });
      return;
    }

    if (action === "pause") {
      try {
        await api.pauseSchedule(scheduleId);
        fetchSchedules();
      } catch (error) {
        console.error("Failed to pause schedule:", error);
      }
      return;
    }

    if (action === "resume") {
      try {
        await api.resumeSchedule(scheduleId);
        fetchSchedules();
      } catch (error) {
        console.error("Failed to resume schedule:", error);
      }
      return;
    }

    // For these actions, show a confirmation dialog
    if (["cancel", "delete"].includes(action)) {
      setConfirmAction({
        open: true,
        type: action,
        scheduleId
      });
      return;
    }
  };

  const executeConfirmedAction = async () => {
    const { type, scheduleId } = confirmAction;

    try {
      if (type === "cancel") {
        await api.cancelSchedule(scheduleId);
      } else if (type === "delete") {
        await api.deleteSchedule(scheduleId);
      } else if (type === "cancel-all-pending") {
        await api.cancelPendingSchedules({
          hospital_id: filters.hospital_id
        });
      }

      // Refresh data after action
      fetchSchedules();
      fetchStats();
    } catch (error) {
      console.error(`Failed to ${type} schedule:`, error);
    } finally {
      setConfirmAction({ open: false, type: null, scheduleId: null });
    }
  };

  const handleUpdateSchedule = async () => {
    if (!updateScheduleModal.scheduleId) return;

    try {
      await api.updateSchedule(updateScheduleModal.scheduleId, updateScheduleModal.data);
      fetchSchedules();
      setUpdateScheduleModal({
        open: false,
        scheduleId: null,
        data: { notes: "", scheduled_at: "" },
        original: null
      });
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">📅</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
            <p className="text-gray-600">Manage and monitor all scheduled calls</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          <button
            onClick={() => setConfirmAction({
              open: true,
              type: "cancel-all-pending",
              scheduleId: null
            })}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel All Pending
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Pending Schedules</div>
          <div className="text-2xl font-bold text-yellow-500">{stats?.pending || "—"}</div>
          <div className="mt-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-500">Awaiting execution</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Completed Schedules</div>
          <div className="text-2xl font-bold text-green-500">{stats?.completed || "—"}</div>
          <div className="mt-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">Successfully executed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Failed Schedules</div>
          <div className="text-2xl font-bold text-red-500">{stats?.failed || "—"}</div>
          <div className="mt-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500">Failed to execute</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Cancelled Schedules</div>
          <div className="text-2xl font-bold text-gray-500">{stats?.cancelled || "—"}</div>
          <div className="mt-3 flex items-center gap-2">
            <X className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Manually cancelled</span>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Schedules</h3>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Search by ID..."
                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <button
                onClick={() => {
                  fetchSchedules();
                  fetchStats();
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital ID</label>
                <input
                  type="text"
                  value={filters.hospital_id}
                  onChange={(e) => setFilters(prev => ({ ...prev, hospital_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter hospital ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="paused">Paused</option>
                </select>
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
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Schedules Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Frequency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Time
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
              {loading.schedules ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading schedules...
                  </td>
                </tr>
              ) : schedules?.data?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No schedules found
                  </td>
                </tr>
              ) : (
                schedules?.data?.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedSchedule(schedule)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{schedule.patient_name}</div>
                          <div className="text-xs text-gray-500">ID: {schedule.patient_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{schedule.hospital_name}</div>
                      <div className="text-xs text-gray-500">ID: {schedule.hospital_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{formatCallType(schedule.call_type)}</div>
                      <div className="text-xs text-gray-500">{formatFrequency(schedule.frequency)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{new Date(schedule.scheduled_at).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(schedule.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                        {getStatusIcon(schedule.status)}
                        <span className="ml-1 capitalize">{schedule.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="relative">
                        <button
                          onClick={(e) => handleActionClick(e, schedule.id)}
                          className="text-gray-400 hover:text-gray-600 rounded-md p-1"
                        >
                          <MoreHorizontal className="w-5 h-5" />
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
        {schedules && schedules.total_pages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(schedules.page - 1) * schedules.per_page + 1} to {Math.min(schedules.page * schedules.per_page, schedules.total)} of {schedules.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                className={`p-1.5 rounded-md ${filters.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ArrowDown className="w-4 h-4 transform rotate-90" />
              </button>

              {Array.from({ length: Math.min(5, schedules.total_pages) }, (_, i) => {
                let pageNum;
                if (schedules.total_pages <= 5) {
                  pageNum = i + 1;
                } else if (filters.page <= 3) {
                  pageNum = i + 1;
                } else if (filters.page >= schedules.total_pages - 2) {
                  pageNum = schedules.total_pages - 4 + i;
                } else {
                  pageNum = filters.page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      filters.page === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= schedules.total_pages}
                className={`p-1.5 rounded-md ${
                  filters.page >= schedules.total_pages
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

      {/* Action Menu */}
      {actionMenu.open && (
        <>
          <div
            className="fixed inset-0"
            onClick={closeActionMenu}
          />
          <div
            className="absolute z-50 bg-white shadow-lg rounded-lg border border-gray-200 py-1"
            style={{
              top: actionMenu.position.top + 'px',
              left: actionMenu.position.left + 'px'
            }}
          >
            <button
              onClick={() => handleAction("view", actionMenu.scheduleId)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              View Details
            </button>
            <button
              onClick={() => handleAction("update", actionMenu.scheduleId)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Update
            </button>

            {/* Show pause/resume based on schedule status */}
            {schedules?.data?.find(s => s.id === actionMenu.scheduleId)?.status === 'paused' ? (
              <button
                onClick={() => handleAction("resume", actionMenu.scheduleId)}
                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={() => handleAction("pause", actionMenu.scheduleId)}
                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
              >
                Pause
              </button>
            )}

            <button
              onClick={() => handleAction("cancel", actionMenu.scheduleId)}
              className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAction("delete", actionMenu.scheduleId)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        </>
      )}

      {/* Schedule Detail Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Schedule Details</h3>
                <button
                  onClick={() => setSelectedSchedule(null)}
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
                  <div className="text-base">{selectedSchedule.patient_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Patient ID</div>
                  <div className="text-base">{selectedSchedule.patient_id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Hospital</div>
                  <div className="text-base">{selectedSchedule.hospital_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Hospital ID</div>
                  <div className="text-base">{selectedSchedule.hospital_id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Call Type</div>
                  <div className="text-base">{formatCallType(selectedSchedule.call_type)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Frequency</div>
                  <div className="text-base">{formatFrequency(selectedSchedule.frequency)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Status</div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSchedule.status)}`}>
                      {getStatusIcon(selectedSchedule.status)}
                      <span className="ml-1 capitalize">{selectedSchedule.status}</span>
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Created At</div>
                  <div className="text-base">{new Date(selectedSchedule.created_at).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Scheduled At</div>
                  <div className="text-base">{new Date(selectedSchedule.scheduled_at).toLocaleString()}</div>
                </div>
                {selectedSchedule.completed_at && (
                  <div>
                    <div className="text-sm text-gray-500 font-medium">Completed At</div>
                    <div className="text-base">{new Date(selectedSchedule.completed_at).toLocaleString()}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-500 font-medium mb-1">Notes</div>
                <div className="text-base bg-gray-50 p-3 rounded-md border border-gray-200 min-h-[80px]">
                  {selectedSchedule.notes || "No notes available for this schedule."}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setUpdateScheduleModal({
                    open: true,
                    scheduleId: selectedSchedule.id,
                    data: {
                      notes: selectedSchedule.notes || "",
                      scheduled_at: selectedSchedule.scheduled_at ? new Date(selectedSchedule.scheduled_at).toISOString().slice(0, 16) : ""
                    },
                    original: selectedSchedule
                  });
                  setSelectedSchedule(null);
                }}
                className="px-4 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
              >
                Update
              </button>
              {selectedSchedule.status === "paused" ? (
                <button
                  onClick={async () => {
                    try {
                      await api.resumeSchedule(selectedSchedule.id);
                      fetchSchedules();
                      setSelectedSchedule(null);
                    } catch (error) {
                      console.error("Failed to resume schedule:", error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Resume
                </button>
              ) : (selectedSchedule.status === "pending") && (
                <button
                  onClick={async () => {
                    try {
                      await api.pauseSchedule(selectedSchedule.id);
                      fetchSchedules();
                      setSelectedSchedule(null);
                    } catch (error) {
                      console.error("Failed to pause schedule:", error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Pause
                </button>
              )}
              <button
                onClick={() => setSelectedSchedule(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Schedule Modal */}
      {updateScheduleModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Update Schedule</h3>
                <button
                  onClick={() => setUpdateScheduleModal({ open: false, scheduleId: null, data: { notes: "", scheduled_at: "" }, original: null })}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
                <input
                  type="datetime-local"
                  value={updateScheduleModal.data.scheduled_at}
                  onChange={(e) => setUpdateScheduleModal(prev => ({
                    ...prev,
                    data: { ...prev.data, scheduled_at: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={updateScheduleModal.data.notes}
                  onChange={(e) => setUpdateScheduleModal(prev => ({
                    ...prev,
                    data: { ...prev.data, notes: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add notes for this schedule..."
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setUpdateScheduleModal({ open: false, scheduleId: null, data: { notes: "", scheduled_at: "" }, original: null })}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSchedule}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Confirm Action</h3>
                  <p className="text-gray-500 mt-1">
                    {confirmAction.type === "cancel" && "Are you sure you want to cancel this schedule? This action cannot be undone."}
                    {confirmAction.type === "delete" && "Are you sure you want to delete this schedule? This action cannot be undone."}
                    {confirmAction.type === "cancel-all-pending" && "Are you sure you want to cancel all pending schedules? This action cannot be undone."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction({ open: false, type: null, scheduleId: null })}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {confirmAction.type === "cancel" ? "Yes, Cancel Schedule" :
                 confirmAction.type === "delete" ? "Yes, Delete Schedule" : "Yes, Cancel All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

