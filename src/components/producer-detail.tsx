import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { H4, Image, Paragraph, ScrollView, Theme, View, YStack } from 'tamagui';

import { color } from '@theme/tokens';

import ArrowUp from '@components/icons/arrow-up.svg?react';
import Left from '@components/icons/chevron-left.svg?react';
import MoreHorizontal from '@components/icons/more-horizontal.svg?react';

import { usePrice } from '@hooks/use-price';

import { formatNumber, formatUnit } from '@utils/format';
import { handleStoryblokImage } from '@utils/misc';
import { priceWithDelta } from '@utils/prices';
import { Producer } from '@utils/types';

import { ProducerDistance } from './producer-distance';
import { ProducerPlantType } from './producer-plant';
import { ProducerShort } from './producer-short';
import { ProducerTag } from './producer-tag';
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
		<Theme name="base">
			<ScrollView
				pos="relative"
				flex={1}
				minHeight="$full"
				contentContainerStyle={{ flex: 1, minHeight: '100%' }}
			>
				<View width="$full" aspectRatio="2/1">
					<Image
						width="$full"
						height="$full"
						resizeMode="cover"
						alignSelf="center"
						source={{
							// width: 200,
							// height: 100,
							uri: handleStoryblokImage(producer.picture),
						}}
					/>
				</View>

				<YStack px="$4" py="$8" gap="$8">
					<YStack gap="$4">
						{mergedPrice ? (
							<Paragraph>
								<BodyText fontWeight="bold">
									{mergedPrice.priceData.deposit.brutto}€
								</BodyText>{' '}
								<BodyText>/Monat</BodyText>
							</Paragraph>
						) : (
							<View h="$6">
								<AccessibleIcon label="Preis wird geladen">
									<MoreHorizontal
										style={{ color: color.baseStromeeNavy }}
									/>
								</AccessibleIcon>
							</View>
						)}

						<ProducerTag producer={producer} />
						<YStack gap="$2">
							<H4 numberOfLines={1} userSelect="none">
								{producer.name}
							</H4>
							<ProducerShort id={producer.id} />

							<View
								flexWrap="wrap"
								pr="$10"
								rowGap="$2"
								columnGap="$4"
							>
								<ProducerDistance
									distance={producer.distance}
									fallback={`${producer.postalCode} ${producer.city}`}
								/>
								<ProducerPlantType type={producer.plantType} />
							</View>
						</YStack>
					</YStack>
					<YStack gap="$2">
						<Paragraph fontWeight="bold">Über uns</Paragraph>
						<Prose>{producer.extendedDescription}</Prose>
					</YStack>
					<YStack gap="$2">
						<>
							<Paragraph fontWeight="bold">Kosten</Paragraph>
							{mergedPrice ? (
								<>
									<Paragraph
										gap="$2"
										display="flex"
										justifyContent="space-between"
										flexWrap="wrap"
									>
										<BodyText>Abschlag</BodyText>
										<BodyText>
											{formatUnit(
												formatNumber(
													mergedPrice.priceData
														.deposit.brutto,
												),
												'€/Monat',
											)}
										</BodyText>
									</Paragraph>
									<Paragraph
										gap="$2"
										display="flex"
										justifyContent="space-between"
										flexWrap="wrap"
									>
										<BodyText>Arbeitspreis</BodyText>
										<BodyText>
											{formatUnit(
												formatNumber(
													Math.round(
														mergedPrice.priceData
															.workingPriceBrutto *
															100,
													) / 100,
												),
												'ct/kWh',
											)}
										</BodyText>
									</Paragraph>
									<Paragraph
										gap="$2"
										display="flex"
										justifyContent="space-between"
										flexWrap="wrap"
									>
										<BodyText>Grundpreis</BodyText>
										<BodyText>
											{formatUnit(
												formatNumber(
													Math.round(
														(mergedPrice.priceData
															.basePriceBrutto /
															12) *
															100,
													) / 100,
												),
												'€/Monat',
											)}
										</BodyText>
									</Paragraph>
								</>
							) : (
								<View h="$6">
									<MoreHorizontal
										style={{ color: color.baseStromeeNavy }}
									/>
								</View>
							)}
						</>
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
							<AccessibleIcon label="zurück">
								<ArrowUp
									style={{ color: color.baseStromeeNavy }}
								/>
							</AccessibleIcon>
						</Button>
					</View>
				)}
			</ScrollView>
			{!floatingButton && (
				<Button
					theme="base"
					pos="absolute"
					top="$6"
					left="$4"
					ai="center"
					jc="center"
					height="unset"
					width="unset"
					minWidth="unset"
					minHeight="unset"
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
					<AccessibleIcon label="zurück">
						<Left style={{ color: color.baseStromeeNavy }} />
					</AccessibleIcon>
				</Button>
			)}
		</Theme>
	);
};

export { ProducerDetail };
