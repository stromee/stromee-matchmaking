import { createSwipableStore } from './swipable-store';
import { Producer } from './types';

const EMPTY_PRODUCERS: { id: string; value: Producer }[] = [];
const producerStore = createSwipableStore(EMPTY_PRODUCERS, 'producers');

export { producerStore };
