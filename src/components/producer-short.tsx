import { View } from 'tamagui';

import Bolt from '@components/icons/bolt.svg?react';
import HandHeart from '@components/icons/hand-heart.svg?react';
import Rainbow from '@components/icons/rainbow.svg?react';
import Seedling from '@components/icons/seedling.svg?react';
import Service from '@components/icons/service.svg?react';
import Smile from '@components/icons/smile.svg?react';
import Star from '@components/icons/star.svg?react';

import { useProducerInfo } from '@hooks/use-producer-tag-query';

import { Producer } from '@utils/types';

import { BodyText } from './themed/body-text';

export type ProducerShortProps = {
	producer: Producer;
};

const TAG_ICONS = [HandHeart, Rainbow, Service, Star, Smile, Bolt, Seedling];

const ProducerShort = ({ producer }: ProducerShortProps) => {
	const producerInfo = useProducerInfo({ producerId: producer.id });

	if (producerInfo.data) {
		const Icon = TAG_ICONS[producer.id % TAG_ICONS.length];
		return (
			<View ai="center" gap="$2">
				<View w="$4" h="$4">
					<Icon style={{ width: '100%', height: '100%' }} />
				</View>
				<BodyText fontSize="$2" numberOfLines={1}>
					{producerInfo.data.short}
				</BodyText>
			</View>
		);
	}

	return (
		<View ai="center" gap="$2">
			<View w="$4" h="$4">
				<Service />
			</View>
			<BodyText fontSize="$2" numberOfLines={1}>
				fallback
			</BodyText>
		</View>
	);
};

export { ProducerShort };
