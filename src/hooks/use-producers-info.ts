import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

import {
	DEFAULT_MARKETPLACE_ID,
	DEFAULT_ORDER_BY,
	DEFAULT_SORT_DIRECTION,
	DEFAULT_ZIP,
	LITION_BACKEND_URL,
	ORDER_BY,
	SORT_DIRECTION,
} from '@utils/constants';
import { PRODUCER_KEYS } from '@utils/query';
import { postalCodeSyncSchema } from '@utils/schema';
import { Producer } from '@utils/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fixData = (data: any) => {
	return data
		.map((producer) => {
			const p = { ...producer };
			p.postalCode = producer.postcode;
			delete p.postcode;
			return p;
		})
		.filter((producer) => producer.status === 'active');
};

export const getProducersParams = ({
	orderBy = DEFAULT_ORDER_BY,
	postalCode = DEFAULT_ZIP,
	ascDesc = DEFAULT_SORT_DIRECTION,
	marketplaceId = DEFAULT_MARKETPLACE_ID,
}: Record<string, unknown>) => {
	const params = {
		orderBy,
		postalCode,
		ascDesc,
		marketplaceId,
	};

	Object.entries(params).forEach(([key, value]) => {
		if (typeof value !== 'string') {
			params[key] = String(value);
		}
	});

	return params as Record<string, string>;
};

export const producersSyncSchema = z
	.object({
		orderBy: z.string().refine((val) => ORDER_BY.enum[val]),
		postalCode: postalCodeSyncSchema,
		ascDesc: z.string().refine((val) => SORT_DIRECTION.enum[val]),
		marketplaceId: z
			.string()
			.min(1)
			.refine((val) => val.match(/^\d+$/)),
	})
	.required();

export const fetchProducers = async (input: Record<string, unknown>) => {
	const fixedInput = getProducersParams(input);

	try {
		producersSyncSchema.parse(fixedInput);
	} catch (error) {
		if (error instanceof z.ZodError) {
			Object.assign(error, { retry: false });
		}
		throw error;
	}

	fixedInput.zip = fixedInput.postalCode;
	delete fixedInput.postalCode;

	const params = new URLSearchParams(fixedInput);

	const result = await fetch(
		`${LITION_BACKEND_URL}/producers/getAll?${params.toString()}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)
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

	return result as Producer[];
};

export const useProducersQuery = <TData = Producer[]>(
	input: Record<string, unknown>,
	select?: (data: Producer[]) => TData,
) => {
	const query = useQuery({
		queryFn: () => fetchProducers(input),
		queryKey: PRODUCER_KEYS.producers(getProducersParams(input)),
		select,
		staleTime: 1000 * 60 * 5,
		gcTime: Infinity,
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
