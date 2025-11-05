'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordinates } from '@/types/game';

// Fix for default marker icons in Next.js with proper CORS
const createCustomIcon = (color: string = 'blue') => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Set default icon
L.Marker.prototype.options.icon = createCustomIcon('blue');

interface MapClickHandlerProps {
  onMapClick: (coords: Coordinates) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

interface GameMapProps {
  userPin: Coordinates | null;
  onPinChange: (coords: Coordinates) => void;
  disabled?: boolean;
  answerLocation?: Coordinates;
  showAnswer?: boolean;
}

export default function GameMap({
  userPin,
  onPinChange,
  disabled = false,
  answerLocation,
  showAnswer = false,
}: GameMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      minZoom={2}
      maxZoom={10}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {!disabled && <MapClickHandler onMapClick={onPinChange} />}
      {userPin && (
        <Marker 
          position={[userPin.lat, userPin.lng]}
          icon={createCustomIcon('blue')}
        />
      )}
      {showAnswer && answerLocation && (
        <Marker
          position={[answerLocation.lat, answerLocation.lng]}
          icon={createCustomIcon('green')}
        />
      )}
    </MapContainer>
  );
}