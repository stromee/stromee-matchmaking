import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

import { PRODUCER_KEYS } from '@utils/query';
import { postalCodeSyncSchema } from '@utils/schema';
import { Producer } from '@utils/types';

import { fetchProducers } from './use-producers-query';

export const getProducerParams = ({
	producerId,
	postalCode,
}: Record<string, unknown>) => {
	const params = {
		producerId,
		postalCode,
	};

	return params as Record<string, unknown>;
};

export const producerSyncSchema = z
	.object({
		producerId: z
			.string()
			.min(1)
			.refine((val) => val.match(/^\d+$/)),
		postalCode: postalCodeSyncSchema,
	})
	.required();

export const fetchProducer = async (input: Record<string, unknown>) => {
	const fixedInput = getProducerParams(input);

	try {
		producerSyncSchema.parse(fixedInput);
	} catch (error) {
		if (error instanceof z.ZodError) {
			Object.assign(error, { retry: false });
		}
		throw error;
	}

	const producers = await fetchProducers(fixedInput);

	const producer = producers.find((p) => p.id === fixedInput.producerId);
	if (!producer) {
		const error = new Error('Producer not found');
		Object.assign(error, { retry: false });
		throw error;
	}

	return producer;
};

export const useProducerQuery = (input: Record<string, unknown>) => {
	const query = useQuery({
		queryFn: () => fetchProducer(input),
		select: (data) => data,
		queryKey: PRODUCER_KEYS.producer(getProducerParams(input)),
		staleTime: 1000 * 60 * 5, // 5 minutes
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
