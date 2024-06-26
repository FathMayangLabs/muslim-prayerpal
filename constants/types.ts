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
  audioFull: AudioFull;
  ayat: Ayat[];
}

// Interface for the API response
export interface EachSurahApiResponse {
  code: number;
  message: string;
  data: EachSurah;
}
