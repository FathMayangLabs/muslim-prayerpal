import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import {
  NominatimApiResponse,
  NominatimLocationName,
} from '@/constants/nominatim.types';

const LOCATION_API_URL = 'https://nominatim.openstreetmap.org';

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== Location.PermissionStatus.GRANTED) {
    alert('Location permission is needed to fetch your location names.');
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;
  return { latitude, longitude };
}

async function getLocationName(
  latitude: number,
  longitude: number,
): Promise<NominatimLocationName | null> {
  try {
    const response = await fetch(
      `${LOCATION_API_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    );
    const data: NominatimApiResponse = await response.json();

    return { desa: data.address.village, kabkot: data.address.county };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

export function useUserLocation() {
  const [locationName, setLocationName] = useState<NominatimLocationName>();

  useEffect(() => {
    async function fetchAndSetLocationName() {
      const location = await getLocation();
      if (!location) return;

      const locationName = await getLocationName(
        location.latitude,
        location.longitude,
      );
      if (!locationName) return;

      setLocationName(locationName);
    }

    fetchAndSetLocationName();
  }, []);

  return locationName;
}
