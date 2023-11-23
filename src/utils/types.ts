import type { PLANT_TYPE } from "./constants";

export interface Producer {
  id: number;
  plantType: PLANT_TYPE;
  capacity: number;
  name: string;
  ownerId: number;
  description: string;
  picture: string;
  street: string;
  postalCode: string;
  country: null | string;
  city: string;
  lat: number;
  lon: number;
  deltaPrice: number;
  oeex_id: null | string;
  createdAt: string;
  modifiedAt: string;
  status: string;
  directMarketerId: number;
  commissioning: number;
  volumePerYear: number;
  extendedDescription: string;
  backgroundImage: string;
  payoutRatio: number;
  priority: number;
  overridePriority: number;
  marketplaceId: number;
  lon2: number;
  lat2: number;
  distance?: number;
}

export interface City {
  id: number;
  postalCode: string;
  name: string;
}
