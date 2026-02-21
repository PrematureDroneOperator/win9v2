import { useEffect } from 'react';
import { socketService } from '../services/socket';
import { useAuth } from './useAuth';

export function useSocket() {
    const { token, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token) {
            socketService.connect(token);
        }

        return () => {
            // We don't necessarily want to disconnect on every re-render or hook unmount
            // But for strict cleanup when auth changes:
            // socketService.disconnect();
        };
    }, [isAuthenticated, token]);

    return socketService.socket;
}
