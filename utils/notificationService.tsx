import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FivePrayers, Timings } from '@/constants/types';
import dayjs from 'dayjs';

type PrayerNames = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

type UserSettings = {
  Fajr: boolean;
  Dhuhr: boolean;
  Asr: boolean;
  Maghrib: boolean;
  Isha: boolean;
};

// Request permission for notifications
export async function requestNotificationPermission() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Notification permissions are required to set prayer alarms.');
    return false;
  }
  return true;
}

export async function schedulePrayerNotifications(
  prayerTimes: FivePrayers | null | undefined,
  userSettings: UserSettings,
) {
  // Cancel notifications based on user settings
  await cancelSpecificPrayerNotifications(userSettings);

  const notificationIds: { [key in PrayerNames]?: string } = {};

  if (!prayerTimes) {
    console.warn('prayerTimes is not available');
    return;
  }

  for (const prayer in userSettings) {
    const prayerName = prayer as PrayerNames;

    if (userSettings[prayerName]) {
      const prayerTime = prayerTimes[prayerName];

      if (prayerTime) {
        const [hour, minute] = prayerTime.time.split(':').map(Number);
        const notificationTime = dayjs()
          .hour(hour)
          .minute(minute)
          .second(0)
          .toDate();

        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: `${prayerName} Prayer Time`,
            body: `It's time for ${prayerName} prayer.`,
            sound: true,
          },
          trigger: notificationTime,
        });

        notificationIds[prayerName] = id;
      } else {
        console.warn(`Prayer time for ${prayerName} is not available`);
      }
    }
  }

  await AsyncStorage.setItem(
    'scheduledNotifications',
    JSON.stringify(notificationIds),
  );
}

export async function cancelSpecificPrayerNotifications(
  userSettings: UserSettings,
) {
  const storedIds = await AsyncStorage.getItem('scheduledNotifications');
  const notificationIds: { [key in PrayerNames]?: string } = storedIds
    ? JSON.parse(storedIds)
    : {};

  for (const prayer in userSettings) {
    const prayerName = prayer as PrayerNames;
    const isPrayerEnabled = userSettings[prayerName];

    if (!isPrayerEnabled && notificationIds[prayerName]) {
      await Notifications.cancelScheduledNotificationAsync(
        notificationIds[prayerName] as string,
      );
      delete notificationIds[prayerName];
    }
  }

  await AsyncStorage.setItem(
    'scheduledNotifications',
    JSON.stringify(notificationIds),
  );
}
