import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { FivePrayers, PrayerTimesResponse, Timings } from '@/constants/types';
import dayjs from 'dayjs';

const PRAYER_API_URL = 'https://api.aladhan.com/v1/timings';

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Location permission is needed to fetch prayer times.');
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;
  return { latitude, longitude };
}

async function getPrayerSchedule(
  latitude: number,
  longitude: number,
  date: string,
): Promise<FivePrayers | null> {
  try {
    const response = await fetch(
      `${PRAYER_API_URL}/${date}?latitude=${latitude}&longitude=${longitude}&method=2`,
    );
    const data: PrayerTimesResponse = await response.json();

    if (data.code === 200) {
      const { Fajr, Dhuhr, Asr, Maghrib, Isha } = data.data.timings;
      return {
        Fajr: { name: 'Fajr', enabled: true, time: Fajr },
        Dhuhr: { name: 'Dhuhr', enabled: true, time: Dhuhr },
        Asr: { name: 'Asr', enabled: true, time: Asr },
        Maghrib: { name: 'Maghrib', enabled: true, time: Maghrib },
        Isha: { name: 'Isha', enabled: true, time: Isha },
      };
    } else {
      console.error('Failed to fetch prayer times:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

export function useDailyPrayerSchedule() {
  const [prayerTimes, setPrayerTimes] = useState<FivePrayers>();

  useEffect(() => {
    async function fetchAndSetPrayerTimes() {
      const location = await getLocation();
      if (location) {
        const data = await getPrayerSchedule(
          location.latitude,
          location.longitude,
          dayjs().format('DD-MM-YYYY'),
        );
        if (data) {
          setPrayerTimes(data);
        }
      }
    }

    fetchAndSetPrayerTimes();
  }, []);

  return prayerTimes;
}
