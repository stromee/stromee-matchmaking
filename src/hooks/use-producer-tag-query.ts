import { useProducersInfoQuery } from './use-producers-info-query';

export const getProducerInfoParams = ({
	producerId,
}: Record<string, unknown>) => {
	const params = {
		producerId,
	};

	return params as Record<string, unknown>;
};

export const useProducerInfo = (input: Record<string, unknown>) => {
	const fixedInput = getProducerInfoParams(input);

	const query = useProducersInfoQuery((producersInfo) => {
		const producerInfo = producersInfo.find(
			(p) => p.producerId === fixedInput.producerId,
		);
		if (!producerInfo) {
			const error = new Error('Producer not found');
			Object.assign(error, { retry: false });
			throw error;
		}
		return producerInfo;
	});

	return query;
};
