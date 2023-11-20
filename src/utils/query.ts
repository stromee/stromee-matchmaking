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
