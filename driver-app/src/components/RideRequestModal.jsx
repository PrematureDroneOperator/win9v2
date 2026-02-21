import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

export default function RideRequestModal({ request, onAccept, onReject }) {
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        // Auto-dismiss after 10s
        if (timeLeft === 0) {
            onReject();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onReject]);

    if (!request) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header content */}
                <div className="p-6 pb-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">New Ride Request</h3>
                        <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-primary font-bold shadow-inner">
                            {timeLeft}s
                        </div>
                    </div>

                    <div className="space-y-5 relative">
                        <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-dark-700 z-0 hidden lg:block" />

                        <div className="flex items-start space-x-4 relative z-10">
                            <div className="mt-1 flex-shrink-0">
                                <MapPin className="w-6 h-6 text-green-500 fill-green-500/20" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">PICKUP</p>
                                <p className="text-white font-semibold">
                                    {request.pickupAddress || (request.pickupLat ? `Lat: ${request.pickupLat.toFixed(4)}, Lng: ${request.pickupLng.toFixed(4)}` : 'Unknown Pickup')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 relative z-10">
                            <div className="mt-1 flex-shrink-0">
                                <Navigation className="w-6 h-6 text-primary fill-primary/20" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">DROP-OFF</p>
                                <p className="text-white font-semibold">
                                    {request.dropAddress || (request.dropLat ? `Lat: ${request.dropLat.toFixed(4)}, Lng: ${request.dropLng.toFixed(4)}` : 'Unknown Destination')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-dark-900/50 rounded-xl flex justify-between items-center border border-white/5">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">{request.estimatedDuration || '15 min'}</span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Est. Distance</p>
                            <p className="text-lg font-bold text-white">{request.estimatedDistance || '3.2 km'}</p>
                        </div>
                    </div>
                </div>

                {/* Actions bar with 2 buttons side by side */}
                <div className="flex border-t border-dark-700">
                    <button
                        onClick={onReject}
                        className="flex-1 py-4 text-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                    >
                        Decline
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-1 py-4 text-center bg-primary text-white hover:bg-blue-600 transition-colors font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    >
                        Accept Ride
                    </button>
                </div>

                {/* Progress bar visualizing time left */}
                <div className="h-1 w-full bg-dark-700">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / 10) * 100}%` }}
                    />
                </div>

            </div>
        </div>
    );
}
