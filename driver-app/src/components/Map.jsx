import React, { useEffect, useRef } from 'react';
import { Crosshair } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons using modern HTML rendering instead of static images
const createDotIcon = (colorClass) => L.divIcon({
    className: 'custom-pulsing-dot',
    html: `<div class="w-4 h-4 rounded-full ${colorClass} shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-white relative cursor-pointer">
             <div class="absolute inset-0 rounded-full ${colorClass} animate-ping opacity-75"></div>
           </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
});

// Use smaller animated dots for tracking moving objects (Drivers, Users)
const pickupIcon = createDotIcon('bg-green-500');
const driverIcon = createDotIcon('bg-blue-500');

// Keep dropoff as a stationary PIN
const dropIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

export default function Map({ pickupCoords, dropCoords, driverCoords, routePolyline }) {
    const mapRef = useRef(null);

    const pickupMarkerRef = useRef(null);
    const dropMarkerRef = useRef(null);
    const driverMarkerRef = useRef(null);
    const polylineRef = useRef(null);

    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        if (mapRef.current) {
            mapRef.current.remove();
        }

        const map = L.map(containerRef.current, {
            center: [18.5204, 73.8567], // Pune
            zoom: 13,
            zoomControl: false,
        });

        // OpenStreetMap Bright tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        // Pickup
        if (pickupCoords) {
            if (!pickupMarkerRef.current) {
                pickupMarkerRef.current = L.marker(pickupCoords, { icon: pickupIcon }).bindPopup("Pickup").addTo(map);
            } else {
                pickupMarkerRef.current.setLatLng(pickupCoords);
            }
        } else if (pickupMarkerRef.current) {
            map.removeLayer(pickupMarkerRef.current);
            pickupMarkerRef.current = null;
        }

        // Dropoff
        if (dropCoords) {
            if (!dropMarkerRef.current) {
                dropMarkerRef.current = L.marker(dropCoords, { icon: dropIcon }).bindPopup("Drop-off").addTo(map);
            } else {
                dropMarkerRef.current.setLatLng(dropCoords);
            }
        } else if (dropMarkerRef.current) {
            map.removeLayer(dropMarkerRef.current);
            dropMarkerRef.current = null;
        }

        // Driver
        if (driverCoords) {
            if (!driverMarkerRef.current) {
                driverMarkerRef.current = L.marker(driverCoords, { icon: driverIcon }).bindPopup("You").addTo(map);
            } else {
                driverMarkerRef.current.setLatLng(driverCoords);
            }
        } else if (driverMarkerRef.current) {
            map.removeLayer(driverMarkerRef.current);
            driverMarkerRef.current = null;
        }

        // Polyline
        if (routePolyline && routePolyline.length > 0) {
            if (!polylineRef.current) {
                polylineRef.current = L.polyline(routePolyline, { color: '#00e5ff', weight: 4 }).addTo(map);
            } else {
                polylineRef.current.setLatLngs(routePolyline);
            }
        } else if (polylineRef.current) {
            map.removeLayer(polylineRef.current);
            polylineRef.current = null;
        }

        // Auto fitting logic
        const boundsArr = [];
        if (pickupCoords) boundsArr.push(pickupCoords);
        if (dropCoords) boundsArr.push(dropCoords);
        if (driverCoords) boundsArr.push(driverCoords); // Ensure Driver stays in frame
        if (routePolyline && routePolyline.length > 0) {
            routePolyline.forEach(c => boundsArr.push(c));
        }

        if (boundsArr.length > 0) {
            const bounds = L.latLngBounds(boundsArr);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        } else if (driverCoords && !pickupCoords) {
            map.setView(driverCoords, 15);
        }

    }, [pickupCoords, dropCoords, driverCoords, routePolyline]);

    const handleLocateMe = () => {
        if (mapRef.current && driverCoords) {
            mapRef.current.setView(driverCoords, 16);
        }
    };

    return (
        <div className="w-full h-full z-0 relative">
            <div ref={containerRef} className="w-full h-full" />

            {driverCoords && (
                <button
                    onClick={handleLocateMe}
                    className="absolute bottom-6 right-6 z-[1000] bg-dark-800 p-3 rounded-full text-white shadow-lg border border-dark-600 hover:bg-dark-700 hover:text-primary transition-all"
                    title="Locate Me"
                >
                    <Crosshair className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}
