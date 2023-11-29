/// <reference types="vite-plugin-svgr/client" />
import type { PLANT_TYPE } from './constants';

export interface Deposit {
	brutto: number;
	netto: number;
	divisor: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Price {
	clientPriceData: {
		electricityType: string;
		cityId: number;
		cityName: string;
		postalCode: string;
		street?: string;
		houseNumber?: string;
		houseNumberSuffix?: string;
		countryId: string;
		usage: number;
		business: boolean;
		netNumber: number;
		netSubNumber: number;
		netAreaNumber: number;
		primaryProviderId: number;
		variant: number;
		startDate?: string;
		endDate?: string;
		basePriceNetto: number;
		workingPrice: number;
		initialDurationDate?: string;
		priceId?: string;
		productCode: string;
		priceKey: string;
		campaignIdentifier: string;
		workingPriceNetto: number;
		workingPriceBrutto: number;
		basePriceBrutto: number;
		usagePriceBrutto: number;
		usagePriceNetto: number;
		cancellationPeriod: number;
		cancellationPeriodDays: number;
		cancellationPeriodDaysType: string;
		fixedPrice: string;
		initialDuration: number;
		deposit: Deposit;
		initialDurationType: string;
		fixedPriceMonths: number;
		bonusSavings: number;
		bonusSavingsNetto: number;
		bonusSavingsPercentage?: number;
		instantBonus: number;
		instantBonusNetto: number;
		switchingBonus: number;
		switchingBonusNetto: number;
		recurringBonus: number;
		recurringBonusNetto: number;
		bonusType: string;
		workingPriceBonusSwitching: number;
		workingPriceBonusSwitchingNetto: number;
		usageWorkingPriceBonusSwitchingBrutto: number;
		usageWorkingPriceBonusSwitchingNetto: number;
		productId: number;
		productName: string;
		energyType: string;
	};
}
export interface Producer {
	id: number;
	plantType: PLANT_TYPE;
	capacity: number;
	name: string;
	ownerId: number;
	description: string;
	picture: string;
	street: string;
	postalCode: string;
	country: null | string;
	city: string;
	lat: number;
	lon: number;
	deltaPrice: number;
	oeex_id: null | string;
	createdAt: string;
	modifiedAt: string;
	status: string;
	directMarketerId: number;
	commissioning: number;
	volumePerYear: number;
	extendedDescription: string;
	backgroundImage: string;
	payoutRatio: number;
	priority: number;
	overridePriority: number;
	marketplaceId: number;
	lon2: number;
	lat2: number;
	distance?: number;
}

export interface City {
	id: number;
	postalCode: string;
	name: string;
}
