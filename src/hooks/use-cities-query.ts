import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

import { ADDRESS_SERVICE_URL } from '@utils/constants';
import { ADDRESS_KEYS } from '@utils/query';
import { postalCodeSyncSchema } from '@utils/schema';
import { City } from '@utils/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fixData = (data: any) => {
	return data.map((city) => {
		return {
			id: city.id,
			postalCode: city.postcode.toString(),
			name: city.name,
		};
	});
};

export const fetchCities = async (postalCode: string) => {
	try {
		postalCodeSyncSchema.parse(postalCode);
	} catch (error) {
		if (error instanceof z.ZodError) {
			Object.assign(error, { retry: false });
		}
		throw error;
	}

	const result = await fetch(
		`${ADDRESS_SERVICE_URL}/postcode/${postalCode}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)
		.then(async (res) => {
			const data = await res.json();
			console.log(data);
			if (res.ok) return fixData(data) as City[];
			const error = new Error(
				'An error occurred while fetching the data.',
			);
			Object.assign(error, { ...data, retry: false });
			throw error;
		})
		.catch((error) => {
			throw error;
		});

	return result;
};

export const useCitiesQuery = (postalCode: string) =>
	useQuery({
		queryFn: () => fetchCities(postalCode),
		queryKey: ADDRESS_KEYS.cities(postalCode),
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: (failureCount, error) => {
			if ('retry' in error && error.retry === false) {
				return false;
			}

			return failureCount < 3;
		},
	});
