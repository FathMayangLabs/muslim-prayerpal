import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getSurahDetails } from '@/utils/utility';
import { Ayat, AyatAudio, EachSurah } from '@/constants/types';
import { LinearGradient } from 'expo-linear-gradient';
import QuranIcon from '@/assets/icons/QuranIcon';
import BismillahImg from '@/assets/images/Bismillah';
import Taawudz from '@/assets/images/Taawudz';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const AyatItem = ({
  item,
  audioUrls,
}: {
  item: Ayat;
  audioUrls: AyatAudio;
}) => {
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return soundObject
      ? () => {
          soundObject.unloadAsync();
        }
      : undefined;
  }, [soundObject]);

  const playAudio = async (audioUrl: string) => {
    if (soundObject) {
      await soundObject.unloadAsync();
      setSoundObject(null);
    }
    const sound = new Audio.Sound();
    await sound.loadAsync({ uri: audioUrl });
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setProgress(status.positionMillis);
        setDuration(status.durationMillis ?? 0);
      }
    });
    setSoundObject(sound);
    await sound.playAsync();
  };

  const handleSeek = async (value: number) => {
    if (soundObject) {
      await soundObject.setPositionAsync(value);
    }
  };

  return (
    <>
      <View className="flex-row justify-between mb-5 p-2 px-4 rounded-xl bg-gray-100">
        <View className="items-center justify-center bg-custom-blue rounded-full w-9 h-9">
          <Text className="text-white font-semibold">{item.nomorAyat}</Text>
        </View>
        <View className={`${progress === duration ? 'hidden opacity-0' : ''}`}>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={progress}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#39A7FF"
            maximumTrackTintColor="#000000"
          />
        </View>
        <View className="flex-row items-center justify-center">
          <TouchableOpacity
            onPress={() => playAudio(audioUrls[item.nomorAyat.toString()])}
          >
            <Feather name="play" size={28} color="#39A7FF" />
          </TouchableOpacity>
          <MaterialIcons name="bookmark-outline" size={28} color="#39A7FF" />
        </View>
      </View>
      <Text className="text-2xl mb-5">{item.teksArab}</Text>
    </>
  );
};

const Detail = () => {
  const { number, nama, turun, jumlah } = useLocalSearchParams();
  const [surahData, setSurahData] = useState<EachSurah | null>(null);
  const [ayat, setAyat] = useState<Ayat[]>([]);
  const [audioUrls, setAudioUrls] = useState<AyatAudio>({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSurahDetails(number);
        setSurahData(data);
        setAyat(data.ayat);
        const audioUrls: AyatAudio = {};
        data.ayat.forEach((item) => {
          audioUrls[item.nomorAyat.toString()] = item.audio['02']; // Assuming you want the first audio version
        });
        setAudioUrls(audioUrls);
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
            <AyatItem item={item} audioUrls={audioUrls} />
          )}
        />
      </SafeAreaView>
    </>
  );
};

export default Detail;
