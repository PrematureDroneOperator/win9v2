import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons using modern HTML rendering instead of static images
const createDotIcon = (colorClass: string) => L.divIcon({
    className: 'custom-pulsing-dot',
    html: `<div class="w-4 h-4 rounded-full ${colorClass} shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-white relative">
             <div class="absolute inset-0 rounded-full ${colorClass} animate-ping opacity-75"></div>
           </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
});

// A standard larger pin for the dropoff destination, and dots for people/pickup
const pickupIcon = createDotIcon('bg-green-500');
const driverIcon = createDotIcon('bg-blue-500');
const userIcon = createDotIcon('bg-primary');

const dropIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapComponentProps {
    pickupCoords: [number, number] | null;
    dropCoords: [number, number] | null;
    driverCoords: [number, number] | null;
    routePolyline: [number, number][] | null;
}

const defaultCenter: [number, number] = [18.5204, 73.8567];

const MapComponent = React.memo(({ pickupCoords, dropCoords, driverCoords, routePolyline }: MapComponentProps) => {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Marker refs to update them without re-rendering the map
    const pickupMarkerRef = useRef<L.Marker | null>(null);
    const dropMarkerRef = useRef<L.Marker | null>(null);
    const driverMarkerRef = useRef<L.Marker | null>(null);
    const polylineRef = useRef<L.Polyline | null>(null);

    // Initialize map
    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up previous instance if it exists before creating a new one
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        mapRef.current = L.map(containerRef.current, {
            center: defaultCenter,
            zoom: 13,
            zoomControl: false,
        });

        // Use standard bright OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Effect for handling props updates (markers and polyline)
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        // Handle Pickup Marker
        if (pickupCoords) {
            if (!pickupMarkerRef.current) {
                pickupMarkerRef.current = L.marker(pickupCoords, { icon: pickupIcon }).addTo(map)
                    .bindPopup("Pickup Location");
            } else {
                pickupMarkerRef.current.setLatLng(pickupCoords);
            }
        } else if (pickupMarkerRef.current) {
            map.removeLayer(pickupMarkerRef.current);
            pickupMarkerRef.current = null;
        }

        // Handle Drop Marker
        if (dropCoords) {
            if (!dropMarkerRef.current) {
                dropMarkerRef.current = L.marker(dropCoords, { icon: dropIcon }).addTo(map)
                    .bindPopup("Drop Location (Metro)");
            } else {
                dropMarkerRef.current.setLatLng(dropCoords);
            }
        } else if (dropMarkerRef.current) {
            map.removeLayer(dropMarkerRef.current);
            dropMarkerRef.current = null;
        }

        // Handle Driver Marker
        if (driverCoords) {
            if (!driverMarkerRef.current) {
                driverMarkerRef.current = L.marker(driverCoords, { icon: driverIcon }).addTo(map)
                    .bindPopup("Driver Location");
            } else {
                driverMarkerRef.current.setLatLng(driverCoords);
            }
        } else if (driverMarkerRef.current) {
            map.removeLayer(driverMarkerRef.current);
            driverMarkerRef.current = null;
        }

        // Handle Polyline
        if (routePolyline && routePolyline.length > 0) {
            if (!polylineRef.current) {
                polylineRef.current = L.polyline(routePolyline, { color: '#00e5ff', weight: 5, opacity: 0.8 }).addTo(map);
            } else {
                polylineRef.current.setLatLngs(routePolyline);
            }
        } else if (polylineRef.current) {
            map.removeLayer(polylineRef.current);
            polylineRef.current = null;
        }

        // Auto fitting logic
        const boundsArr: [number, number][] = [];
        if (pickupCoords) boundsArr.push(pickupCoords);
        if (dropCoords) boundsArr.push(dropCoords);
        if (driverCoords) boundsArr.push(driverCoords); // Ensure Driver stays in frame
        if (routePolyline && routePolyline.length > 0) {
            routePolyline.forEach(c => boundsArr.push(c));
        }

        if (boundsArr.length > 0) {
            const bounds = L.latLngBounds(boundsArr);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }

    }, [pickupCoords, dropCoords, driverCoords, routePolyline]);

    return <div ref={containerRef} style={{ height: '100%', width: '100%', zIndex: 1 }} />;
});

MapComponent.displayName = 'MapComponent';
export default MapComponent;
