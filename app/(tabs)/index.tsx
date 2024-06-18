import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuranIcon from '@/assets/icons/QuranIcon';
import SearchIcon from '@/assets/icons/SearchIcon';
import BookIcon from '@/assets/icons/BookIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllSurah } from '@/utils/utility';

const Home = () => {
  useEffect(() => {
    getAllSurah();
  }, []);

  return (
    <SafeAreaView className="flex-1 mx-6">
      <View className="flex-row justify-between">
        <Text className="text-custom-blue font-bold text-xl">Islamic App</Text>
        <SearchIcon />
      </View>
      <View className="mt-4">
        <Text className="text-custom-paleBlue font-medium text-base">
          Asslamualaikum
        </Text>
        <Text className="mt-1 font-semibold text-3xl">Fath Zulfa Ali</Text>
      </View>
      <LinearGradient
        colors={['transparent', '#39A7FF']}
        start={{ x: -0.9, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        className="flex-row mt-6 p-5 rounded-2xl justify-between overflow-hidden"
      >
        <View>
          <View className="flex-row">
            <BookIcon />
            <Text className="text-white ml-2">Terakhir Di Baca</Text>
          </View>

          <Text className="mt-6 font-semibold text-xl text-white">
            Al-Fatiah
          </Text>
          <Text className="mt-2 font-light text-base text-white">
            Ayat No. 1
          </Text>
        </View>
        <View>
          <View className="absolute -left-36">
            <QuranIcon width={200} height={200} />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;
