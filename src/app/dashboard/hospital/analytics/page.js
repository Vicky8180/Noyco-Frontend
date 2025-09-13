'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { apiRequest } from '@/lib/api';
import clsx from 'clsx';

// Register chart elements once globally
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// ────────────────────────────────────────────────────────────────────────────────
// Helper components
// ────────────────────────────────────────────────────────────────────────────────
const Card = ({ title, value, className }) => (
  <div className={clsx('flex flex-col p-4 bg-white shadow rounded-lg', className)}>
    <span className="text-sm text-gray-500 mb-1">{title}</span>
    <span className="text-2xl font-semibold text-gray-800">{value}</span>
  </div>
);

export default function HospitalAnalyticsPage() {
  const [conversionStats, setConversionStats] = useState({ success: 0, failed: 0 });
  const [callStats, setCallStats] = useState({});
  const [assistantsStats, setAssistantsStats] = useState({ active: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  // Replace with real hospital-id source (cookie, context, etc.) if required
  const hospitalId = undefined; // optional query param

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        // Fetch all in parallel
        const [conversionsResp, callsResp, assistantsResp] = await Promise.all([
          apiRequest(`/dataEHR/conversions${hospitalId ? `?hospital_id=${hospitalId}` : ''}`),
          apiRequest(`/schedule/tracking/stats${hospitalId ? `?hospital_id=${hospitalId}` : ''}`),
          apiRequest(`/auth/assistants`),
        ]);

        // ───── Conversions ─────
        const conversions = conversionsResp?.conversions ?? [];
        let success = 0;
        let failed = 0;
        conversions.forEach((c) => {
          if (c.status === 'completed') success += 1;
          else if (c.status === 'failed') failed += 1;
        });
        setConversionStats({ success, failed });

        // ───── Calls ─────
        setCallStats(callsResp || {});

        // ───── Assistants ─────
        const assistants = assistantsResp ?? [];
        const active = assistants.filter((a) => a.is_active).length;
        const total = assistants.length;
        setAssistantsStats({ active, total });
      } catch (e) {
        console.error('Error loading analytics', e);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [hospitalId]);

  // ────────────────────────────────────────────────────────────────────────────
  // Chart data definitions
  // ────────────────────────────────────────────────────────────────────────────
  const conversionChartData = {
    labels: ['Success', 'Failed'],
    datasets: [
      {
        label: 'File Conversions',
        data: [conversionStats.success, conversionStats.failed],
        backgroundColor: ['#22c55e', '#ef4444'],
      },
    ],
  };

  const callStatusLabels = Object.keys(callStats.calls_by_status || {});
  const callCounts = Object.values(callStats.calls_by_status || {});
  const callChartData = {
    labels: callStatusLabels,
    datasets: [
      {
        label: 'Calls',
        data: callCounts,
        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#f59e0b',
          '#ef4444',
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
        ].slice(0, callStatusLabels.length),
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10 text-gray-500">Loading analytics …</div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-semibold text-gray-800">Hospital Analytics</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Conversions (Success)" value={conversionStats.success} />
        <Card title="Conversions (Failed)" value={conversionStats.failed} />
        <Card title="Active Assistants" value={assistantsStats.active} />
        <Card title="Total Assistants" value={assistantsStats.total} />
      </div>

      {/* Charts */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Conversions Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">File Conversion Success vs Failure</h2>
          <Doughnut data={conversionChartData} />
        </div>

        {/* Calls Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Calls by Status</h2>
          <Bar
            data={callChartData}
            options={{
              plugins: { legend: { display: false } },
              responsive: true,
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
