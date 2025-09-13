// # frontend/src/app/dashboard/assistant/hooks/useSocket.js
import { useSocketContext } from '../components/SocketProvider'

export const useSocket = () => {
    return useSocketContext()
}
