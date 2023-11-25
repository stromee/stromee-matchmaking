import { queryClient } from 'src/query-client';
import * as z from 'zod';

import { fetchCities } from '@hooks/use-cities-query';

import { PLANT_TYPE_WITHOUT_DEFAULT } from './constants';
import { ADDRESS_KEYS } from './query';

export const postalCodeSyncSchema = z
	.string()
	.min(1, 'Bitte gib eine Postleitzahl ein')
	.min(5, 'Bitte gib eine gültige Postleitzahl ein')
	.max(5, 'Bitte gib eine gültige Postleitzahl ein')
	.refine((val) => val.match(/^\d+$/), {
		message: 'Bitte gib eine gültige Postleitzahl ein',
	});

export const postalCodeAsyncSchema = postalCodeSyncSchema.refine(
	async (val) => {
		try {
			const data = await queryClient.ensureQueryData({
				queryKey: ADDRESS_KEYS.cities(val),
				queryFn: () => fetchCities(val),
			});

			if (data.length > 0) return true;
			return false;
		} catch (error) {
			console.error('postalCode', error);
			return false;
		}
	},
	{
		message: 'Leider konnten wir keine Stadt zu dieser Postleitzahl finden',
	},
);

export const cityNameSyncSchema = z
	.string()
	.min(1, 'Bitte wähle eine Stadt aus');
export const cityNameAyncSchema = async ({ postalCode, cityName }) => {
	try {
		const data = await queryClient.ensureQueryData({
			queryKey: ADDRESS_KEYS.cities(postalCode),
			queryFn: () => fetchCities(postalCode),
		});

		if (data.length > 0 && data.some((city) => city.name === cityName)) {
			return true;
		}
		return false;
	} catch (error) {
		console.error('cityName', error);
		return false;
	}
};

export const cityIdSyncSchema = z
	.number()
	.positive('Bitte wähle eine Stadt aus');
export const cityIdAsyncSchema = async ({ postalCode, cityId }) => {
	try {
		const data = await queryClient.ensureQueryData({
			queryKey: ADDRESS_KEYS.cities(postalCode),
			queryFn: () => fetchCities(postalCode),
		});

		if (data.length > 0 && data.some((city) => city.id === cityId)) {
			return true;
		}
		return false;
	} catch (error) {
		console.error('cityId', error);
		return false;
	}
};

export const conumptionSyncSchema = z
	.number()
	.positive('Bitte gib einen gültigen Verbrauch ein')
	.min(50, 'Bitte gib einen gültigen Verbrauch ein (min. 50 kWh)')
	.max(
		100000,
		'Bitte gib einen gültigen Verbrauch ein (max. 10.000 kWh). Wenn du mehr verbrauchst schau dich doch mal auf unserem Energie Marktplatz um.',
	);

export const energyTypesSyncSchema = z
	.array(PLANT_TYPE_WITHOUT_DEFAULT)
	.min(1, 'Bitte wähle mindestens eine Energieart aus');

export const configSchemaAsync = z
	.object({
		postalCode: postalCodeAsyncSchema,
		cityName: cityNameSyncSchema,
		cityId: cityIdSyncSchema,
		consumption: conumptionSyncSchema,
		energyTypes: energyTypesSyncSchema,
	})
	.refine(
		async ({ postalCode, cityName }) => {
			const result = await cityNameAyncSchema({ postalCode, cityName });
			return result;
		},
		{
			path: ['cityName'],
			message:
				'Leider konnten wir keine Stadt zu dieser Postleitzahl finden',
		},
	)
	.refine(
		async ({ postalCode, cityId }) => {
			const result = await cityIdAsyncSchema({ postalCode, cityId });
			return result;
		},
		{
			path: ['cityId'],
			message:
				'Leider konnten wir keine Stadt zu dieser Postleitzahl finden',
		},
	);
