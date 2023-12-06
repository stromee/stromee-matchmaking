import Award from '@components/icons/award.svg?react';
import Fire from '@components/icons/fire.svg?react';
import Hearts from '@components/icons/hearts.svg?react';

import { configStore } from '@utils/config-store';
import { Producer } from '@utils/types';

import { Chip } from './chip';
import { PlantTypeIcon } from './plant-type-icon';

export type ProducerTagProps = {
	producer: Producer;
};

const ENERGY_TYPE_MATCH = [
	'Dieselbe Energiewelle',
	'Perfektes Energiematch',
	'Die Energie stimmt',
	'Die Spannung ist greifbar',
];

const DISTANCE_MATCH = [
	'Regionaler Strom, globale Liebe',
	'Kurze Wege, lange Liebe',
	'Der kurze Weg zur Energie',
	'Nähe, die verbindet',
	'Energie ohne Kilometer',
];
const PRICE_MATCH = ['Liebe zum kleinen Preis', 'Pure Energie, kleiner Preis'];

const SUPER_MATCH = [
	'Supermatch',
	'Hier passt wirklich alles',
	'Für einander bestimmt',
];

const ProducerTag = ({ producer }: ProducerTagProps) => {
	const energyType = configStore.use.energyType();

	if (
		producer.distance &&
		producer.distance < 100 &&
		energyType === producer.plantType
	) {
		return (
			<Chip icon={<Hearts width={16} height={16} />}>
				{SUPER_MATCH[producer.id % SUPER_MATCH.length]}
			</Chip>
		);
	}

	if (producer.deltaPrice === 0) {
		return (
			<Chip icon={<Award width={16} height={16} />}>
				{PRICE_MATCH[producer.id % PRICE_MATCH.length]}
			</Chip>
		);
	}

	if (producer.distance && producer.distance < 100) {
		return (
			<Chip icon={<Fire width={16} height={16} />}>
				{DISTANCE_MATCH[producer.id % DISTANCE_MATCH.length]}
			</Chip>
		);
	}

	if (energyType === producer.plantType) {
		return (
			<Chip
				icon={
					<PlantTypeIcon
						type={producer.plantType}
						width={16}
						height={16}
					/>
				}
			>
				{ENERGY_TYPE_MATCH[producer.id % ENERGY_TYPE_MATCH.length]}
			</Chip>
		);
	}

	return null;
};

export { ProducerTag };
