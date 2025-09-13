'use client';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Apple-style color palette
const colors = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  red: '#FF3B30',
  purple: '#AF52DE',
  pink: '#FF2D92',
  gray: '#8E8E93',
  lightGray: '#F2F2F7'
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: colors.gray,
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        color: colors.gray,
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 12
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(142, 142, 147, 0.2)',
        drawBorder: false
      },
      border: {
        display: false
      },
      ticks: {
        color: colors.gray,
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 12
        }
      }
    }
  }
};

export function CallVolumeChart({ data }) {
  const chartData = {
    labels: data?.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || [],
    datasets: [{
      data: data?.map(d => d.value) || [],
      borderColor: colors.blue,
      backgroundColor: `${colors.blue}20`,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: colors.blue,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2
    }]
  };

  return (
    <div className="h-48">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export function SuccessRateChart({ data }) {
  const chartData = {
    labels: data?.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || [],
    datasets: [{
      data: data?.map(d => d.value) || [],
      borderColor: colors.green,
      backgroundColor: `${colors.green}20`,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: colors.green,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2
    }]
  };

  return (
    <div className="h-48">
      <Line data={chartData} options={{
        ...chartOptions,
        scales: {
          ...chartOptions.scales,
          y: {
            ...chartOptions.scales.y,
            min: 80,
            max: 100,
            ticks: {
              ...chartOptions.scales.y.ticks,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }} />
    </div>
  );
}

export function CallsByHourChart({ data }) {
  const hours = Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const chartData = {
    labels: hours,
    datasets: [{
      data: hours.map(hour => data?.[hour] || 0),
      backgroundColor: colors.blue,
      borderRadius: 4,
      borderSkipped: false,
    }]
  };

  return (
    <div className="h-48">
      <Bar data={chartData} options={{
        ...chartOptions,
        scales: {
          ...chartOptions.scales,
          x: {
            ...chartOptions.scales.x,
            ticks: {
              ...chartOptions.scales.x.ticks,
              maxTicksLimit: 8
            }
          }
        }
      }} />
    </div>
  );
}

export function CallStatusDistribution({ data }) {
  const statusColors = {
    completed: colors.green,
    failed: colors.red,
    pending: colors.orange,
    cancelled: colors.gray
  };

  const chartData = {
    labels: Object.keys(data || {}),
    datasets: [{
      data: Object.values(data || {}),
      backgroundColor: Object.keys(data || {}).map(status => statusColors[status] || colors.gray),
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  return (
    <div className="h-48 flex items-center justify-center">
      <Doughnut data={chartData} options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed * 100) / total).toFixed(1);
                return `${context.label}: ${percentage}%`;
              }
            }
          }
        }
      }} />
    </div>
  );
}

export function ConversationDurationChart({ data }) {
  const chartData = {
    labels: Object.keys(data || {}),
    datasets: [{
      data: Object.values(data || {}),
      backgroundColor: [colors.blue, colors.green, colors.orange, colors.purple],
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  return (
    <div className="h-48">
      <Bar data={chartData} options={{
        ...chartOptions,
        indexAxis: 'y',
        scales: {
          x: {
            ...chartOptions.scales.x,
            ticks: {
              ...chartOptions.scales.x.ticks,
              callback: function(value) {
                return value + '%';
              }
            }
          },
          y: {
            ...chartOptions.scales.y,
            grid: {
              display: false
            }
          }
        }
      }} />
    </div>
  );
}
