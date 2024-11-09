import { View, Text, FlatList } from 'react-native';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Ayat, EachSurah } from '@/constants/types';
import { getSurahDetails } from '@/utils/utility';

const Translation = memo(
  ({
    surahNumber,
    onLastReadUpdate,
  }: {
    surahNumber: number;
    onLastReadUpdate: (surahName: string, ayatNumber: number) => void;
  }) => {
    const [surahData, setSurahData] = useState<EachSurah | null>(null);
    const [ayat, setAyat] = useState<Ayat[]>([]);
    const lastReadAyat = useRef(1);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getSurahDetails(surahNumber.toString());
          setSurahData(data);
          setAyat(data.ayat);
        } catch (error) {
          console.error('Error fetching surah data:', error);
        }
      };
      fetchData();
    }, [surahNumber]);

    const onViewableItemsChanged = ({
      viewableItems,
    }: {
      viewableItems: any;
    }) => {
      if (viewableItems.length > 0 && surahData) {
        const ayatInView = viewableItems[Math.floor(viewableItems.length / 2)];
        const ayatNumber = ayatInView.item.nomorAyat;
        if (ayatNumber !== lastReadAyat.current) {
          lastReadAyat.current = ayatNumber;
          handleLastReadUpdate(surahData.namaLatin, ayatNumber);
        }
      }
    };

    const handleLastReadUpdate = (surahName: string, ayatNumber: number) => {
      onLastReadUpdate(surahName, ayatNumber);
    };

    return (
      <>
        <View className="flex items-center justify-center mt-4">
          <Text className="font-extrabold text-2xl">
            {surahData?.namaLatin}
          </Text>
        </View>
        <FlatList
          data={ayat}
          keyExtractor={(item) => item.nomorAyat.toString()}
          renderItem={({ item }) => (
            <View className="flex flex-col mt-2 overflow-visible">
              <View className="flex flex-row mb-2">
                <Text className="pr-1 text-lg font-semibold">
                  {item.nomorAyat}.
                </Text>
                <Text className="text-lg flex-shrink">
                  {item.teksIndonesia}
                </Text>
              </View>
            </View>
          )}
          initialNumToRender={7}
          maxToRenderPerBatch={10}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 50,
            minimumViewTime: 5000,
          }}
        />
      </>
    );
  },
);

export default Translation;
