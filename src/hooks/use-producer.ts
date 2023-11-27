import { configStore } from '@utils/config-store';

import { useProducerQuery } from './use-producer-query';

export const useProducer = (producerId: number) => {
	const postalCode = configStore.use.postalCode();
	const query = useProducerQuery({ producerId, postalCode });

	return query;
};
