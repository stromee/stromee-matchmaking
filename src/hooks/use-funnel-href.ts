import { configStore } from '@utils/config-store';
import { LANDING_PAGE_URL } from '@utils/constants';

const useFunnelHref = (producerId: number) => {
	const consumption = configStore.use.consumption();
	const postalCode = configStore.use.postalCode();
	const cityId = configStore.use.cityId();
	const cityName = configStore.use.cityName();

	const params = new URLSearchParams({
		zip: postalCode,
		postalCode: postalCode,
		cityId: cityId.toString(),
		cityName: cityName,
		producerId: producerId.toString(),
		consumption: consumption.toString(),
	});

	return `${LANDING_PAGE_URL}/contract/powermatch/about-you?${params.toString()}`;
};

export { useFunnelHref };
