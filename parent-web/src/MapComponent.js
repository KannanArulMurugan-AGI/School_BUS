import React, { useEffect, useRef } from 'react';

// Leaflet is available globally via the script tag in index.html, so we access it via window.L
const L = window.L;

const MapComponent = ({ position }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize map effect
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Create map
      const map = L.map(mapContainerRef.current).setView([position.lat, position.lng], 13);
      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add marker
      const busIcon = L.divIcon({
        html: '🚌',
        className: 'text-2xl',
        iconSize: [24, 24],
      });
      markerRef.current = L.marker([position.lat, position.lng], { icon: busIcon }).addTo(map);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Update marker position and map view when position prop changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newLatLng = [position.lat, position.lng];
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.panTo(newLatLng);
    }
  }, [position]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    />
  );
};

export default MapComponent;
