import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (this.socket) return;

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            withCredentials: true,
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('socket connected:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('socket disconnected');
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();
