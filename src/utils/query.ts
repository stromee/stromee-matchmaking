export const TAG_KEYS = {
	all: () => ['producers-tahs'],
};

export const PRICE_KEYS = {
	all: () => ['prices'],
	price: (filter: Record<string, unknown>) => [...PRICE_KEYS.all(), filter],
};

export const PRODUCER_KEYS = {
	all: () => ['producers'],
	producers: (filter: Record<string, string>) => [
		...PRODUCER_KEYS.all(),
		filter,
	],
};

export const ADDRESS_KEYS = {
	all: () => ['postalCode'],
	cities: (postalCode: string) => [...ADDRESS_KEYS.all(), 'city', postalCode],
	streets: (cityId: number) => [...ADDRESS_KEYS.all(), 'streets', cityId],
};
