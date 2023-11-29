import { LinearGradient } from '@tamagui/linear-gradient';
import { interpolate } from 'react-native-reanimated';
import {
	AnimatePresence,
	Card,
	H4,
	Image,
	Paragraph,
	Theme,
	View,
	ZStack,
	clamp,
} from 'tamagui';

import { color } from '@theme/tokens';

import ArrowDown from '@components/icons/arrow-down.svg?react';

import { usePrice } from '@hooks/use-price';

import { formatDistance } from '@utils/format';
import { priceWithDelta } from '@utils/prices';
import { Producer } from '@utils/types';

import { Chip } from './chip';
import { BodyText } from './themed/body-text';
import { Button } from './themed/button';

const ProducerSwipable = ({
	producer,
	indexAfterActive,
	onProducerDetailClick: handleProducerDetailClick,
}: {
	producer: Producer;
	indexAfterActive: number;
	onProducerDetailClick: (producer: Producer) => void;
}) => {
	const price = usePrice();
	console.log('price', price.data);
	const mergedPrice = price.data
		? priceWithDelta(price.data, producer.deltaPrice)
		: undefined;

	console.log('deposit', mergedPrice);
	return (
		<Theme name="base">
			<Card
				overflow="hidden"
				position="relative"
				borderRadius="$6"
				width="364px"
				height="440px"
				maxWidth="$full"
				maxHeight="$full"
				animation="quick"
				animateOnly={['transform', 'boxShadow']}
				transform={[
					{
						translateY: interpolate(
							clamp(indexAfterActive, [0, 3]),
							[0, 3],
							[0, 64],
						),
					},
					{
						scale: interpolate(
							clamp(indexAfterActive, [0, 3]),
							[0, 3],
							[1, 0.8],
						),
					},
				]}
			>
				<Card.Footer
					padding="$4"
					gap="$2"
					fd="column"
					theme="popPetrol"
				>
					{mergedPrice && (
						<Paragraph
							theme="secondary"
							borderTopLeftRadius="$full"
							borderBottomLeftRadius="$full"
							p="$2"
							pl="$4"
							mr="$-4"
							bg="$background"
							display="flex"
							alignSelf="flex-end"
							ai="center"
							jc="center"
						>
							<BodyText fontWeight="bold">
								{mergedPrice.priceData.deposit.brutto}€
							</BodyText>{' '}
							<BodyText>/Monat</BodyText>
						</Paragraph>
					)}
					<Chip>langfristige Beziehung</Chip>

					<H4 numberOfLines={2} userSelect="none">
						{producer.name}
					</H4>

					<Paragraph numberOfLines={1} userSelect="none">
						Halloooo
					</Paragraph>

					<View flexWrap="wrap" pr="$10" rowGap="$2" columnGap="$4">
						<Paragraph numberOfLines={1} userSelect="none">
							{producer.distance
								? `${formatDistance(
										producer.distance,
								  )} km entfernt`
								: `${producer.postalCode} ${producer.city}`}
						</Paragraph>
						<Paragraph numberOfLines={1} userSelect="none">
							Familienbetrieb
						</Paragraph>
					</View>

					<Button
						theme="base"
						right="$4"
						bottom="$4"
						position="absolute"
						onPress={() => {
							handleProducerDetailClick(producer);
						}}
						circular
						size={undefined}
						height="unset"
						width="unset"
						maxWidth="unset"
						maxHeight="unset"
						p="$1"
						bg="$baseCloudWhiteOpacity80"
					>
						<ArrowDown style={{ color: color.baseStromeeNavy }} />
					</Button>
				</Card.Footer>
				<Card.Background>
					<ZStack flex={1}>
						<Image
							width="$full"
							height="$full"
							resizeMode="cover"
							alignSelf="center"
							source={{
								// width: 200,
								// height: 100,
								uri: producer.picture,
							}}
						/>
						<View flex={1} ai="flex-end">
							<LinearGradient
								width="$full"
								height="80%"
								colors={[
									'$baseStromeeNavyOpacity80',
									'$transparent',
								]}
								start={[0, 2]}
								end={[0, 0]}
							/>
						</View>
					</ZStack>
				</Card.Background>
			</Card>
		</Theme>
	);
};

export { ProducerSwipable };
