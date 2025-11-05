import { Coordinates } from '@/types/game';

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLon = toRadians(coord2.lng - coord1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
    Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Calculate score based on distance with expanded radius
export function calculateScore(distanceKm: number): number {
  if (distanceKm <= 20) return 10;
  if (distanceKm <= 40) return 8;
  if (distanceKm <= 100) return 6;
  if (distanceKm <= 150) return 4;
  if (distanceKm <= 250) return 2;
  if (distanceKm <= 500) return 1;
  return 0;
}

// Generate random coordinates within a bounding box, avoiding the answer
export function generateRandomPin(
  center: Coordinates,
  minDistanceKm: number = 50,
  maxDistanceKm: number = 500
): Coordinates {
  const angle = Math.random() * 2 * Math.PI;
  const distance = minDistanceKm + Math.random() * (maxDistanceKm - minDistanceKm);
  
  const R = 6371; // Earth's radius in km
  const lat1 = toRadians(center.lat);
  const lng1 = toRadians(center.lng);
  
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
    Math.cos(lat1) * Math.sin(distance / R) * Math.cos(angle)
  );
  
  const lng2 = lng1 + Math.atan2(
    Math.sin(angle) * Math.sin(distance / R) * Math.cos(lat1),
    Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
  );
  
  return {
    lat: lat2 * (180 / Math.PI),
    lng: lng2 * (180 / Math.PI)
  };
}

// Shuffle array (Fisher-Yates algorithm)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}