import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useLocation } from '../hooks/useLocation';
import Map from '../components/Map';
import StatusToggle from '../components/StatusToggle';
import RideRequestModal from '../components/RideRequestModal';
import RideDetails from '../components/RideDetails';
import { LogOut, User, Clock, MapPin, Navigation } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const socket = useSocket();
    const [status, setStatus] = useState('Offline'); // Offline, Available, On Trip
    const { location, error: locationError } = useLocation(true); // Always track locally to show on map

    const [incomingRequest, setIncomingRequest] = useState(null);
    const [currentRide, setCurrentRide] = useState(null);
    const [routePolyline, setRoutePolyline] = useState(null);

    // Ride History
    const [previousRides, setPreviousRides] = useState([]);
    const { token } = useAuth(); // for making authenticated requests

    const fetchHistory = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
            const res = await axios.get(`${API_URL}/api/bookings/driver/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPreviousRides(res.data);
        } catch (err) {
            console.error("Failed to fetch driver history", err);
        }
    };

    useEffect(() => {
        if (token && status === 'Available') {
            fetchHistory();
        }
    }, [token, status]);

    // Handle Socket Events
    useEffect(() => {
        if (!socket) return;

        const handleNewRequest = (rideData) => {
            // Only show if driver is available
            if (status === 'Available') {
                setIncomingRequest(rideData);
            }
        };

        const handleRideCancelled = (rideId) => {
            if (incomingRequest?.id === rideId) {
                setIncomingRequest(null);
            }
            if (currentRide?.id === rideId) {
                setCurrentRide(null);
                setStatus('Available');
                alert('Ride was cancelled by the user.');
            }
        };

        socket.on('newRideRequest', handleNewRequest);
        socket.on('rideCancelled', handleRideCancelled);

        return () => {
            socket.off('newRideRequest', handleNewRequest);
            socket.off('rideCancelled', handleRideCancelled);
        };
    }, [socket, status, incomingRequest, currentRide]);

    // Send Location Updates
    useEffect(() => {
        if (socket && location && status !== 'Offline') {
            console.log(location)
            // Throttle to every 3 seconds inside the component or server side, 
            // but watchPosition only triggers on change. 
            // Emitting on location change is usually fine, but let's implement a 3s interval if we strictly want that.
            socket.emit('driverLocationUpdate', {
                driverId: user?.id,
                lat: location.lat,
                lon: location.lng,
                status,
                bookingId: currentRide?.bookingId // Stream location to the user room
            });
        }
    }, [location, socket, status, user]);

    const handleStatusChange = (newStatus) => {
        console.log(newStatus)
        setStatus(newStatus);
        if (socket) {
            if (newStatus === "Offline" || newStatus === "offline") {
                socket.emit('driveOffline', user?.id);
            }
            if (newStatus === "Available" || newStatus === "available") {
                socket.emit('driverOnline', user?.id);
            }
        }
    };

    const handleAcceptRide = async () => {
        if (socket && incomingRequest) {
            // Note: backend expects bookingId, not rideId
            socket.emit('acceptRide', {
                bookingId: incomingRequest.bookingId,
                driverId: user?.id,
                userId: incomingRequest.userId,
                pickupLat: incomingRequest.pickupLat,
                pickupLng: incomingRequest.pickupLng,
                dropLat: incomingRequest.dropLat,
                dropLng: incomingRequest.dropLng,
                pickupAddress: incomingRequest.pickupAddress,
                dropAddress: incomingRequest.dropAddress
            });

            // Generate routing Polyline for the Map
            if (incomingRequest.pickupLat && incomingRequest.pickupLng && incomingRequest.dropLat && incomingRequest.dropLng) {
                try {
                    const pLng = incomingRequest.pickupLng;
                    const pLat = incomingRequest.pickupLat;
                    const dLng = incomingRequest.dropLng;
                    const dLat = incomingRequest.dropLat;

                    const osrmRes = await axios.get(`https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`);
                    if (osrmRes.data && osrmRes.data.routes && osrmRes.data.routes.length > 0) {
                        const coords = osrmRes.data.routes[0].geometry.coordinates;
                        const flippedCoords = coords.map((c) => [c[1], c[0]]);
                        setRoutePolyline(flippedCoords);

                        // Parse ETA and distance
                        incomingRequest.eta = Math.round(osrmRes.data.routes[0].duration / 60) + ' min';
                        incomingRequest.distance = (osrmRes.data.routes[0].distance / 1000).toFixed(1) + ' km';
                    }
                } catch (e) {
                    console.error("OSRM Route failure on driver app", e);
                }
            }

            setCurrentRide(incomingRequest);
            setIncomingRequest(null);
            handleStatusChange('On Trip');
        }
    };

    const handleRejectRide = () => {
        setIncomingRequest(null);
    };

    const handleCompleteRide = () => {
        if (socket && currentRide) {
            // backend may not have implemented this, but sending bookingId for safety
            socket.emit('completeRide', { bookingId: currentRide.bookingId, driverId: user?.id });
        }
        setCurrentRide(null);
        setRoutePolyline(null); // Clear map paths
        handleStatusChange('Available');
    };

    return (
        <div className="h-screen w-full flex flex-col bg-dark-900 overflow-hidden">
            {/* Header */}
            <header className="bg-dark-800 border-b border-dark-700 p-4 flex justify-between items-center z-10 shadow-md">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-white font-semibold">{user?.name || 'Driver'}</h2>
                        <div className="flex items-center text-sm text-gray-400 space-x-2">
                            <span>{user?.email}</span>
                            <span>•</span>
                            <span className="flex items-center text-yellow-500">⭐ {user?.rating || '5.0'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <StatusToggle status={status} onChange={handleStatusChange} disabled={status === 'On Trip'} />
                    <button
                        onClick={logout}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Wait, logout?"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col md:flex-row">

                {/* Left Panel - Ride Details if On Trip */}
                {status === 'On Trip' && currentRide ? (
                    <div className="w-full md:w-96 bg-dark-800 border-r border-dark-700 z-10 flex flex-col hide-scrollbar overflow-y-auto">
                        <RideDetails ride={currentRide} onComplete={handleCompleteRide} />
                    </div>
                ) : (
                    <div className="w-full md:w-96 bg-dark-800 border-r border-dark-700 z-10 flex flex-col hide-scrollbar overflow-y-auto p-4">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" /> Previous Rides
                        </h3>
                        {previousRides.length === 0 ? (
                            <p className="text-gray-400 text-sm">No rides found in history.</p>
                        ) : (
                            <div className="space-y-4">
                                {previousRides.map((ride, idx) => (
                                    <div key={idx} className="bg-dark-700 p-4 rounded-xl border border-dark-600">
                                        <p className="text-sm text-gray-400 mb-2">{new Date(ride.pickupDate).toLocaleString()}</p>
                                        <p className="text-sm text-white font-medium break-all">ID: {ride.orderNumber}</p>
                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-start gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                <span className="text-gray-300">
                                                    {Array.isArray(ride.pickupLocation) ? `${ride.pickupLocation[1]?.toFixed(4)}, ${ride.pickupLocation[0]?.toFixed(4)}` : 'Unknown'}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm">
                                                <Navigation className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                <span className="text-gray-300">
                                                    {Array.isArray(ride.dropLocation) ? `${ride.dropLocation[1]?.toFixed(4)}, ${ride.dropLocation[0]?.toFixed(4)}` : 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-between items-center bg-dark-800 p-2 rounded-lg">
                                            <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{ride.status}</span>
                                            <span className="text-primary text-sm font-semibold">Verified</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Map Area */}
                <div className="flex-1 relative z-0">
                    <Map
                        driverCoords={location ? [location.lat, location.lng] : null}
                        pickupCoords={currentRide && currentRide.pickupLat ? [currentRide.pickupLat, currentRide.pickupLng] : null}
                        dropCoords={currentRide && currentRide.dropLat ? [currentRide.dropLat, currentRide.dropLng] : null}
                        routePolyline={routePolyline}
                    />

                    {/* Overlay Status Badge */}
                    <div className="absolute top-4 right-4 z-[400]">
                        <div className={`px-4 py-2 rounded-full shadow-lg font-medium text-sm backdrop-blur-md border border-white/10
              ${status === 'Available' ? 'bg-success/20 text-success' :
                                status === 'On Trip' ? 'bg-primary/20 text-primary' :
                                    'bg-dark-700/80 text-gray-400'}`}>
                            Status: {status}
                        </div>
                    </div>

                    {locationError && (
                        <div className="absolute top-4 left-4 z-[400] bg-danger/90 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
                            Location Error: {locationError}
                        </div>
                    )}
                </div>
            </main>

            {/* Ride Request Modal */}
            {incomingRequest && (
                <RideRequestModal
                    request={incomingRequest}
                    onAccept={handleAcceptRide}
                    onReject={handleRejectRide}
                />
            )}
        </div>
    );
}
