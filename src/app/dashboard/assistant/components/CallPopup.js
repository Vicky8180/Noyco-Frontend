// # frontend/src/app/dashboard/assistant/components/CallPopup.js
'use client'

import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CallPopup({ callData, onAnswer, onReject }) {
    const [isMuted, setIsMuted] = useState(false)

    // Auto-reject after 30 seconds if not answered
    useEffect(() => {
        const timer = setTimeout(() => {
            onReject()
        }, 30000)

        return () => clearTimeout(timer)
    }, [onReject])

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center call-ring">
                        <Phone className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Incoming Call</h3>
                    <p className="text-sm text-gray-600">{callData.caller}</p>
                    <p className="text-xs text-gray-500">{callData.callerNumber}</p>
                </div>

                {/* Call Actions */}
                <div className="flex justify-center gap-4 mb-4">
                    {/* Mute Button */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isMuted
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {/* Reject Button */}
                    <button
                        onClick={onReject}
                        className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Reject Call"
                    >
                        <PhoneOff className="w-6 h-6" />
                    </button>

                    {/* Answer Button */}
                    <button
                        onClick={onAnswer}
                        className="w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl pulse-green"
                        title="Answer Call"
                    >
                        <Phone className="w-7 h-7" />
                    </button>
                </div>

                {/* Call Info */}
                <div className="text-center text-xs text-gray-500">
                    <p>Touch to answer or decline</p>
                </div>
            </div>

            {/* Ringing indicator */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
        </div>
    )
}
