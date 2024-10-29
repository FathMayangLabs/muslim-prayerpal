import { ApiResponseTafseer, TafsirItem } from '@/constants/types';
import axios from 'axios';

export const getTafseer = async (
  id: string | string[] | undefined,
): Promise<TafsirItem[]> => {
  try {
    const tafseerRes = await axios.get<ApiResponseTafseer>(
      `https://equran.id/api/v2/tafsir/${id}`,
    );

    const data = tafseerRes.data.data.tafsir;

    return data;
  } catch (error) {
    console.log('Gagal mengakses data', error);
    throw error;
  }
};
