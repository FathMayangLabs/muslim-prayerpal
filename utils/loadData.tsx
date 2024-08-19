import AsyncStorage from '@react-native-async-storage/async-storage';

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
