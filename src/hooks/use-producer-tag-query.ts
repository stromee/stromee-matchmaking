import { useProducersTagQuery } from './use-producers-tag-query';

export const getProducerTagParams = ({
	producerId,
}: Record<string, unknown>) => {
	const params = {
		producerId,
	};

	return params as Record<string, unknown>;
};

export const useProducerTagQuery = (input: Record<string, unknown>) => {
	const fixedInput = getProducerTagParams(input);

	const query = useProducersTagQuery((producersTag) => {
		const producerTag = producersTag.find(
			(p) => p.producerId === fixedInput.producerId,
		);
		if (!producerTag) {
			const error = new Error('Producer not found');
			Object.assign(error, { retry: false });
			throw error;
		}
		return producerTag;
	});

	return query;
};
