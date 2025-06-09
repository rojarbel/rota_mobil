
import { getItem as getSecureItem } from '../utils/storage';

export const isAuthenticated = async () => {
  try {
  const token = await getSecureItem("accessToken");
  return !!token;
  } catch (err) {
    console.error('Auth kontrol hatası:', err);
    return false;
  }
};