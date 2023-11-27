import { Link } from 'react-router-dom';
import { Card, Image, Paragraph, Theme, View, XStack, YStack } from 'tamagui';

import { Producer } from '@utils/types';

import { Chip } from './chip';
import { BodyText } from './themed/body-text';

const ProducerPreview = ({ producer }: { producer: Producer }) => {
	return (
		<Theme name="secondary">
			<Link to={`/matches/${producer.id}`}>
				<Card
					borderRadius="$4"
					overflow="hidden"
					width="$full"
					shadowColor="$baseStromeeNavyOpacity20"
					shadowRadius={8}
					shadowOffset={{
						width: 0,
						height: 0,
					}}
				>
					<XStack>
						<View flex={1} flexBasis={1} flexGrow={1}>
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
						</View>
						<YStack
							flex={1}
							flexBasis={1}
							flexGrow={2}
							p="$2"
							gap="$1"
						>
							<Paragraph numberOfLines={1}>
								<BodyText fontWeight="bold">XXX€</BodyText>{' '}
								/Monat
							</Paragraph>

							<Paragraph numberOfLines={1}>
								{producer.name}
							</Paragraph>
							<Chip>Hallo</Chip>
						</YStack>
					</XStack>
				</Card>
			</Link>
		</Theme>
	);
};

export { ProducerPreview };
