import BookIcon from '@/assets/icons/BookIcon';
import QuranIcon from '@/assets/icons/QuranIcon';
import Translation from '@/components/translate-version/Translation';
import { Surah } from '@/constants/types';
import { getAllSurah } from '@/utils/utility';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { throttle } from 'lodash';

import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  ViewToken,
  TouchableOpacity,
} from 'react-native';

export default function TabTwoScreen() {
  const [surahData, setSurahData] = useState<Surah[]>([]);
  const [lastRead, setLastRead] = useState<string>('Al-Fatihah');
  const [lastReadIndex, setLastReadIndex] = useState<number>(1);

  const flatListRef = useRef<FlatList>(null); // Reference to FlatList

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllSurah();
      setSurahData(data);
    } catch (error) {
      console.error('Error fetching surah data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLastReadUpdate = useCallback(
    (surahName: string, ayatNumber: number) => {
      setLastRead(surahName);
      setLastReadIndex(ayatNumber);
    },
    [],
  );

  const throttledUpdate = useCallback(
    throttle((surahName: string, ayatNumber: number) => {
      handleLastReadUpdate(surahName, ayatNumber);
    }, 1000),
    [handleLastReadUpdate],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const middleItem = viewableItems[Math.floor(viewableItems.length / 2)];
        if (middleItem?.item?.nomor && middleItem?.item?.namaLatin) {
          throttledUpdate(middleItem.item.namaLatin, middleItem.item.nomor);
        }
      }
    },
    [throttledUpdate],
  );

  // Function to scroll to last read Ayat
  const scrollToLastRead = useCallback(() => {
    if (flatListRef.current && lastReadIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: lastReadIndex - 1, // Adjust for zero-based indexing
        animated: true,
        viewPosition: 0.5, // Center the last read Ayat on screen
      });
    }
  }, [lastReadIndex]);

  const memoizedSurahData = useMemo(() => surahData, [surahData]);

  return (
    <>
      <StatusBar hidden={false} />
      <SafeAreaView className="flex-1 mx-6 mt-6">
        <TouchableOpacity onPress={scrollToLastRead}>
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
        </TouchableOpacity>
        <FlatList
          ref={flatListRef} // Attach FlatList ref
          data={memoizedSurahData}
          keyExtractor={(item) => item.nomor.toString()}
          renderItem={({ item }) => (
            <Translation
              surahNumber={item.nomor}
              onLastReadUpdate={handleLastReadUpdate}
            />
          )}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            minimumViewTime: 3000,
          }}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
        />
      </SafeAreaView>
    </>
  );
}
