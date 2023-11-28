import { Button, Image, Paragraph, ScrollView, View, YStack } from 'tamagui';

import { color } from '@theme/tokens';

import ArrowUp from '@components/icons/arrow-up.svg?react';
import Left from '@components/icons/chevron-left.svg?react';

import { Producer } from '@utils/types';

import { Button as ThemedButton } from './themed/button';

const ProducerDetail = ({
	producer,
	onBack: handleBack,
	floatingButton = false,
}: {
	producer: Producer;
	onBack?: () => void;
	floatingButton?: boolean;
}) => {
	return (
		<ScrollView pos="relative">
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
				{!floatingButton && (
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
				)}
			</View>

			<YStack px="$4" py="$8" gap="$4">
				<Paragraph>Match {producer.id}</Paragraph>
				<Paragraph>{JSON.stringify(producer, null, 2)}</Paragraph>
			</YStack>
			{floatingButton && (
				<View pos="sticky" bottom="$0" jc="flex-end" ai="center" p="$2">
					<ThemedButton
						onPress={() => {
							if (handleBack) {
								handleBack();
							}
						}}
						circular
						size={undefined}
						height="unset"
						width="unset"
						maxWidth="unset"
						maxHeight="unset"
						p="$1"
					>
						<ArrowUp style={{ color: color.baseStromeeNavy }} />
					</ThemedButton>
				</View>
			)}
		</ScrollView>
	);
};

export { ProducerDetail };
