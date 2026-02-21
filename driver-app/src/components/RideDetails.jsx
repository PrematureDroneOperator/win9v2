import React from 'react';
import { User, MapPin, Navigation, Phone, MessageSquare, CheckCircle } from 'lucide-react';

export default function RideDetails({ ride, onComplete }) {
    if (!ride) return null;

    return (
        <div className="flex flex-col h-full bg-dark-900/50 relative">
            {/* Rider Info Area */}
            <div className="p-6 border-b border-dark-700 shrink-0">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Current Ride</h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-dark-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{ride.passengerName || 'Passenger'}</h2>
                            <div className="flex items-center text-yellow-500 text-sm mt-1">
                                ⭐ {ride.passengerRating || '4.9'}
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button className="p-3 bg-dark-700 hover:bg-dark-600 rounded-full text-white transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-dark-700 hover:bg-dark-600 rounded-full text-white transition-colors">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Addresses */}
            <div className="p-6 flex-1 overflow-y-auto space-y-8">
                <div className="space-y-6 relative">
                    <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-dark-700 z-0" />

                    <div className="flex items-start space-x-4 relative z-10">
                        <div className="flex-shrink-0 bg-dark-900 p-1 rounded-full">
                            <MapPin className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold tracking-wider mb-1">PICKUP</p>
                            <p className="text-white">{ride.pickupAddress || ride.pickupLocation?.address || (ride.pickupLat ? `Lat: ${ride.pickupLat.toFixed(4)}, Lng: ${ride.pickupLng.toFixed(4)}` : 'Pickup Address')}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4 relative z-10">
                        <div className="flex-shrink-0 bg-dark-900 p-1 rounded-full">
                            <Navigation className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold tracking-wider mb-1">DROP-OFF</p>
                            <p className="text-white">{ride.dropAddress || ride.dropLocation?.address || (ride.dropLat ? `Lat: ${ride.dropLat.toFixed(4)}, Lng: ${ride.dropLng.toFixed(4)}` : 'Drop-off Address')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Estimated ETA</span>
                        <span className="text-white font-bold text-lg text-primary">{ride.eta || '-- min'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Distance</span>
                        <span className="text-white font-medium">{ride.distance || '-- km'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Payment</span>
                        <span className="text-success font-semibold px-2 py-1 bg-success/10 rounded">Cash</span>
                    </div>
                </div>
            </div>

            {/* Action footer */}
            <div className="p-6 border-t border-dark-700 bg-dark-800 shrink-0">
                <button
                    onClick={onComplete}
                    className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold border border-transparent text-white bg-success hover:bg-green-600 transition-colors shadow-lg shadow-success/20"
                >
                    <CheckCircle className="w-6 h-6" />
                    <span>Mark Ride Completed</span>
                </button>
            </div>

        </div>
    );
}
