

// frontend/src/app/dashboard/assistant/page.js
'use client'

import { useSocket } from './hooks/useSocket'

export default function AssistantDashboard() {
    const { socket, isConnected } = useSocket()

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Assistant Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Advanced calling interface with real-time communication
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">
                            Socket Status: {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Test the System</h2>
                        <p className="text-gray-600 mb-4">
                            To trigger an incoming call, send a POST request to:
                        </p>
                        <code className="bg-gray-100 px-4 py-2 rounded text-sm text-gray-900">
                            POST http://localhost:8000/api/call
                        </code>
                        <p className="text-sm text-gray-500 mt-2">
                            Use Postman or any API client to test the call functionality
                        </p>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Call notifications will now appear on any assistant page!
                                Navigate to other pages (History, Workspace, Knowledge Base) and test the call functionality.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sample content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Features</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>• Real-time call notifications on all pages</li>
                            <li>• Global call handling across assistant dashboard</li>
                            <li>• Interactive call controls</li>
                            <li>• Chat during calls</li>
                            <li>• Call notes and summary</li>
                            <li>• Minimize/maximize interface</li>
                            <li>• Call duration tracking</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">System Status</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>WebSocket:</span>
                                <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Call Handler:</span>
                                <span className="text-green-600">Active</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Global Coverage:</span>
                                <span className="text-green-600">All Assistant Pages</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Test */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Test Call Across Pages</h3>
                    <p className="text-gray-600 mb-4">
                        Navigate to different assistant pages and test the call functionality:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <a href="/dashboard/assistant/history" className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded text-center">
                            📊 History
                        </a>
                        <a href="/dashboard/assistant/workspace" className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded text-center">
                            🛠️ Workspace
                        </a>
                        <a href="/dashboard/assistant/knowledge-base" className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded text-center">
                            📚 Knowledge Base
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
