export type NominatimAddressDetail = {
  village: string;
  county: string;
  state: string;
  lvl4: string;
  region: string;
  lvl3: string;
  country: string;
  country_code: string;
};

export type NominatimApiResponse = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: NominatimAddressDetail;
  boundingbox: [string, string, string, string];
};

export type NominatimLocationName = {
  desa: string;
  kabkot: string;
};
