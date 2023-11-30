import { View } from 'tamagui';

import MapPin from '@components/icons/map-pin.svg?react';

import { formatDistance } from '@utils/format';

import { BodyText } from './themed/body-text';

export type ProducerDistanceProps = {
	distance: number | undefined;
	fallback: string;
};

const ProducerDistance = ({ distance, fallback }: ProducerDistanceProps) => {
	return (
		<View ai="center" gap="$1">
			<MapPin style={{ width: 16, height: 16 }} />
			{distance !== undefined ? (
				<BodyText fontSize="$2" numberOfLines={1} userSelect="none">
					{formatDistance(distance)} km entfernt
				</BodyText>
			) : (
				<BodyText fontSize="$2" numberOfLines={1} userSelect="none">
					{fallback}
				</BodyText>
			)}
		</View>
	);
};

export { ProducerDistance };
