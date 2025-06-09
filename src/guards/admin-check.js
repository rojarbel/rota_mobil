import { getItem as getSecureItem } from '../utils/storage';
import axiosClient from '../api/axiosClient';
import logger from '../utils/logger';
export const isAdmin = async () => {
  try {
    const token = await getSecureItem("accessToken");
    if (!token) return false;

    const res = await axiosClient.get('/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data?.role === 'admin';
  } catch (err) {
    logger.error('isAdmin API hatası:', err);
    return false;
  }
};
