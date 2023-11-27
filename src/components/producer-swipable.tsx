import { LinearGradient } from '@tamagui/linear-gradient';
import { interpolate } from 'react-native-reanimated';
import {
	Card,
	H4,
	Image,
	Paragraph,
	Theme,
	View,
	ZStack,
	clamp,
} from 'tamagui';

import { formatDistance } from '@utils/format';
import { Producer } from '@utils/types';

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
	return (
		<Theme name="base">
			<Card
				borderRadius="$6"
				overflow="hidden"
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
					{producer.distance ? (
						<Paragraph>
							{formatDistance(producer.distance)} km entfernt
						</Paragraph>
					) : (
						<Paragraph>
							{producer.postalCode} {producer.city}
						</Paragraph>
					)}

					<H4 numberOfLines={2} userSelect="none">
						{producer.name}
					</H4>

					<Paragraph userSelect="none">Windenergie</Paragraph>
					<Paragraph userSelect="none">Familienbetrieb</Paragraph>
					<Paragraph userSelect="none">
						langfristige Beziehung
					</Paragraph>
					<Paragraph userSelect="none">Wahre Liebe</Paragraph>
					<Button
						onPress={() => {
							handleProducerDetailClick(producer);
						}}
					>
						open
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
