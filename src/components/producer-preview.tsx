import { useState } from 'react';

import { Link } from 'react-router-dom';
import {
	Button,
	Card,
	Image,
	Paragraph,
	Popover,
	Theme,
	View,
	XStack,
	YStack,
} from 'tamagui';

import { Producer } from '@utils/types';

import { Chip } from './chip';
import { BodyText } from './themed/body-text';

const ProducerPreview = ({ producer }: { producer: Producer }) => {
	const [open, setOpen] = useState(false);
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

							<Popover
								placement="bottom-end"
								allowFlip={true}
								stayInFrame
								open={open}
								onOpenChange={setOpen}
							>
								<Popover.Trigger
									position="absolute"
									right={0}
									alignSelf="flex-start"
									onPress={(e) => {
										e.preventDefault();
										setOpen(true);
									}}
								>
									<BodyText>Trigger</BodyText>
								</Popover.Trigger>

								<Popover.Content
									borderWidth={1}
									borderColor="$borderColor"
									enterStyle={{ y: -10, opacity: 0 }}
									exitStyle={{ y: -10, opacity: 0 }}
									elevate
									animation={[
										'quick',
										{
											opacity: {
												overshootClamping: true,
											},
										},
									]}
								>
									<Popover.Arrow
										borderWidth={1}
										borderColor="$borderColor"
									/>

									<YStack space="$3">
										<Popover.Close asChild>
											<Button
												onPress={() => {
													/* Custom code goes here, does not interfere with popover closure */
												}}
											>
												Submit
											</Button>
										</Popover.Close>
									</YStack>
								</Popover.Content>
							</Popover>
						</YStack>
					</XStack>
				</Card>
			</Link>
		</Theme>
	);
};

export { ProducerPreview };
