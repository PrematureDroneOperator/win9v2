'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import FloatingMetro from '@/components/FloatingMetro';
import ParticlesBackground from '@/components/ParticlesBackground';
import CTA from '@/components/CTA';

import axios from 'axios';
import { io } from 'socket.io-client';
import dynamic from 'next/dynamic';

import { metroStations } from '@/lib/mockData';
import { staggerContainer, slideUp } from '@/lib/animations';
import { Crosshair, MapPin, Navigation, User as DriverIcon, Star } from 'lucide-react';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white">Loading Map...</div>
});
import { useTranslation } from 'react-i18next';

export default function TrackingPage() {
    const { t } = useTranslation();
    const [destination, setDestination] = useState(metroStations[0]);
    const [eta, setEta] = useState('12 min');
    const [distance, setDistance] = useState('3.2 km');
    const [driverLocation, setDriverLocation] = useState({ lat: 18.5104, lng: 73.8467 });
    const [status, setStatus] = useState('En Route');
    const [assignedDriver, setAssignedDriver] = useState<any>(null);

    const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
    const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
    const [routePolyline, setRoutePolyline] = useState<[number, number][] | null>(null);
    const [driverCoords, setDriverCoords] = useState<[number, number] | null>(null);

    const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    const [fromInput, setFromInput] = useState('');
    const [toInput, setToInput] = useState('');
    const [pickupLocation, setPickupLocation] = useState('Kothrud, Pune');
    const [dropLocation, setDropLocation] = useState('');

    const [bookingId, setBookingId] = useState<string | null>(null);
    const [socket, setSocket] = useState<any>(null);

    // Initialize socket connection and listeners
    useEffect(() => {
        const newSocket = io('http://localhost:8080', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server:', newSocket.id);
        });

        newSocket.on('searchingDrivers', (data) => {
            setStatus(`Searching... (${data.count} drivers nearby)`);
        });

        newSocket.on('noDriversFound', () => {
            setStatus('No drivers found nearby. Try again.');
        });

        newSocket.on('newRideRequest', (data) => {
            console.log('Driver received ride request!', data);
        });

        newSocket.on('rideAccepted', (data) => {
            console.log('Ride accepted by driver!', data.driverId);
            setStatus('Driver Accepted - En Route');
            if (data.driverDetails) {
                setAssignedDriver(data.driverDetails);
            }
        });

        newSocket.on('driverLocationUpdate', (data) => {
            console.log('Live driver location received:', data);
            setDriverLocation({ lat: data.lat, lng: data.lon });
            setDriverCoords([data.lat, data.lon]);
            setStatus('Driver En Route 📍');
            setEta('Arriving Soon');
            setDistance('Nearby');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <main className="min-h-screen relative flex flex-col">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-tracking" />
                {/* Global Gradient Overlays */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 py-20 overflow-hidden flex-1">
                <FloatingMetro type="train" size="sm" className="top-20 right-10" delay={0} />

                <motion.div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        variants={slideUp}
                        className="mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            {t('tracking.title')}
                        </h1>
                        <p className="text-xl text-gray-300">
                            {t('tracking.subtitle')}
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        variants={slideUp}
                    >
                        {/* Map Area */}
                        <div className="lg:col-span-2">
                            <Card className="h-[600px] relative overflow-hidden border-none p-0">
                                <MapComponent
                                    pickupCoords={pickupCoords}
                                    dropCoords={dropCoords}
                                    driverCoords={driverCoords}
                                    routePolyline={routePolyline}
                                />
                            </Card>
                        </div>

                        {/* Info Panel */}
                        <div className="space-y-6">
                            {/* Trip Status */}
                            {/* <Card glass className="bg-metro-dark/80 backdrop-blur-md text-white border-metro-teal/30 shadow-lg shadow-metro-teal/10">
                                <h3 className="text-xl font-bold mb-4 text-metro-teal">{t('tracking.tripStatus')}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">{t('tracking.statusLabel')}</span>
                                        <span className="font-bold text-metro-teal">{status}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">{t('tracking.etaLabel')}</span>
                                        <span className="font-bold">{eta}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">{t('tracking.distanceLabel')}</span>
                                        <span className="font-bold">{distance}</span>
                                    </div>
                                </div>
                            </Card> */}
                            <Card
                                glass
                                className="bg-metro-dark/80 backdrop-blur-md text-white border-metro-teal/30 shadow-lg shadow-metro-teal/10"
                            >
                                <h3 className="text-xl font-bold mb-4 text-metro-teal">
                                    {t('tracking.tripStatus')}
                                </h3>

                                {!assignedDriver ? (
                                    <form
                                        className="space-y-4"
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            if (fromInput) setPickupLocation(fromInput);
                                            if (toInput) setDropLocation(toInput);
                                            console.log("Submit ride request", { from: fromInput, to: toInput });

                                            setStatus('Calculating route...');

                                            try {
                                                // 1. Geocode Pickup Location
                                                let pLat = 18.5104;
                                                let pLng = 73.8467;

                                                if (fromInput) {
                                                    const geoRes = await axios.get(`/api/geocode?q=${encodeURIComponent(fromInput)}`);
                                                    if (geoRes.data && geoRes.data.length > 0) {
                                                        pLat = parseFloat(geoRes.data[0].lat);
                                                        pLng = parseFloat(geoRes.data[0].lon);
                                                    }
                                                } else if (navigator.geolocation) {
                                                    await new Promise((resolve) => {
                                                        navigator.geolocation.getCurrentPosition((pos) => {
                                                            pLat = pos.coords.latitude;
                                                            pLng = pos.coords.longitude;
                                                            resolve(true);
                                                        }, () => resolve(false));
                                                    });
                                                }

                                                setPickupCoords([pLat, pLng]);

                                                // 2. Predict Nearest Metro Station
                                                let closestStation: any = metroStations[0];
                                                let minDistance = Infinity;

                                                const puneMetros = [
                                                    { name: 'PCMC', lat: 18.6278, lng: 73.8058 },
                                                    { name: 'Sant Tukaram Nagar', lat: 18.6186, lng: 73.8152 },
                                                    { name: 'Bhosari (Nashik Phata)', lat: 18.6087, lng: 73.8184 },
                                                    { name: 'Kasarwadi', lat: 18.5982, lng: 73.8207 },
                                                    { name: 'Phugewadi', lat: 18.5878, lng: 73.8252 },
                                                    { name: 'Dapodi', lat: 18.5786, lng: 73.8315 },
                                                    { name: 'Bopodi', lat: 18.5670, lng: 73.8340 },
                                                    { name: 'Shivajinagar', lat: 18.5314, lng: 73.8446 },
                                                    { name: 'Civil Court', lat: 18.5284, lng: 73.8541 },
                                                    { name: 'Vanaz', lat: 18.5085, lng: 73.8010 },
                                                    { name: 'Anand Nagar', lat: 18.5038, lng: 73.8124 },
                                                    { name: 'Ideal Colony', lat: 18.5029, lng: 73.8210 },
                                                    { name: 'Nal Stop', lat: 18.5074, lng: 73.8331 },
                                                    { name: 'Garware College', lat: 18.5135, lng: 73.8406 },
                                                    { name: 'Deccan Gymkhana', lat: 18.5152, lng: 73.8440 },
                                                    { name: 'Pune Railway Station', lat: 18.5289, lng: 73.8744 },
                                                    { name: 'Ruby Hall Clinic', lat: 18.5303, lng: 73.8804 },
                                                    { name: 'Bund Garden', lat: 18.5358, lng: 73.8858 },
                                                    { name: 'Kalyani Nagar', lat: 18.5471, lng: 73.9033 },
                                                    { name: 'Ramwadi', lat: 18.5574, lng: 73.9182 }
                                                ];

                                                for (const station of puneMetros) {
                                                    const dist = getDistanceFromLatLonInKm(pLat, pLng, station.lat, station.lng);
                                                    if (dist < minDistance) {
                                                        minDistance = dist;
                                                        closestStation = station;
                                                    }
                                                }

                                                let dLat = closestStation.lat;
                                                let dLng = closestStation.lng;

                                                if (toInput) {
                                                    const toGeoRes = await axios.get(`/api/geocode?q=${encodeURIComponent(toInput)}`);
                                                    if (toGeoRes.data && toGeoRes.data.length > 0) {
                                                        dLat = parseFloat(toGeoRes.data[0].lat);
                                                        dLng = parseFloat(toGeoRes.data[0].lon);
                                                    }
                                                } else {
                                                    setDestination(closestStation.name);
                                                    setDropLocation(`${closestStation.name} Metro Station`);
                                                }

                                                setDropCoords([dLat, dLng]);

                                                // 3. Get Route polyline from OSRM
                                                const osrmRes = await axios.get(`https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`);
                                                if (osrmRes.data && osrmRes.data.routes && osrmRes.data.routes.length > 0) {
                                                    const coords = osrmRes.data.routes[0].geometry.coordinates;
                                                    const flippedCoords = coords.map((c: any) => [c[1], c[0]]);
                                                    setRoutePolyline(flippedCoords);

                                                    const etaMins = Math.round(osrmRes.data.routes[0].duration / 60);
                                                    const distKm = (osrmRes.data.routes[0].distance / 1000).toFixed(1);
                                                    setEta(`${etaMins} min`);
                                                    setDistance(`${distKm} km`);
                                                }

                                                // 4. Request Ride via Socket
                                                if (socket) {
                                                    const newBookingId = `ORD-${Date.now()}`;
                                                    setBookingId(newBookingId);
                                                    setStatus('Requesting ride...');

                                                    socket.emit("joinBookingRoom", { bookingId: newBookingId });
                                                    socket.emit("requestRide", {
                                                        bookingId: newBookingId,
                                                        userId: "user_test_999",
                                                        pickupLat: pLat,
                                                        pickupLng: pLng,
                                                        dropLat: dLat,
                                                        dropLng: dLng,
                                                        pickupAddress: fromInput || 'Current Location',
                                                        dropAddress: dropLocation || `${destination.name} Metro Station`
                                                    });
                                                }
                                            } catch (error) {
                                                console.error("Error setting up route", error);
                                                setStatus('Error calculating route');
                                            }
                                        }}
                                    >
                                        {/* FROM INPUT */}
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-gray-300 text-sm">From</label>
                                            <div className="flex gap-2 relative">
                                                <input
                                                    type="text"
                                                    value={fromInput}
                                                    onChange={(e) => setFromInput(e.target.value)}
                                                    placeholder="Enter pickup location"
                                                    className="w-full bg-metro-dark/60 border border-metro-teal/30 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-metro-teal focus:ring-1 focus:ring-metro-teal"
                                                    disabled={bookingId !== null}
                                                />
                                                <button
                                                    type="button"
                                                    title="Locate Me precisely"
                                                    disabled={bookingId !== null}
                                                    onClick={() => {
                                                        if (navigator.geolocation) {
                                                            navigator.geolocation.getCurrentPosition(
                                                                async (pos) => {
                                                                    const lat = pos.coords.latitude;
                                                                    const lng = pos.coords.longitude;
                                                                    setPickupCoords([lat, lng]);
                                                                    setFromInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                                                                },
                                                                (err) => console.error(err),
                                                                { enableHighAccuracy: true }
                                                            );
                                                        }
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-metro-teal transition-colors disabled:opacity-50"
                                                >
                                                    <Crosshair className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* TO INPUT */}
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-gray-300 text-sm">To</label>
                                            <input
                                                type="text"
                                                value={toInput}
                                                onChange={(e) => setToInput(e.target.value)}
                                                placeholder="Enter destination"
                                                className="bg-metro-dark/60 border border-metro-teal/30 rounded-lg px-4 py-2 focus:outline-none focus:border-metro-teal focus:ring-1 focus:ring-metro-teal"
                                                disabled={bookingId !== null}
                                            />
                                        </div>

                                        {/* SUBMIT BUTTON */}
                                        <button
                                            type="submit"
                                            disabled={bookingId !== null}
                                            className="w-full bg-metro-teal text-black font-bold py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md shadow-metro-teal/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {bookingId ? status : 'Book Ride'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="flex flex-col items-center justify-center space-y-4 py-8 bg-dark-800/40 rounded-xl border border-metro-teal/20">
                                        <div className="w-16 h-16 rounded-full bg-metro-teal/20 flex items-center justify-center mt-2 relative">
                                            <div className="absolute inset-0 bg-metro-teal/20 rounded-full animate-ping"></div>
                                            <DriverIcon className="w-8 h-8 text-metro-teal" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <h4 className="text-white text-lg font-bold">Trip in Progress</h4>
                                            <p className="text-metro-teal font-medium text-sm">{status}</p>
                                        </div>

                                        <div className="flex w-full justify-around mt-4 pt-4 border-t border-dark-600">
                                            <div className="text-center flex-1 border-r border-dark-600">
                                                <p className="text-xs text-gray-400">ETA</p>
                                                <p className="font-bold text-white">{eta}</p>
                                            </div>
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-gray-400">Distance</p>
                                                <p className="font-bold text-white">{distance}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Route Details */}
                            <Card glass className="text-white">
                                <h3 className="text-xl font-bold text-white mb-4">{t('tracking.routeDetails')}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="mr-3 bg-metro-teal/20 p-2 rounded-full"><MapPin className="text-metro-teal w-5 h-5" /></div>
                                        <div>
                                            <p className="font-semibold text-white">{t('tracking.pickup')}</p>
                                            <p className="text-sm text-gray-300">{pickupLocation}</p>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-metro-teal h-8 ml-[1.15rem]"></div>

                                    <div className="flex items-start">
                                        <div className="mr-3 bg-red-500/20 p-2 rounded-full"><Navigation className="text-red-500 w-5 h-5" /></div>
                                        <div>
                                            <p className="font-semibold text-white">{t('tracking.destination')}</p>
                                            <p className="text-sm text-gray-300">
                                                {dropLocation || `${destination.name} ${t('tracking.metroStationSuffix')}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Driver Info */}
                            <Card glass className="text-white relative overflow-hidden">
                                <h3 className="text-xl font-bold mb-4">{t('tracking.driverDetails')}</h3>
                                {assignedDriver ? (
                                    <>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-metro-teal opacity-10 rounded-full blur-2xl"></div>
                                        <div className="flex items-center mb-4 relative z-10">
                                            <div className="mr-4 bg-metro-teal/20 p-3 rounded-full border border-metro-teal/30">
                                                <DriverIcon className="text-metro-teal w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg capitalize">{assignedDriver.firstname} {assignedDriver.lastname}</p>
                                                <div className="flex items-center gap-1 bg-dark-800/80 px-2 py-0.5 rounded-full mt-1 w-fit border border-dark-600">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-medium">{assignedDriver.Rating || '5.0'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 text-sm relative z-10 bg-dark-800/50 p-4 rounded-xl border border-dark-600/50">
                                            <div className="flex justify-between items-center border-b border-dark-600 pb-2">
                                                <span className="text-gray-400">{t('tracking.vehicle')} Type</span>
                                                <span className="font-semibold capitalize text-white">{assignedDriver.vehicleType || 'Car'}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-dark-600 pb-2">
                                                <span className="text-gray-400">Model</span>
                                                <span className="font-semibold text-white">{assignedDriver.vehicleModel || 'Honda City'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 min-w-max">License Plate</span>
                                                <span className="font-mono bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-right ml-2 border border-yellow-500/20">{assignedDriver.vehicleNumber || 'MH 12 AB 1234'}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center p-6 text-gray-400 italic">
                                        Waiting for driver assignment...
                                    </div>
                                )}
                            </Card>

                            {/* Nearby Stations */}
                            <Card glass className="text-white">
                                <h3 className="text-xl font-bold text-white mb-4">{t('tracking.nearbyStations')}</h3>
                                <div className="space-y-2">
                                    {metroStations
                                        .map(station => {
                                            const dist = pickupCoords ? getDistanceFromLatLonInKm(pickupCoords[0], pickupCoords[1], station.lat, station.lng) : Infinity;
                                            return { ...station, dist };
                                        })
                                        .sort((a, b) => a.dist - b.dist)
                                        .slice(0, 5)
                                        .map((station) => (
                                            <div
                                                key={station.id}
                                                className="flex items-center justify-between p-2 rounded hover:bg-white/10 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setDestination(station);
                                                    setToInput(station.name);
                                                    setDropLocation(`${station.name} Metro Station`);
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <Navigation className="text-metro-teal w-4 h-4 mr-2 opacity-80" />
                                                    <span className="text-sm font-medium">{station.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {station.dist !== Infinity ? `${station.dist.toFixed(1)} km • ` : ''} {station.line} {t('tracking.line')}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div className="relative z-10">
                <CTA />
            </div>
        </main >
    );
}
