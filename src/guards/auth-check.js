
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isAuthenticated = async () => {
  try {
  const token = await AsyncStorage.getItem("accessToken");
  return !!token;
  } catch (err) {
    console.error('Auth kontrol hatası:', err);
    return false;
  }
};