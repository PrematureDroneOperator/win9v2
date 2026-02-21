import { useState, useEffect } from 'react';

export function useLocation(isActive) {
    const [location, setLocation] = useState({ lat: 18.5104, lng: 73.8467, heading: 0, speed: 0 }); // Fallback to Pune coordinates
    const [error, setError] = useState(null);

    useEffect(() => {
        let watchId;

        if (isActive && 'geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        heading: position.coords.heading,
                        speed: position.coords.speed
                    });
                    setError(null);
                },
                (err) => {
                    setError(err.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [isActive]);

    return { location, error };
}
