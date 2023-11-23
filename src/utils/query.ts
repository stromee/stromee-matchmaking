export const PRODUCER_KEYS = {
  all: () => ["producers"],
  producers: (filter: Record<string, string>) => [
    ...PRODUCER_KEYS.all(),
    filter,
  ],
  producer: (filter: Record<string, string>) => [
    ...PRODUCER_KEYS.all(),
    "producer",
    filter,
  ],
};

export const ADDRESS_KEYS = {
  all: () => ["postalCode"],
  cities: (postalCode: string) => [...ADDRESS_KEYS.all(), "city", postalCode],
  streets: (cityId: number) => [...ADDRESS_KEYS.all(), "streets", cityId],
};
