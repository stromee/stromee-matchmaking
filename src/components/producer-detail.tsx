import { H4, Image, Paragraph, ScrollView, View, YStack } from 'tamagui';

import { color } from '@theme/tokens';

import ArrowUp from '@components/icons/arrow-up.svg?react';
import Left from '@components/icons/chevron-left.svg?react';
import MoreHorizontal from '@components/icons/more-horizontal.svg?react';

import { usePrice } from '@hooks/use-price';

import { priceWithDelta } from '@utils/prices';
import { Producer } from '@utils/types';

import { Chip } from './chip';
import { Prose } from './prose';
import { BodyText } from './themed/body-text';
import { Button } from './themed/button';

const ProducerDetail = ({
	producer,
	onBack: handleBack,
	floatingButton = false,
}: {
	producer: Producer;
	onBack?: () => void;
	floatingButton?: boolean;
}) => {
	const price = usePrice();
	const mergedPrice = price.data
		? priceWithDelta(price.data, producer.deltaPrice)
		: undefined;

	return (
		<ScrollView pos="relative" flex={1} contentContainerStyle={{ flex: 1 }}>
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
						theme="base"
						minHeight="initial"
						height="initial"
						pos="absolute"
						top="$4"
						left="$4"
						ai="center"
						jc="center"
						height="unset"
						width="unset"
						maxWidth="unset"
						maxHeight="unset"
						p="$1"
						color="$baseStromeeNavy"
						bg="$baseCloudWhiteOpacity80"
						borderStyle="solid"
						borderWidth="1px"
						borderColor="$transparent"
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
				<YStack gap="$2">
					{mergedPrice ? (
						<Paragraph>
							<BodyText fontWeight="bold">
								{mergedPrice.priceData.deposit.brutto}€
							</BodyText>{' '}
							<BodyText>/Monat</BodyText>
						</Paragraph>
					) : (
						<View h="$6">
							<MoreHorizontal
								style={{ color: color.baseStromeeNavy }}
							/>
						</View>
					)}

					<Chip>Hallo</Chip>
					<H4>{producer.name}</H4>
				</YStack>
				<YStack gap="$2">
					<Paragraph fontWeight="bold">Über uns</Paragraph>
					<Prose>{producer.extendedDescription}</Prose>
				</YStack>
			</YStack>
			{floatingButton && (
				<View
					// @ts-expect-error - this value works but throws a typescript error
					pos="sticky"
					bottom="$0"
					jc="flex-end"
					ai="center"
					p="$4"
					mt="auto"
				>
					<Button
						minHeight="initial"
						height="initial"
						onPress={() => {
							if (handleBack) {
								handleBack();
							}
						}}
						p="$1"
					>
						<ArrowUp style={{ color: color.baseStromeeNavy }} />
					</Button>
				</View>
			)}
		</ScrollView>
	);
};

export { ProducerDetail };
