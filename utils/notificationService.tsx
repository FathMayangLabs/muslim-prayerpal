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

  // Add a delay to ensure prayerTimes is available
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 1; attempt <= 3; attempt++) {
    if (!prayerTimes) {
      console.warn(
        `Attempt ${attempt}: prayerTimes is not available, retrying...`,
      );
      await delay(2000); // Wait for 1 second before retrying
    } else {
      break;
    }
  }

  if (!prayerTimes) {
    console.warn('prayerTimes is not available');
    return;
  }

  // Validate prayerTimes keys
  const validPrayers: PrayerNames[] = [
    'Fajr',
    'Dhuhr',
    'Asr',
    'Maghrib',
    'Isha',
  ];
  const notificationIds: { [key in PrayerNames]?: string } = {};

  for (const prayerName of validPrayers) {
    if (userSettings[prayerName]) {
      const prayerTime = prayerTimes[prayerName];

      if (prayerTime) {
        const [hour, minute] = prayerTime.time.split(':').map(Number);
        const notificationTime = dayjs()
          .hour(hour)
          .minute(minute)
          .second(0)
          .toDate();

        try {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: `${prayerName} Prayer Time`,
              body: `It's time for ${prayerName} prayer.`,
              sound: true,
            },
            trigger: notificationTime,
          });

          notificationIds[prayerName] = id;
        } catch (error) {
          console.error(
            `Failed to schedule notification for ${prayerName}:`,
            error,
          );
        }
      } else {
        console.warn(`Prayer time for ${prayerName} is not available`);
      }
    }
  }
}

export async function cancelSpecificPrayerNotifications(
  userSettings: UserSettings | null,
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
