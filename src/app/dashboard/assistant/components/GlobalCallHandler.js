// frontend/src/app/dashboard/assistant/components/GlobalCallHandler.js
'use client'

import { useState, useEffect } from 'react'
import CallPopup from './CallPopup'
import CallInterface from './CallInterface'
import { useSocket } from '../hooks/useSocket'

export default function GlobalCallHandler() {
    const [incomingCall, setIncomingCall] = useState(null)
    const [activeCall, setActiveCall] = useState(null)
    const { socket, isConnected } = useSocket()

    // Listen for incoming calls across all assistant pages
    useEffect(() => {
        if (socket) {
            const handleIncomingCall = (callData) => {
                console.log('Incoming call received:', callData)
                setIncomingCall(callData)

                // Play notification sound (optional)
                if (typeof window !== 'undefined' && window.Audio) {
                    try {
                        const audio = new Audio('/notification.mp3') // Add notification sound file
                        audio.play().catch(e => console.log('Could not play notification sound'))
                    } catch (e) {
                        console.log('Audio not supported')
                    }
                }
            }

            const handleCallAnswered = (callData) => {
                console.log('Call answered:', callData)
                setActiveCall(callData)
                setIncomingCall(null)
            }

            const handleCallRejected = () => {
                console.log('Call rejected')
                setIncomingCall(null)
            }

            const handleCallEnded = (callSummary) => {
                console.log('Call ended:', callSummary)
                setActiveCall(null)
                setIncomingCall(null)
            }

            const handleCallFailed = (error) => {
                console.log('Call failed:', error)
                setIncomingCall(null)
                setActiveCall(null)
            }

            // Set up event listeners
            socket.on('incoming_call', handleIncomingCall)
            socket.on('call_answered', handleCallAnswered)
            socket.on('call_rejected', handleCallRejected)
            socket.on('call_ended', handleCallEnded)
            socket.on('call_failed', handleCallFailed)

            // Register as assistant for call routing
            socket.emit('register_assistant', {
                assistantId: 'assistant-' + Date.now(), // Replace with actual assistant ID
                status: 'available'
            })

            // Cleanup function
            return () => {
                socket.off('incoming_call', handleIncomingCall)
                socket.off('call_answered', handleCallAnswered)
                socket.off('call_rejected', handleCallRejected)
                socket.off('call_ended', handleCallEnded)
                socket.off('call_failed', handleCallFailed)
            }
        }
    }, [socket])

    // Handle browser visibility change (tab switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (socket && document.visibilityState === 'visible') {
                // Refresh connection when tab becomes visible
                socket.emit('assistant_online')
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [socket])

    const handleAnswerCall = () => {
        if (incomingCall && socket) {
            socket.emit('answer_call', {
                callId: incomingCall.callId,
                assistantId: 'assistant-' + Date.now() // Replace with actual assistant ID
            })
        }
    }

    const handleRejectCall = () => {
        if (incomingCall && socket) {
            socket.emit('reject_call', {
                callId: incomingCall.callId,
                assistantId: 'assistant-' + Date.now() // Replace with actual assistant ID
            })
        }
        setIncomingCall(null)
    }

    const handleEndCall = () => {
        if (activeCall && socket) {
            socket.emit('end_call', {
                callId: activeCall.callId,
                assistantId: 'assistant-' + Date.now() // Replace with actual assistant ID
            })
        }
        setActiveCall(null)
    }

    // Don't render anything if not connected
    if (!isConnected) {
        return null
    }

    return (
        <>
            {/* Call Popup - appears in bottom right corner */}
            {incomingCall && (
                <CallPopup
                    callData={incomingCall}
                    onAnswer={handleAnswerCall}
                    onReject={handleRejectCall}
                />
            )}

            {/* Active Call Interface - full screen overlay */}
            {activeCall && (
                <CallInterface
                    callData={activeCall}
                    socket={socket}
                    onEndCall={handleEndCall}
                />
            )}
        </>
    )
}
