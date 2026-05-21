import { apiClient } from "@/lib/api/client";

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  currency: string;
  phoneCode: string;
  cities: string[];
}

export async function getCountries(): Promise<CountryOption[]> {
  const { data } = await apiClient.get<CountryOption[]>("countries");
  return data;
}
