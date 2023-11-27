import { configStore } from '@utils/config-store';
import {
	CAMPAIGN_IDENTIFIER,
	ENERGY_TYPE,
	PRODUCT_CODE,
} from '@utils/constants';

import { usePriceQuery } from './use-price-query';

export const usePrice = () => {
	const postalCode = configStore.use.postalCode();
	const cityId = configStore.use.cityId();
	const cityName = configStore.use.cityName();
	const consumption = configStore.use.consumption();

	const query = usePriceQuery({
		postalCode,
		cityId,
		cityName,
		consumption,
		energyType: ENERGY_TYPE.Values.electricity,
		productCode: PRODUCT_CODE,
		campaignIdentifier: CAMPAIGN_IDENTIFIER,
	});

	return query;
};
