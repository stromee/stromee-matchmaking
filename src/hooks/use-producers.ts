import { configStore } from '@utils/config-store';

import { useProducersQuery } from './use-producers-query';

export const useProducers = () => {
	const postalCode = configStore.use.postalCode();
	const query = useProducersQuery({ postalCode });

	return query;
};
