import Award from '@components/icons/award.svg?react';
import Crown from '@components/icons/crown.svg?react';
import Fire from '@components/icons/fire.svg?react';
import HandHeart from '@components/icons/hand-heart.svg?react';
import Hearts from '@components/icons/hearts.svg?react';
import Medal from '@components/icons/medal.svg?react';
import Rainbow from '@components/icons/rainbow.svg?react';
import Seedling from '@components/icons/seedling.svg?react';
import Service from '@components/icons/service.svg?react';
import Smile from '@components/icons/smile.svg?react';
import Wand from '@components/icons/wand.svg?react';

import { useProducerTagQuery } from '@hooks/use-producer-tag-query';

import { configStore } from '@utils/config-store';
import { PLANT_TYPE_WITHOUT_DEFAULT } from '@utils/constants';
import { Producer } from '@utils/types';

import { Chip } from './chip';

export type ProducerTagProps = {
	producer: Producer;
};

const ENERGY_TYPE_MATCH = [
	'Eure Energie matched',
	'Perfektes Energiematch',
	'Energie stimmt',
	'Die Spannung ist da',
	'Gleiches Energielevel',
	'Einzigartige Energie',
];

const DISTANCE_MATCH = [
	'Ihr seid quasi Nachbarn',
	'Praktisch Tür an Tür',
	'Kurze Wege, lange Liebe',
	'Der kurze Weg zum Glück',
	'Nähe schafft Verbundenheit',
	'Geringe Distanz, große Sympathie',
];
const PRICE_MATCH = ['Günstigster Preis', 'Preiskracher'];

const SUPER_MATCH = [
	'Supermatch!',
	'Watt ein Match',
	'Hier passt wirklich alles',
	'Volltreffer',
];

const fallback = 'Wahres Energiewunder';

const TAG_ICONS = [
	<HandHeart />,
	<Rainbow />,
	<Service />,
	<Crown />,
	<Wand />,
	<Smile />,
	<Medal />,
];

const ProducerTag = ({ producer }: ProducerTagProps) => {
	const producerTag = useProducerTagQuery({ producerId: producer.id });
	const energyTypes = configStore.use.energyTypes();

	if (
		producer.distance &&
		producer.distance < 80 &&
		energyTypes.includes(producer.plantType as PLANT_TYPE_WITHOUT_DEFAULT)
	) {
		return (
			<Chip icon={<Hearts />}>
				{SUPER_MATCH[producer.id % SUPER_MATCH.length]}
			</Chip>
		);
	}

	if (producer.deltaPrice === 0) {
		return (
			<Chip icon={<Award />}>
				{PRICE_MATCH[producer.id % PRICE_MATCH.length]}
			</Chip>
		);
	}

	if (producer.distance && producer.distance < 50) {
		return (
			<Chip icon={<Seedling />}>
				{DISTANCE_MATCH[producer.id % DISTANCE_MATCH.length]}
			</Chip>
		);
	}

	if (
		energyTypes.includes(producer.plantType as PLANT_TYPE_WITHOUT_DEFAULT)
	) {
		return (
			<Chip icon={<Fire />}>
				{ENERGY_TYPE_MATCH[producer.id % ENERGY_TYPE_MATCH.length]}
			</Chip>
		);
	}

	if (producerTag.data) {
		return (
			<Chip icon={TAG_ICONS[producer.id % TAG_ICONS.length]}>
				{producerTag.data.tag}
			</Chip>
		);
	}

	return <Chip icon={<Rainbow />}>{fallback}</Chip>;
};

export { ProducerTag };
