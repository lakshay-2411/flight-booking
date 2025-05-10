// src/services/airportSuggest.ts
import axios from 'axios';
import { getAccessToken } from './amadeusAuth';

export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
}

export const searchAirports = async (query: string): Promise<Airport[]> => {
  if (!query) return [];

  const token = await getAccessToken();
  const response = await axios.get(
    'https://test.api.amadeus.com/v1/reference-data/locations',
    {
      params: {
        keyword: query,
        subType: 'AIRPORT',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data.map((item: any) => ({
    iataCode: item.iataCode,
    name: item.name,
    cityName: item.address.cityName,
    countryCode: item.address.countryCode,
  }));
};
