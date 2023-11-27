import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

import { ENERGY_TYPE, PRICE_LOCATOR_URL } from '@utils/constants';
import { PRICE_KEYS } from '@utils/query';
import {
	cityIdSyncSchema,
	cityNameSyncSchema,
	conumptionSyncSchema,
	postalCodeSyncSchema,
} from '@utils/schema';
import { Price } from '@utils/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fixData = (data: any) => {
	return data;
};

export const getPriceParams = ({
	postalCode,
	cityId,
	cityName,
	energyType,
	consumption,
	productCode,
	campaignIdentifier,
}: Record<string, unknown>) => {
	return {
		postalCode,
		cityId,
		cityName,
		energyType,
		consumption,
		productCode,
		campaignIdentifier,
	} as Record<string, unknown>;
};

export const priceSyncSchema = z
	.object({
		postalCode: postalCodeSyncSchema,
		cityId: cityIdSyncSchema,
		cityName: cityNameSyncSchema,
		energyType: z.string().refine((val) => ENERGY_TYPE.enum[val]),
		consumption: conumptionSyncSchema,
		productCode: z.string().min(1),
		campaignIdentifier: z.string().min(1),
	})
	.required();

export const fetchPrice = async (input: Record<string, unknown>) => {
	const fixedInput = getPriceParams(input);

	try {
		priceSyncSchema.parse(fixedInput);
	} catch (error) {
		if (error instanceof z.ZodError) {
			Object.assign(error, { retry: false });
		}
		throw error;
	}

	fixedInput.usage = fixedInput.consumption;
	delete fixedInput.consumption;

	const result = await fetch(`${PRICE_LOCATOR_URL}/priceForPostalCode`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(fixedInput),
	})
		.then(async (res) => {
			const data = await res.json();
			if (res.ok) return fixData(data);
			const error = new Error(
				'An error occurred while fetching the data.',
			);
			Object.assign(error, { ...data, retry: false });
			throw error;
		})
		.catch((error) => {
			throw error;
		});

	return result as Price;
};

export const usePriceQuery = (input: Record<string, unknown>) => {
	const query = useQuery({
		queryFn: () => fetchPrice(input),
		select: (data) => data,
		queryKey: PRICE_KEYS.price(getPriceParams(input)),
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
		refetchOnWindowFocus: true,
		refetchOnMount: false,
		retry: (failureCount, error) => {
			if ('retry' in error && error.retry === false) {
				return false;
			}

			return failureCount < 3;
		},
		// initialData: keepPreviousData,
	});

	return query;
};
