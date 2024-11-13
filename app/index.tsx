import React, { useState } from 'react';
import {
  ImageBackground,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import QuranIcon from '@/assets/icons/QuranIcon';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { saveData } from '@/utils/saveData';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

const backgroundImg = require('@/assets/images/login-background.png');

type RootStackParamList = {
  '(tabs)': undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, '(tabs)'>;

export default function introScreen() {
  const [username, setUsername] = useState<string>('');
  const [clicked, setCLicked] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleSaveData = async () => {
    try {
      setCLicked(true);
      await saveData('username', username);
      navigation.navigate('(tabs)');
      navigation.replace('(tabs)');
    } catch (error) {
      Alert.alert(
        'Gagal menyimpan data',
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

  return (
    <>
      <StatusBar hidden />
      <ImageBackground
        source={backgroundImg}
        resizeMode="cover"
        className="flex-1 justify-end"
      >
        <View className="flex justify-center items-center h-1/3">
          <View className="bg-white p-2 rounded-xl">
            <QuranIcon />
          </View>
        </View>

        <View className="flex flex-col justify-between w-full h-2/3 bg-white rounded-tr-[80px] rounded-tl-md p-6">
          <Text className="text-xl font-bold text-center mt-9">
            Your Muslim PrayerPal
          </Text>
          <TextInput
            mode="outlined"
            label="Hallo"
            placeholder="Ketik nama anda di sini"
            onChangeText={(value) => setUsername(value)}
            outlineColor="#7195A9"
            activeOutlineColor="#39A7FF"
          />
          <TouchableOpacity
            className={`bg-blue-600 py-3 rounded-lg mt-5 ${
              !username ? 'opacity-50' : ''
            }`}
            disabled={!username || clicked}
            onPress={() => handleSaveData()}
          >
            {clicked ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center text-lg">Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
}
