import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuranIcon from '@/assets/icons/QuranIcon';
import SearchIcon from '@/assets/icons/SearchIcon';
import BookIcon from '@/assets/icons/BookIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllSurah } from '@/utils/utility';
import MuslimIcon from '@/assets/icons/MuslimIcon';
import { Surah } from '@/constants/types';
import { useRouter } from 'expo-router';
import { loadData } from '@/utils/loadData';
import { StatusBar } from 'expo-status-bar';

const ItemList = memo(({ item }: { item: Surah }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() =>
        router.push(
          `/detail?number=${item.nomor}&nama=${item.namaLatin}&turun=${item.tempatTurun}&jumlah=${item.jumlahAyat}&arabic=${item.nama}`,
        )
      }
      className="justify-between flex-row"
    >
      <View className="flex-row mb-4">
        <Text className="absolute top-[10] left-[5] w-8 text-center">
          {item.nomor}
        </Text>
        <MuslimIcon />
        <View className="ml-4 flex-col justify-between">
          <Text className="font-medium text-base">{item.namaLatin}</Text>
          <Text className="font-medium opacity-40">
            {item.tempatTurun} ◦ {item.jumlahAyat} SURAT
          </Text>
        </View>
      </View>
      <View className="justify-center">
        <Text className="text-2xl text-custom-darkBlue">{item.nama}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default function Home() {
  const [surahData, setSurahData] = useState<Surah[] | null>(null);
  const [username, setUsername] = useState<string | undefined>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSurah();
        setSurahData(data);
      } catch (error) {
        console.error('Error fetching surah data:', error);
      }
    };

    const loadUsername = async () => {
      try {
        const username = await loadData('username');
        if (username !== undefined || null) {
          setUsername(username);
        } else {
          //add logic to navigate to intro screen
        }
      } catch (error) {
        Alert.alert(
          'Gagal memuat data',
          'Mohon untuk memulai ulang aplikasi!',
          [
            {
              text: 'Keluar Aplikasi',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false },
        );
      }
    };

    loadUsername();
    fetchData();
  }, []);

  return (
    <>
      <StatusBar hidden={false} />
      <SafeAreaView className="flex-1 mx-6 mt-6">
        <View className="flex-row justify-between">
          <Text className="text-custom-blue  font-bold text-xl">
            Islamic App
          </Text>
          <SearchIcon />
        </View>
        <View className="mt-4">
          <Text className="text-custom-paleBlue font-medium text-base">
            Asslamualaikum
          </Text>
          <Text className="mt-1 font-semibold text-3xl">{username}</Text>
        </View>
        <LinearGradient
          colors={['transparent', '#39A7FF']}
          start={{ x: -0.9, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          className="flex-row my-6 p-5 rounded-2xl justify-between overflow-hidden"
        >
          <View>
            <View className="flex-row">
              <BookIcon />
              <Text className="text-white ml-2">Terakhir Di Baca</Text>
            </View>

            <Text className="mt-6 font-semibold text-xl text-white">
              Al-Fatihah
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
        <FlatList
          data={surahData}
          keyExtractor={(item) => item.nomor.toString()}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          renderItem={({ item }) => <ItemList item={item} />}
          getItemLayout={(data, index) => ({
            length: 59,
            offset: 59 * index,
            index,
          })}
        />
      </SafeAreaView>
    </>
  );
}
