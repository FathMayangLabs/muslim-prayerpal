export interface AudioFull {
  [key: string]: string;
}

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: AudioFull;
}

export interface ApiResponse {
  code: number;
  message: string;
  data: Surah[];
}

export interface AyatAudio {
  [key: string]: string;
}

// Interface for Ayat
export interface Ayat {
  [x: string]: any;
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: AyatAudio;
}

// Interface for Surah
export interface EachSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: AudioFullTafseer;
  ayat: Ayat[];
}

// Interface for the API response
export interface EachSurahApiResponse {
  code: number;
  message: string;
  data: EachSurah;
}

// Type for Audio URLs
type AudioFullTafseer = {
  [key: string]: string;
};

// Type for Tafsir items
type TafsirItem = {
  ayat: number;
  teks: string;
};

// Type for Next and Previous Surah
type SuratReference = {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
};

// Main Data type
interface SurahData {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: AudioFull;
  tafsir: TafsirItem[];
  suratSelanjutnya: SuratReference | null;
  suratSebelumnya: SuratReference | null;
}

// Full response type
interface ApiResponseTafseer {
  code: number;
  message: string;
  data: SurahData;
}

export type {
  ApiResponseTafseer,
  SurahData,
  AudioFullTafseer,
  TafsirItem,
  SuratReference,
};
