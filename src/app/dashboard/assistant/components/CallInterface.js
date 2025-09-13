// # frontend/src/app/dashboard/assistant/components/CallInterface.js

'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Phone,
    PhoneOff,
    Mic,
    MicOff,
    Video,
    VideoOff,
    MessageCircle,
    FileText,
    Minimize2,
    Maximize2,
    Send,
    X,
    User
} from 'lucide-react'

export default function CallInterface({ callData, socket, onEndCall }) {
    const [isMinimized, setIsMinimized] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [activeTab, setActiveTab] = useState('chat')
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [note, setNote] = useState('')
    const [callDuration, setCallDuration] = useState(0)
    const [callStatus, setCallStatus] = useState('Connected')
    const chatEndRef = useRef(null)
    const startTimeRef = useRef(new Date())

    // Timer for call duration
    useEffect(() => {
        const timer = setInterval(() => {
            setCallDuration(Math.floor((new Date() - startTimeRef.current) / 1000))
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Socket listeners
    useEffect(() => {
        if (socket) {
            socket.on('new_message', (messageData) => {
                setMessages(prev => [...prev, messageData])
            })

            socket.on('note_added', (noteData) => {
                setMessages(prev => [...prev, noteData])
            })

            socket.on('mute_toggled', (data) => {
                setIsMuted(data.muted)
            })

            return () => {
                socket.off('new_message')
                socket.off('note_added')
                socket.off('mute_toggled')
            }
        }
    }, [socket])

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleSendMessage = () => {
        if (newMessage.trim() && socket) {
            socket.emit('send_message', {
                callId: callData.callId,
                message: newMessage,
                sender: 'You'
            })
            setNewMessage('')
        }
    }

    const handleAddNote = () => {
        if (note.trim() && socket) {
            socket.emit('add_note', {
                callId: callData.callId,
                note: note
            })
            setNote('')
        }
    }

    const toggleMute = () => {
        const newMuted = !isMuted
        setIsMuted(newMuted)
        if (socket) {
            socket.emit('toggle_mute', {
                callId: callData.callId,
                muted: newMuted
            })
        }
    }

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <div className="bg-blue-500 text-white rounded-lg shadow-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => setIsMinimized(false)}>
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Call in progress</span>
                    <span className="text-xs">{formatTime(callDuration)}</span>
                    <Maximize2 className="w-5 h-5" />
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col animate-slide-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">John Doe</h3>
                            <div className="flex items-center gap-2 text-sm opacity-90">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>{callStatus}</span>
                                <span>•</span>
                                <span>{formatTime(callDuration)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                            title="Minimize"
                        >
                            <Minimize2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onEndCall}
                            className="p-2 hover:bg-red-500 rounded-lg transition-colors"
                            title="End Call"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel - Call Controls & Video */}
                    <div className="w-1/3 border-r border-gray-200 flex flex-col">
                        {/* Video Area */}
                        <div className="flex-1 bg-gray-900 relative flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <User className="w-12 h-12" />
                                </div>
                                <p className="text-lg font-medium">John Doe</p>
                                <p className="text-sm opacity-75">Audio Call</p>
                            </div>

                            {/* Small self video */}
                            <div className="absolute top-4 right-4 w-20 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        {/* Call Controls */}
                        <div className="p-4 bg-gray-50">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={toggleMute}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    title={isMuted ? 'Unmute' : 'Mute'}
                                >
                                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>

                                <button
                                    onClick={() => setIsVideoOff(!isVideoOff)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    title={isVideoOff ? 'Turn on video' : 'Turn off video'}
                                >
                                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                                </button>

                                <button
                                    onClick={onEndCall}
                                    className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all"
                                    title="End Call"
                                >
                                    <PhoneOff className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Chat & Notes */}
                    <div className="flex-1 flex flex-col">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 px-4 pt-4">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab('chat')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-t-lg transition-colors ${activeTab === 'chat'
                                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Chat</span>
                                    {messages.filter(m => m.type === 'chat').length > 0 && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                                            {messages.filter(m => m.type === 'chat').length}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveTab('notes')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-t-lg transition-colors ${activeTab === 'notes'
                                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Notes</span>
                                    {messages.filter(m => m.type === 'note').length > 0 && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                                            {messages.filter(m => m.type === 'note').length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {activeTab === 'chat' ? (
                                <>
                                    {/* Chat Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {messages.filter(m => m.type === 'chat').length === 0 ? (
                                            <div className="text-center text-gray-500 mt-8">
                                                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>No messages yet</p>
                                                <p className="text-sm">Start a conversation!</p>
                                            </div>
                                        ) : (
                                            messages
                                                .filter(m => m.type === 'chat')
                                                .map((message) => (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div
                                                            className={`max-w-xs rounded-lg px-3 py-2 ${message.sender === 'You'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-200 text-gray-800'
                                                                }`}
                                                        >
                                                            <p className="text-sm">{message.message}</p>
                                                            <p className="text-xs opacity-75 mt-1">
                                                                {new Date(message.timestamp).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Chat Input */}
                                    <div className="border-t border-gray-200 p-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Type a message..."
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!newMessage.trim()}
                                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Notes */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {messages.filter(m => m.type === 'note').length === 0 ? (
                                            <div className="text-center text-gray-500 mt-8">
                                                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>No notes yet</p>
                                                <p className="text-sm">Add notes during the call</p>
                                            </div>
                                        ) : (
                                            messages
                                                .filter(m => m.type === 'note')
                                                .map((note) => (
                                                    <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                        <p className="text-sm text-gray-800">{note.content}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(note.timestamp).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))
                                        )}
                                    </div>

                                    {/* Note Input */}
                                    <div className="border-t border-gray-200 p-4">
                                        <div className="space-y-2">
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Add a note about this call..."
                                                rows={3}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                            />
                                            <button
                                                onClick={handleAddNote}
                                                disabled={!note.trim()}
                                                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white py-2 rounded-lg transition-colors"
                                            >
                                                Add Note
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
