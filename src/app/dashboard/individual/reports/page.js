"use client";

import { useState, useEffect } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState({});
  const [selectedTimeRange, setSelectedTimeRange] = useState("3months");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, [selectedTimeRange]);

  const loadReportsData = async () => {
    setIsLoading(true);
    try {
      // Simulate loading reports
      setReports([
        {
          id: 1,
          title: "Annual Health Summary",
          type: "comprehensive",
          date: "2024-01-15",
          status: "completed",
          provider: "Dr. Smith",
          description: "Complete annual health assessment including lab work, vitals, and recommendations.",
          downloadUrl: "#",
        },
        {
          id: 2,
          title: "Blood Work Analysis",
          type: "lab",
          date: "2024-01-10",
          status: "completed",
          provider: "City Lab",
          description: "Comprehensive metabolic panel and lipid profile results.",
          downloadUrl: "#",
        },
        {
          id: 3,
          title: "Cardiology Consultation",
          type: "specialist",
          date: "2024-01-05",
          status: "completed",
          provider: "Dr. Johnson",
          description: "Heart health assessment and ECG results.",
          downloadUrl: "#",
        },
        {
          id: 4,
          title: "Medication Review",
          type: "medication",
          date: "2023-12-20",
          status: "completed",
          provider: "Pharmacy Team",
          description: "Current medication effectiveness and interaction analysis.",
          downloadUrl: "#",
        },
      ]);

      // Simulate loading health metrics
      setHealthMetrics({
        bloodPressure: {
          current: "120/80",
          trend: "stable",
          data: [
            { date: "2024-01-15", systolic: 120, diastolic: 80 },
            { date: "2024-01-10", systolic: 118, diastolic: 78 },
            { date: "2024-01-05", systolic: 122, diastolic: 82 },
            { date: "2023-12-30", systolic: 119, diastolic: 79 },
          ],
        },
        weight: {
          current: "165 lbs",
          trend: "decreasing",
          data: [
            { date: "2024-01-15", value: 165 },
            { date: "2024-01-10", value: 166 },
            { date: "2024-01-05", value: 167 },
            { date: "2023-12-30", value: 168 },
          ],
        },
        heartRate: {
          current: "72 bpm",
          trend: "stable",
          data: [
            { date: "2024-01-15", value: 72 },
            { date: "2024-01-10", value: 70 },
            { date: "2024-01-05", value: 74 },
            { date: "2023-12-30", value: 71 },
          ],
        },
        cholesterol: {
          current: "180 mg/dL",
          trend: "improving",
          lastChecked: "2024-01-10",
          data: {
            total: 180,
            hdl: 60,
            ldl: 100,
            triglycerides: 120,
          },
        },
      });
    } catch (error) {
      console.error("Error loading reports data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case "comprehensive":
        return "bg-blue-100 text-blue-800";
      case "lab":
        return "bg-green-100 text-green-800";
      case "specialist":
        return "bg-purple-100 text-purple-800";
      case "medication":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case "comprehensive":
        return "📊";
      case "lab":
        return "🧪";
      case "specialist":
        return "👨‍⚕️";
      case "medication":
        return "💊";
      default:
        return "📄";
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "improving":
        return "text-green-600";
      case "stable":
        return "text-blue-600";
      case "decreasing":
        return "text-green-600";
      case "increasing":
        return "text-red-600";
      case "concerning":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return "📈";
      case "stable":
        return "➡️";
      case "decreasing":
        return "📉";
      case "increasing":
        return "📈";
      case "concerning":
        return "⚠️";
      default:
        return "➡️";
    }
  };

  const renderHealthMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Blood Pressure</h3>
          <span className="text-2xl">🩸</span>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            {healthMetrics.bloodPressure?.current}
          </div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(healthMetrics.bloodPressure?.trend)}`}>
            <span>{getTrendIcon(healthMetrics.bloodPressure?.trend)}</span>
            <span className="capitalize">{healthMetrics.bloodPressure?.trend}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weight</h3>
          <span className="text-2xl">⚖️</span>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            {healthMetrics.weight?.current}
          </div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(healthMetrics.weight?.trend)}`}>
            <span>{getTrendIcon(healthMetrics.weight?.trend)}</span>
            <span className="capitalize">{healthMetrics.weight?.trend}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Heart Rate</h3>
          <span className="text-2xl">❤️</span>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            {healthMetrics.heartRate?.current}
          </div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(healthMetrics.heartRate?.trend)}`}>
            <span>{getTrendIcon(healthMetrics.heartRate?.trend)}</span>
            <span className="capitalize">{healthMetrics.heartRate?.trend}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cholesterol</h3>
          <span className="text-2xl">🧪</span>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            {healthMetrics.cholesterol?.current}
          </div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(healthMetrics.cholesterol?.trend)}`}>
            <span>{getTrendIcon(healthMetrics.cholesterol?.trend)}</span>
            <span className="capitalize">{healthMetrics.cholesterol?.trend}</span>
          </div>
          <div className="text-xs text-gray-500">
            Last checked: {healthMetrics.cholesterol?.lastChecked}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailedMetrics = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Health Metrics</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Pressure Chart */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Blood Pressure Trend</h4>
          <div className="space-y-2">
            {healthMetrics.bloodPressure?.data.map((reading, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{reading.date}</span>
                <span className="text-sm font-medium">{reading.systolic}/{reading.diastolic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cholesterol Breakdown */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Cholesterol Breakdown</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Cholesterol</span>
              <span className="text-sm font-medium">{healthMetrics.cholesterol?.data.total} mg/dL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">HDL (Good)</span>
              <span className="text-sm font-medium text-green-600">{healthMetrics.cholesterol?.data.hdl} mg/dL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">LDL (Bad)</span>
              <span className="text-sm font-medium text-orange-600">{healthMetrics.cholesterol?.data.ldl} mg/dL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Triglycerides</span>
              <span className="text-sm font-medium">{healthMetrics.cholesterol?.data.triglycerides} mg/dL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsList = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Health Reports</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Request New Report
        </button>
      </div>
      
      {reports.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reports available</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">{getReportTypeIcon(report.type)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{report.title}</h4>
                    <p className="text-sm text-gray-600">{report.provider}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                    {report.type}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{report.date}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{report.description}</p>
              
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                  View Report
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                  Download PDF
                </button>
                <button className="px-3 py-1 bg-green-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Reports</h1>
              <p className="text-gray-600">Track your health metrics and view reports</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Health Metrics Overview */}
      {renderHealthMetrics()}

      {/* Detailed Metrics */}
      {renderDetailedMetrics()}

      {/* Reports List */}
      {renderReportsList()}

      {/* Health Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Insights</h3>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600">✅</span>
              <h4 className="font-medium text-green-800">Good Progress</h4>
            </div>
            <p className="text-sm text-green-700">
              Your blood pressure has remained stable within the healthy range over the past 3 months.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600">💡</span>
              <h4 className="font-medium text-blue-800">Recommendation</h4>
            </div>
            <p className="text-sm text-blue-700">
              Consider scheduling your annual cholesterol screening. It's been 3 months since your last test.
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-600">⚠️</span>
              <h4 className="font-medium text-yellow-800">Reminder</h4>
            </div>
            <p className="text-sm text-yellow-700">
              Don't forget to take your daily medication. Set up automatic refills to avoid running out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 