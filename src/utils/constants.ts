import * as z from 'zod';

export const LITION_BACKEND_URL = import.meta.env.VITE_LITION_BACKEND_URL;

export const ADDRESS_SERVICE_URL = import.meta.env.VITE_ADDRESS_SERVICE_URL;
export const PRICE_LOCATOR_URL = import.meta.env.VITE_PRICE_LOCATOR_URL;

export const PRODUCT_CODE = import.meta.env.VITE_PRODUCT_CODE;
export const CAMPAIGN_IDENTIFIER = import.meta.env.VITE_CAMPAIGN_IDENTIFIER;

export const ENERGY_TYPE = z.enum(['electricity', 'gas']);
export type ENERGY_TYPE = z.infer<typeof ENERGY_TYPE>;

export const SORT_DIRECTION = z.enum(['ASC', 'DESC']);
export type SORT_DIRECTION = z.infer<typeof SORT_DIRECTION>;

export const PRODUCER_STATUS = z.enum([
	'standard',
	'sold out',
	'active',
	'inactive',
]);
export type PRODUCER_STATUS = z.infer<typeof PRODUCER_STATUS>;

export const ORDER_BY = z.enum(['price', 'savings', 'distance', 'name']);
export type ORDER_BY = z.infer<typeof ORDER_BY>;

export const PLANT_TYPE = z.enum(['default', 'wind', 'solar', 'biomass']);
export type PLANT_TYPE = z.infer<typeof PLANT_TYPE>;

export const PLANT_TYPE_WITHOUT_DEFAULT = z.enum(['wind', 'solar', 'biomass']);
export type PLANT_TYPE_WITHOUT_DEFAULT = z.infer<
	typeof PLANT_TYPE_WITHOUT_DEFAULT
>;

export const DEFAULT_ZIP = '10777';
export const DEFAULT_MARKETPLACE_ID = 1;
export const DEFAULT_ORDER_BY = ORDER_BY.enum.distance;
export const DEFAULT_SORT_DIRECTION = SORT_DIRECTION.enum.ASC;
export const DEFAULT_CONSUMPTION = 2500;
