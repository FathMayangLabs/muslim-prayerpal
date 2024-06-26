import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getSurahDetails } from '@/utils/utility';
import { Ayat, EachSurah } from '@/constants/types';
import { LinearGradient } from 'expo-linear-gradient';
import QuranIcon from '@/assets/icons/QuranIcon';
import BismillahImg from '@/assets/images/Bismillah';
import Taawudz from '@/assets/images/Taawudz';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const Detail = () => {
  const { number, nama, turun, jumlah } = useLocalSearchParams();
  const [surahData, setSurahData] = useState<EachSurah | null>(null);
  const [ayat, setAyat] = useState<Ayat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSurahDetails(number);
        setSurahData(data);
        setAyat(data.ayat);
      } catch (error) {
        console.error('Error fetching surah data:', error);
      }
    };

    fetchData();
  }, [number]);
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: nama?.toString(),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-6">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView className="flex-1 px-6 bg-white">
        <LinearGradient
          colors={['transparent', '#39A7FF']}
          start={{ x: -0.9, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          className=" mb-6 p-5 rounded-2xl shadow-2xl items-center overflow-hidden"
        >
          <Text className="mt-2 font-medium text-3xl text-white">{nama}</Text>
          <Text className="mt-2 font-light text-base text-white">
            {surahData?.arti}
          </Text>
          <View>
            <View className="absolute -top-20 -left-16 opacity-10">
              <QuranIcon width={350} height={350} />
            </View>
          </View>
          <View className="my-5 w-64 h-[1] bg-white opacity-60" />
          <Text className="mb-4 font-normal text-white">
            {turun?.toString().toUpperCase()} ◦ {jumlah} SURAT
          </Text>

          {/* Surat At Taubah tidak menggunakan bismillah */}
          {parseInt(String(surahData?.nomor), 10) === 9 ? (
            <Taawudz width={350} height={88} />
          ) : (
            <BismillahImg width={214 + 40} height={48 + 40} />
          )}
        </LinearGradient>

        <FlatList
          data={ayat}
          keyExtractor={(item) => String(item.nomorAyat)}
          renderItem={({ item }) => (
            <>
              <View className="flex-row justify-between mb-5 p-2 px-4 rounded-xl bg-gray-100">
                <View className="items-center justify-center bg-custom-blue rounded-full w-9 h-9">
                  <Text className="text-white font-semibold">
                    {item.nomorAyat}
                  </Text>
                </View>
                <View className="flex-row justify-center items-center gap-x-2">
                  <Feather name="play" size={28} color="#39A7FF" />
                  <MaterialIcons
                    name="bookmark-outline"
                    size={28}
                    color="#39A7FF"
                  />
                </View>
              </View>
              <Text className="text-xl">{item.teksArab}</Text>
            </>
          )}
        />
      </SafeAreaView>
    </>
  );
};

export default Detail;
