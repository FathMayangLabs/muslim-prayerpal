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

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: PrayerTimesData;
}

export interface PrayerTimesData {
  timings: Timings;
  date: DateInfo;
  meta: MetaData;
}

export interface Timings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface DateInfo {
  readable: string;
  timestamp: string;
  gregorian: GregorianDate;
  hijri: HijriDate;
}

export interface GregorianDate {
  date: string;
  format: string;
  day: string;
  weekday: Weekday;
  month: Month;
  year: string;
  designation: Designation;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: Weekday;
  month: Month;
  year: string;
  designation: Designation;
  holidays?: string[];
}

export interface Weekday {
  en: string;
  ar?: string; // Optional since it's only present in the hijri date
}

export interface Month {
  number: number;
  en: string;
  ar?: string; // Optional since it's only present in the hijri date
}

export interface Designation {
  abbreviated: string;
  expanded: string;
}

export interface MetaData {
  latitude: number;
  longitude: number;
  timezone: string;
  method: Method;
  latitudeAdjustmentMethod: string;
  midnightMode: string;
  school: string;
  offset: Offset;
}

export interface Method {
  id: number;
  name: string;
  params: MethodParams;
}

export interface MethodParams {
  Fajr: number;
  Isha: string;
}

export interface Offset {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Sunset: string;
  Isha: string;
  Midnight: string;
}

export interface FivePrayers {
  Fajr: { name: string; enabled: true; time: string };
  Dhuhr: { name: string; enabled: true; time: string };
  Asr: { name: string; enabled: true; time: string };
  Maghrib: { name: string; enabled: true; time: string };
  Isha: { name: string; enabled: true; time: string };
}
