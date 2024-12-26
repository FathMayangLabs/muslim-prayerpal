import {
  FitraHiveApiResponse,
  FitraHiveCategories,
  FitraHiveCategory,
  FitraHiveContent,
  FitraHiveSubCategories,
  FitraHiveSubCategoryApiResponse,
} from '@/constants/fitrahive.types';
import axios from 'axios';
import { useEffect, useState } from 'react';

const DUADHIKR_API_URL = 'https://dua-dhikr.vercel.app/categories';

async function getCategory(): Promise<FitraHiveCategory[]> {
  try {
    const response = await axios.get<FitraHiveApiResponse>(DUADHIKR_API_URL, {
      headers: {
        'Accept-Language': 'id',
      },
    });

    const rawDuaCategory: FitraHiveCategories[] = response.data.data;

    const categoriesDetail = rawDuaCategory.map((category) => ({
      name: category.name,
      slug: category.slug,
      total: category.total,
    }));

    return categoriesDetail;
  } catch (error) {
    console.error('Error fetching dua category:', error);
    throw error;
  }
}

// async function getDuaDhikr(categoryDetails: FitraHiveCategory[]) {
//   try {
//     // Array to hold all requests
//     const allRequests = [];

//     // Iterate over each category
//     for (const category of categoryDetails) {
//       const { slug, total } = category;

//       // Add requests for all items in the category
//       for (let i = 1; i < total; i++) {
//         const request = await axios.get(`${DUADHIKR_API_URL}/${slug}/${i}`, {
//           headers: {
//             'Accept-Language': 'id',
//           },
//         });
//         allRequests.push(request.data.data); // Add request to the array
//       }
//     }

//     // Execute all requests in parallel
//     const responses = await Promise.all(allRequests);

//     // Extract and return the data
//     const result = responses.map((response) => response);
//     return result; // Contains all fetched data
//   } catch (error) {
//     console.error('Error fetching dua and dhikr details:', error);
//   }
// }

export function useDuaCategories() {
  const [duaCategories, setDuaCategories] = useState<FitraHiveCategory[]>();

  useEffect(() => {
    async function fetchDuaCategoriesr() {
      try {
        const category = await getCategory();
        setDuaCategories(category);
      } catch (error) {
        console.error('Error fetching dua slug details:', error);
      }
    }

    fetchDuaCategoriesr();
  }, []);

  return duaCategories;
}
