import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
export const saveData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('Error saving data', error);
    return false;
  }
};
