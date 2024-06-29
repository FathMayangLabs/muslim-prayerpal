import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ApiResponse,
  EachSurah,
  EachSurahApiResponse,
  Surah,
} from '@/constants/types';

//Get all surah
export const getAllSurah = async (): Promise<Surah[]> => {
  try {
    // const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    // if (cachedData) {
    //   const data: Surah[] = JSON.parse(cachedData);
    //   console.log('Loading data from cache:', data);
    //   return data;
    // }

    const response = await axios.get<ApiResponse>(
      'https://equran.id/api/v2/surat',
    );
    const data = response.data.data;

    // await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    // console.log('Loading data from API:', data);
    return data;
  } catch (error) {
    console.log('Gagal mengakses data', error);
    throw error;
  }
};

//getSurahDetails
export const getSurahDetails = async (
  id: string | string[] | undefined,
): Promise<EachSurah> => {
  try {
    // const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    // if (cachedData) {
    //   const data: Surah[] = JSON.parse(cachedData);
    //   console.log('Loading data from cache:', data);
    //   return data;
    // }

    const response = await axios.get<EachSurahApiResponse>(
      `https://equran.id/api/v2/surat/${id}`,
    );
    const data = response.data.data;

    // await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    // console.log('Loading data from API:', data);
    return data;
  } catch (error) {
    console.log('Gagal mengakses data', error);
    throw error;
  }
};

// Save data
export const saveData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving data', error);
  }
};

// Load data
export const loadData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.error('Error loading data', error);
  }
};
