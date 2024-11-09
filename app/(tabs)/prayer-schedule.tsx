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
import { Switch } from 'react-native-paper';
import { useDailyPrayerSchedule } from '@/hooks/useDailyPrayerSchedule';
import {
  requestNotificationPermission,
  schedulePrayerNotifications,
  cancelSpecificPrayerNotifications,
} from '@/utils/notificationService';

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
  const index = useRef(new Animated.Value(0)).current;
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const prayerTimes = useDailyPrayerSchedule();

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
      const storedSettings = JSON.parse(
        (await AsyncStorage.getItem('userSettings')) || '{}',
      );
      setSettings(storedSettings || defaultSettings);

      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        await schedulePrayerNotifications(prayerTimes, storedSettings);
      }
    })();
  }, []);

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
    <SafeAreaView className="flex-1 mt-6">
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
        <View className="absolute z-0 w-4/6 aspect-square bg-white rounded-full shadow-[inset_10px_10px_20px_10px_rgba(0,0,0,0.3)]" />
      </View>
      <View>
        <Text>Select Prayers for Notifications:</Text>
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
              <Text style={{ flex: 1 }}>{prayerTimes[prayerName].name}</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>
                {prayerTimes[prayerName].time}
              </Text>
              <Switch
                value={!!settings[prayerName]}
                onValueChange={() => toggleSwitch(prayerName)}
              />
            </View>
          ))}
      </View>
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
});
