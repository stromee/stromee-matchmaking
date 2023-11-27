import { Button, Image, Paragraph, ScrollView, View, YStack } from 'tamagui';

import { color } from '@theme/tokens';

import Left from '@components/icons/chevron-left.svg?react';

import { Producer } from '@utils/types';

const ProducerDetail = ({
	producer,
	onBack: handleBack,
}: {
	producer: Producer;
	onBack?: () => void;
}) => {
	return (
		<ScrollView>
			<View pos="relative" aspectRatio="2/1">
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
				<Button
					unstyled
					pos="absolute"
					top="$4"
					left="$2"
					ai="center"
					jc="center"
					width="initial"
					height="initial"
					minHeight="$0"
					minWidth="$0"
					p="$1"
					color="$baseStromeeNavy"
					bg="$baseCloudWhiteOpacity60"
					borderStyle="solid"
					borderWidth="1px"
					borderColor="$transparent"
					circular
					// hoverStyle={{
					// 	bg: '$baseCloudWhiteOpacity60',
					// 	borderColor: '$baseStromeeNavy',
					// }}
					// focusStyle={{
					// 	bg: '$baseCloudWhiteOpacity60',
					// 	borderColor: '$baseStromeeNavy',
					// 	outlineColor: '$baseStromeeNavy',
					// 	outlineWidth: '2px',
					// 	outlineStyle: 'solid',
					// }}
					onPress={() => {
						if (handleBack) {
							handleBack();
						}
					}}
				>
					<Left style={{ color: color.baseStromeeNavy }} />
				</Button>
			</View>

			<YStack px="$4" py="$8" gap="$4">
				<Paragraph>Match {producer.id}</Paragraph>
				<Paragraph>{JSON.stringify(producer, null, 2)}</Paragraph>
			</YStack>
		</ScrollView>
	);
};

export { ProducerDetail };
