import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let cachedToken = null;

const api = axios.create({
  baseURL: 'https://rotabackend-f4gqewcbfcfud4ac.qatarcentral-01.azurewebsites.net',
});

// Sadece token gereken isteklerde Authorization ekle
api.interceptors.request.use(
  async (config) => {
    const needsAuth = ["post", "put", "delete"].includes(config.method);

    if (needsAuth) {
      if (!cachedToken) {
        cachedToken = await AsyncStorage.getItem('accessToken');
      }
      if (cachedToken) {
        config.headers.Authorization = `Bearer ${cachedToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
export const setCachedToken = (newToken) => {
  cachedToken = newToken;
};

export default api;
