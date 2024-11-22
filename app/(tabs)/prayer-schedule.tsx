import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import ClockIcon from '@/assets/ClockIcon';
import ArrowIcon from '@/assets/icons/ArrowIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Switch } from 'react-native-paper';
import { useDailyPrayerSchedule } from '@/hooks/useDailyPrayerSchedule';
import {
  requestNotificationPermission,
  schedulePrayerNotifications,
  cancelSpecificPrayerNotifications,
} from '@/utils/notificationService';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserLocation } from '@/hooks/useUserLocation';

const { width } = Dimensions.get('window');
const SIZE = width * 0.9;

type PrayerNames = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

type UserSettings = {
  [key in PrayerNames]: boolean;
};

const defaultSettings: UserSettings = {
  Fajr: true,
  Dhuhr: true,
  Asr: true,
  Maghrib: true,
  Isha: true,
};

const PrayerSchedule = () => {
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const index = useRef(new Animated.Value(0)).current;
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const prayerTimes = useDailyPrayerSchedule();
  const locationNames = useUserLocation();

  const interpolated = {
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  };

  const secondDegrees = Animated.multiply(index, 6);
  const rotateMinutes = Animated.divide(secondDegrees, new Animated.Value(60));
  const rotateHours = Animated.divide(rotateMinutes, new Animated.Value(12));
  const transformHours = {
    transform: [{ rotate: rotateHours.interpolate(interpolated) }],
  };

  useEffect(() => {
    (async () => {
      let userSettings: UserSettings | null = null;

      // Load settings from AsyncStorage
      const storedSettings = await AsyncStorage.getItem('userSettings');
      if (storedSettings) {
        userSettings = JSON.parse(storedSettings) as UserSettings;
        setSettings(userSettings);
      } else {
        // Set default settings if none exist
        userSettings = defaultSettings;
        setSettings(defaultSettings);
        await AsyncStorage.setItem(
          'userSettings',
          JSON.stringify(defaultSettings),
        );
      }

      // Request notification permission
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        console.warn('Notification permissions not granted.');
        return;
      }

      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      await delay(4500);

      setIsLoading(false);
    })();
  }, [prayerTimes]); // Ensure this effect runs when `prayerTimes` updates

  const toggleSwitch = async (prayer: PrayerNames) => {
    const updatedSettings = { ...settings, [prayer]: !settings[prayer] };
    setSettings(updatedSettings);
    await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));

    if (updatedSettings[prayer]) {
      await schedulePrayerNotifications(prayerTimes, updatedSettings);
    } else {
      await cancelSpecificPrayerNotifications(updatedSettings);
    }
  };

  useEffect(() => {
    const current = dayjs();
    const diff = current.endOf('day').diff(current, 'seconds');
    setTimer(diff);

    const ticker = setInterval(() => {
      setTimer((prevTimer) => {
        const newTime = prevTimer - 1;
        if (newTime >= 0) {
          index.setValue(newTime);
        }
        return newTime >= 0 ? newTime : 0;
      });
    }, 1000);

    return () => clearInterval(ticker);
  }, [index]);

  useEffect(() => {
    dayjs.locale('id');
  }, []);

  return (
    <SafeAreaView className="flex-1 flex mt-6">
      <Text className="font-bold text-3xl mt-[10%] mx-[4%]">Fard Prayer</Text>
      <View className="flex items-center h-1/2 justify-center">
        <Animated.View style={[styles.mover, transformHours]}>
          <ArrowIcon
            width={40}
            height={40}
            fill="#b2071d"
            style={styles.arrow}
          />
        </Animated.View>

        <View style={styles.centerText}>
          <Text style={styles.timeText}>{dayjs().format('HH:mm')}</Text>
          <Text style={styles.dateText}>{dayjs().format('dddd D. MMMM')}</Text>
        </View>

        <ClockIcon className="absolute z-10 w-4/6 h-4/6" />
        <LinearGradient
          colors={['transparent', '#39A7FF']}
          start={{ x: -0.9, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={styles.clockCircle}
          className="rounded-full"
        />
        <View className="absolute z-0 w-4/6 aspect-square bg-white rounded-full shadow-[inset_10px_10px_20px_10px_rgba(0,0,0,0.3)]" />
      </View>
      <View className="flex flex-row ml-[4%] mb-[5%]">
        <Text style={styles.locationNamesText}>{locationNames?.desa}, </Text>
        <Text style={styles.locationNamesText}>{locationNames?.kabkot}</Text>
      </View>
      {isLoading ? (
        <>
          <ActivityIndicator animating={true} size={'large'} color="#39A7FF" />
        </>
      ) : (
        <>
          <View className="mx-[10%]">
            {prayerTimes &&
              (Object.keys(prayerTimes) as PrayerNames[]).map((prayerName) => (
                <View
                  key={prayerName}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 8,
                  }}
                >
                  <Text style={styles.prayerNameText}>
                    {prayerTimes[prayerName].name}
                  </Text>
                  <Text style={styles.prayerTimeText}>
                    {prayerTimes[prayerName].time}
                  </Text>
                  <Switch
                    value={settings[prayerName] ?? true}
                    onValueChange={() => toggleSwitch(prayerName)}
                    color="#39A7FF"
                  />
                </View>
              ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default PrayerSchedule;

const styles = StyleSheet.create({
  mover: {
    zIndex: 10,
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  clockCircle: {
    zIndex: 0,
    position: 'absolute',
    width: ' 72%',
    height: ' 72%',
  },
  arrow: {
    position: 'absolute',
    top: -(SIZE * 0.35) + 185,
  },
  centerText: {
    zIndex: 10,
    position: 'absolute',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  prayerNameText: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  prayerTimeText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'semibold',
    textAlign: 'center',
  },
  locationNamesText: {
    fontSize: 20,
    textAlign: 'center',
  },
});
