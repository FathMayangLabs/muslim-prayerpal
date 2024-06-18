import axios from 'axios';

export const getAllSurah = async () => {
  try {
    const response = await axios.get('https://equran.id/api/v2/surat');
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.log('Gagal mengakses data', error);
  }
};
