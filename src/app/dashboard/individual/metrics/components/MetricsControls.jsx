import PropTypes from 'prop-types';

export default function MetricsControls({ selectedSchedule, onPause, onResume, onCancel, onDelete }) {
  if (!selectedSchedule) {
    return <p className="text-gray-500">Select a schedule to manage.</p>;
  }

  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={() => onPause(selectedSchedule.id)}
        className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
      >
        Pause
      </button>
      <button
        onClick={() => onResume(selectedSchedule.id)}
        className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
      >
        Resume
      </button>
      <button
        onClick={() => onCancel(selectedSchedule.id)}
        className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
      >
        Cancel
      </button>
      <button
        onClick={() => onDelete(selectedSchedule.id)}
        className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
      >
        Delete
      </button>
    </div>
  );
}

MetricsControls.propTypes = {
  selectedSchedule: PropTypes.object,
  onPause: PropTypes.func.isRequired,
  onResume: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
