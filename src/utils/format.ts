export const formatNumber = (number: number | string) => {
	if (typeof number === 'number') {
		return formatNumber(number.toString());
	}

	return number.replace('.', ',');
};

export const formatDistance = (distance: number) => {
	if (distance < 1) {
		return formatNumber(distance.toFixed(1));
	}

	return formatNumber(distance.toFixed());
};

export const formatUnit = (value: string | number, unit: string) => {
	return `${value} ${unit}`;
};
