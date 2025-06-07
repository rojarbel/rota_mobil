import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../api/axiosClient';

export const isAdmin = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) return false;

    const res = await axiosClient.get('/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data?.role === 'admin';
  } catch (err) {
    console.error('isAdmin API hatası:', err);
    return false;
  }
};
