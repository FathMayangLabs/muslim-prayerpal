import BookIcon from '@/assets/icons/BookIcon';
import QuranIcon from '@/assets/icons/QuranIcon';
import Translation from '@/components/translate-version/Translation';
import { Surah, SurahData } from '@/constants/types';
import { getAllSurah } from '@/utils/utility';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, Text, View, ViewToken } from 'react-native';

export default function TabTwoScreen() {
  const [surahData, setSurahData] = useState<Surah[]>([]);
  const [lastRead, setLastRead] = useState<string>('Al-Fatihah');
  const [lastReadIndex, setLastReadIndex] = useState<number>(0);

  const lastReadAyat = useRef<number | null>(null); // Ref to hold the last read ayat number

  const fetchData = async () => {
    try {
      const data = await getAllSurah();
      setSurahData(data);
    } catch (error) {
      console.error('Error fetching surah data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLastReadUpdate = (surahName: string, ayatNumber: number) => {
    console.log(
      `Updating last read to Surah: ${surahName}, Ayat: ${ayatNumber}`,
    );
    setLastRead(surahName);
    setLastReadIndex(ayatNumber);
  };

  // Updated onViewableItemsChanged function with debugging logs
  // const onViewableItemsChanged = useRef(
  //   ({ viewableItems }: { viewableItems: any[] }) => {
  //     if (viewableItems.length > 0) {
  //       console.log('viewableItems structure:', viewableItems);

  //       // Check if the mid-view item structure is as expected
  //       const ayatInView = viewableItems[Math.floor(viewableItems.length / 2)];
  //       if (ayatInView?.item) {
  //         const ayatNumber = ayatInView.item.nomorAyat;
  //         const surahName = ayatInView.item.namaLatin;

  //         console.log('Selected ayatNumber:', ayatNumber);
  //         console.log('Selected surahName:', surahName);

  //         if (ayatNumber !== lastReadAyat.current) {
  //           lastReadAyat.current = ayatNumber;
  //           handleLastReadUpdate(surahName, ayatNumber);
  //         }
  //       } else {
  //         console.warn('Unexpected viewable item structure:', ayatInView);
  //       }
  //     }
  //   },
  // ).current;

  const trackItem = (surahName: string, ayatNumber: number) => {
    console.log('Selected ayatNumber:', ayatNumber);
    console.log('Selected surahName:', surahName);
  };

  const onViewableItemsChanged = useCallback(
    (info: { changed: ViewToken[] }): void => {
      const visibleItems = info.changed.filter((entry) => entry.isViewable);
      visibleItems.forEach((visible) => {
        const item = visible.item;

        if (item && item.nomorAyat && item.namaLatin) {
          const ayatNumber = item.nomorAyat;
          const surahName = item.namaLatin;

          // Call trackItem to log the values
          trackItem(surahName, ayatNumber);

          // Update last read Ayat and Surah
          handleLastReadUpdate(surahName, ayatNumber);
        } else {
          console.warn(
            'Viewable item does not have the expected structure:',
            visible.item.namaLatin,
          );
        }
      });
    },
    [],
  );

  return (
    <>
      <StatusBar hidden={false} />
      <SafeAreaView className="flex-1 mx-6 mt-6">
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
            <Text className="mt-6 font-light text-base text-white">
              {lastRead}{' '}
            </Text>
            <Text className="mt-1 font-semibold text-xl text-white">
              Ayat {lastReadIndex}
            </Text>
          </View>
          <View className="absolute -right-16 opacity-30">
            <QuranIcon width={200} height={200} />
          </View>
        </LinearGradient>
        <FlatList
          data={surahData}
          keyExtractor={(item) => item.nomor.toString()}
          renderItem={({ item }) => (
            <Translation
              surahNumber={item.nomor}
              onLastReadUpdate={handleLastReadUpdate}
            />
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onViewableItemsChanged={onViewableItemsChanged} // Pass the onViewableItemsChanged function
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50, // Configure viewability threshold
            minimumViewTime: 100, // Minimum time an item needs to be visible before considered "viewable"
          }}
        />
      </SafeAreaView>
    </>
  );
}
