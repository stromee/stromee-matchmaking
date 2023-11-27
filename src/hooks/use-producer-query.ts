import { useProducersQuery } from './use-producers-query';

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

export const useProducerQuery = (input: Record<string, unknown>) => {
	const fixedInput = getProducerParams(input);
	const query = useProducersQuery(fixedInput, (producers) => {
		const producer = producers.find((p) => p.id === fixedInput.producerId);
		if (!producer) {
			const error = new Error('Producer not found');
			Object.assign(error, { retry: false });
			throw error;
		}
		return producer;
	});

	return query;
};
