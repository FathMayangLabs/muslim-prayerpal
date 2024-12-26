import {
  FitraHiveSubCategories,
  FitraHiveSubCategoryApiResponse,
} from '@/constants/fitrahive.types';
import axios from 'axios';
import { useEffect, useState } from 'react';

const DUADHIKR_API_URL = 'https://dua-dhikr.vercel.app/categories';

async function getCategoryDetails(slug: string) {
  try {
    const response = await axios.get<FitraHiveSubCategoryApiResponse>(
      `${DUADHIKR_API_URL}/${slug}`,
      {
        headers: {
          'Accept-Language': 'id',
        },
      },
    );

    const data: FitraHiveSubCategories[] = response.data.data;
    return data;
  } catch (error) {
    console.error('Error fetching dua category details:', error);
    throw error;
  }
}

export function useDuaDhikrTitle(slug: string) {
  const [title, setTitle] = useState<FitraHiveSubCategories[]>([]);

  useEffect(() => {
    async function fetchCategoryDetails() {
      const data = await getCategoryDetails(slug);
      setTitle(data);
    }
    fetchCategoryDetails();
  }, [slug]);
  return title;
}
