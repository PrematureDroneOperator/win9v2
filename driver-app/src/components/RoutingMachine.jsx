import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

export default function RoutingMachine({ source, destination }) {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map || !source || !destination) return;

        // Create the routing control if it doesn't exist
        if (!routingControlRef.current) {
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(source.lat, source.lng),
                    L.latLng(destination.lat, destination.lng)
                ],
                lineOptions: {
                    styles: [{ color: '#3B82F6', weight: 5, opacity: 0.8 }]
                },
                routeWhileDragging: false,
                addWaypoints: false,
                fitSelectedRoutes: true,
                showAlternatives: false,
                createMarker: function (i, wp, nWps) {
                    // Custom markers for start and end
                    const isStart = i === 0;
                    return L.marker(wp.latLng, {
                        draggable: false,
                        icon: L.icon({
                            iconUrl: isStart
                                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
                                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })
                    });
                }
            }).addTo(map);

            // Hide the default routing instruction panel to keep the UI clean
            // The driver app usually uses its own UI for ETA and distance.
            const container = routingControlRef.current.getContainer();
            if (container) {
                container.style.display = 'none';
            }
        } else {
            // Update waypoints if they change
            routingControlRef.current.setWaypoints([
                L.latLng(source.lat, source.lng),
                L.latLng(destination.lat, destination.lng)
            ]);
        }

    }, [map, source, destination]);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (map && routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };
    }, [map]);

    return null;
}
