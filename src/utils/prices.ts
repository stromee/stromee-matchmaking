import { Price } from './types';

export const priceWithDelta = (price: Price, delta: number) => {
	const { clientPriceData } = price;
	const consumption = clientPriceData.usage;

	const deltaPriceNetto = delta * (1 - 0.19);
	const deltaPriceBruttoEuro = delta / 100;
	const deltaPriceNettoEuro = deltaPriceNetto / 100;

	const workingPriceBrutto = clientPriceData.workingPriceBrutto + delta;
	const workingPriceNetto =
		clientPriceData.workingPriceNetto + deltaPriceNetto;

	const usagePriceBrutto =
		clientPriceData.usagePriceBrutto + deltaPriceBruttoEuro * consumption;
	const usagePriceNetto =
		clientPriceData.usagePriceNetto + deltaPriceNettoEuro * consumption;

	const totalBrutto = usagePriceBrutto + clientPriceData.basePriceBrutto;
	const totalNetto = usagePriceNetto + clientPriceData.basePriceNetto;
	const deposit = {
		divisor: clientPriceData.deposit.divisor,
		brutto: Math.ceil(totalBrutto / clientPriceData.deposit.divisor),
		netto: Math.ceil(totalNetto / clientPriceData.deposit.divisor),
	};

	const mergedPriceData = {
		...clientPriceData,
		workingPriceBrutto,
		workingPriceNetto,
		usagePriceBrutto,
		usagePriceNetto,
		deposit,
	};
	return {
		priceData: mergedPriceData,
		rawPrice: clientPriceData,
	};
};
