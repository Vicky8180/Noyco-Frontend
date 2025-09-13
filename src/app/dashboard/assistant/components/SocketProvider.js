
// // # frontend/src/app/dashboard/assistant/components/SocketProvider.js
// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react'
// import io from 'socket.io-client'

// const SocketContext = createContext()

// export const useSocketContext = () => {
//     const context = useContext(SocketContext)
//     if (!context) {
//         throw new Error('useSocketContext must be used within a SocketProvider')
//     }
//     return context
// }

// export default function SocketProvider({ children }) {
//     const [socket, setSocket] = useState(null)
//     const [isConnected, setIsConnected] = useState(false)

//     useEffect(() => {
//         // Initialize socket connection
//         const socketInstance = io('http://localhost:8000', {
//             transports: ['websocket', 'polling'],
//             autoConnect: true,
//         })

//         socketInstance.on('connect', () => {
//             console.log('Socket connected:', socketInstance.id)
//             setIsConnected(true)
//         })

//         socketInstance.on('disconnect', () => {
//             console.log('Socket disconnected')
//             setIsConnected(false)
//         })

//         socketInstance.on('connect_error', (error) => {
//             console.error('Socket connection error:', error)
//             setIsConnected(false)
//         })

//         setSocket(socketInstance)

//         // Cleanup on unmount
//         return () => {
//             socketInstance.disconnect()
//         }
//     }, [])

//     const value = {
//         socket,
//         isConnected,
//     }

//     return (
//         <SocketContext.Provider value={value}>
//             {children}
//         </SocketContext.Provider>
//     )
// }



// frontend/src/app/dashboard/assistant/components/SocketProvider.js
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

export const useSocketContext = () => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider')
    }
    return context
}

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [connectionAttempts, setConnectionAttempts] = useState(0)
    const [lastConnected, setLastConnected] = useState(null)

    const connectSocket = useCallback(() => {
        // Don't create multiple connections
        if (socket?.connected) {
            return
        }

        console.log('Attempting to connect to socket...')

        // Initialize socket connection
        const socketInstance = io('http://localhost:8000', {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            timeout: 20000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            forceNew: true // Force new connection
        })

        socketInstance.on('connect', () => {
            console.log('Socket connected successfully:', socketInstance.id)
            setIsConnected(true)
            setConnectionAttempts(0)
            setLastConnected(new Date())

            // Register as assistant
            socketInstance.emit('register_assistant', {
                assistantId: 'assistant-' + socketInstance.id,
                status: 'available',
                timestamp: new Date().toISOString()
            })
        })

        socketInstance.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason)
            setIsConnected(false)
        })

        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error)
            setIsConnected(false)
            setConnectionAttempts(prev => prev + 1)
        })

        socketInstance.on('reconnect', (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts')
            setIsConnected(true)
            setConnectionAttempts(0)
        })

        socketInstance.on('reconnect_error', (error) => {
            console.error('Socket reconnection error:', error)
            setConnectionAttempts(prev => prev + 1)
        })

        socketInstance.on('reconnect_failed', () => {
            console.error('Socket reconnection failed')
            setIsConnected(false)
        })

        // Test connection periodically
        const heartbeat = setInterval(() => {
            if (socketInstance.connected) {
                socketInstance.emit('ping')
            }
        }, 30000)

        socketInstance.on('pong', () => {
            console.log('Socket heartbeat received')
        })

        setSocket(socketInstance)

        return () => {
            clearInterval(heartbeat)
            socketInstance.disconnect()
        }
    }, [socket])

    useEffect(() => {
        const cleanup = connectSocket()
        return cleanup
    }, [])

    // Auto-reconnect if connection lost
    useEffect(() => {
        if (!isConnected && connectionAttempts > 0 && connectionAttempts < 3) {
            const reconnectTimer = setTimeout(() => {
                console.log('Attempting to reconnect...')
                connectSocket()
            }, 2000 * connectionAttempts)

            return () => clearTimeout(reconnectTimer)
        }
    }, [isConnected, connectionAttempts, connectSocket])

    // Handle page visibility changes
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && socket && !socket.connected) {
                console.log('Page became visible, checking connection...')
                connectSocket()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [socket, connectSocket])

    const value = {
        socket,
        isConnected,
        connectionAttempts,
        lastConnected,
        reconnect: connectSocket
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}
