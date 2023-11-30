import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { View } from 'tamagui';

import Service from '@components/icons/service.svg?react';
import Star from '@components/icons/star.svg?react';

import { useProducerInfo } from '@hooks/use-producer-tag-query';

import { BodyText } from './themed/body-text';

export type ProducerShortProps = {
	id: number;
};

const ProducerShort = ({ id }: ProducerShortProps) => {
	const producerInfo = useProducerInfo({ producerId: id });

	if (producerInfo.data) {
		return (
			<View ai="center" gap="$1">
				<AccessibleIcon label="Beschreibung:">
					<Star style={{ width: 16, height: 16 }} />
				</AccessibleIcon>

				<BodyText fontSize="$2" numberOfLines={1}>
					{producerInfo.data.short}
				</BodyText>
			</View>
		);
	}

	return (
		<View ai="center" gap="$1">
			<View w="$4" h="$4">
				<AccessibleIcon label="Beschreibung:">
					<Service />
				</AccessibleIcon>
			</View>
			<BodyText fontSize="$2" numberOfLines={1}>
				Energiewunder
			</BodyText>
		</View>
	);
};

export { ProducerShort };
