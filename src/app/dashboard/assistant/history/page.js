'use client'
// frontend/src/app/dashboard/assistant/history/page.js


import { useSocket } from '../hooks/useSocket'

export default function HistoryPage() {
    const { isConnected } = useSocket()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Call History</h1>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Calls</h2>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((call) => (
                        <div key={call} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">📞</span>
                                </div>
                                <div>
                                    <p className="font-medium">Call #{call}</p>
                                    <p className="text-sm text-gray-600">Duration: {Math.floor(Math.random() * 20 + 5)} minutes</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">2 hours ago</p>
                                <p className="text-xs text-green-600">Completed</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Test Call Functionality</h3>
                <p className="text-blue-800 text-sm">
                    You can receive calls on this page! The call popup will appear in the bottom-right corner
                    when someone calls, regardless of which assistant page you're viewing.
                </p>
            </div>
        </div>
    )
}
