import { useCallback, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import {
	Avatar,
	Paragraph,
	ScrollView,
	Spinner,
	View,
	XStack,
	YStack,
} from 'tamagui';

import { Divider } from '@components/divider';
import { Header } from '@components/header';
import { BodyText } from '@components/themed/body-text';
import { Button } from '@components/themed/button';
import { Link } from '@components/themed/link';

import { useDefinedParam } from '@hooks/use-defined-param';
import { useFunnelHref } from '@hooks/use-funnel-href';
import { usePrice } from '@hooks/use-price';
import { useProducer } from '@hooks/use-producer';

import { configStore } from '@utils/config-store';
import { formatNumber, formatUnit } from '@utils/format';
import { assertUnreachable, handleStoryblokImage } from '@utils/misc';
import { priceWithDelta } from '@utils/prices';
import { producerStore } from '@utils/producer-store';

const Match = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const producerId = useDefinedParam('producerId');
	const parsedProducerId = parseInt(producerId);
	const swipedRight = producerStore.use.swipedRight();

	const consumption = configStore.use.consumption();

	const funnelHref = useFunnelHref(parsedProducerId);

	const producer = useProducer(parsedProducerId);

	const price = usePrice();

	// TODO: animate the messages if the intial price is loading
	// const initialPriceState = useRef(price.status);

	useEffect(() => {
		const isMatch = swipedRight.some((id) => id === producerId);
		if (!isMatch) {
			navigate('/', {
				replace: true,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [swipedRight, producerId]);

	const handleDynamicContent = useCallback(() => {
		switch (price.status) {
			case 'pending':
				return (
					<View minHeight={240} ai="center" jc="center">
						<Spinner size="large" color="$baseStromeeNavy" />
					</View>
				);
			case 'error':
				return (
					<View minHeight={240} ai="center">
						<Paragraph>Error</Paragraph>
					</View>
				);
			case 'success':
				{
					const mergedPrice = priceWithDelta(
						price.data,
						producer.data ? producer.data.deltaPrice : 0,
					);

					return (
						<YStack gap="$2">
							<Divider />
							<Paragraph
								gap="$2"
								display="flex"
								justifyContent="space-between"
								flexWrap="wrap"
							>
								<BodyText fontWeight="bold">Verbrauch</BodyText>
								<BodyText>
									{formatUnit(
										formatNumber(consumption),
										'kWh/Jahr',
									)}
								</BodyText>
							</Paragraph>
							<Divider />
							<Paragraph fontWeight="bold">Kosten</Paragraph>
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
											mergedPrice.priceData.deposit
												.brutto,
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
													.workingPriceBrutto * 100,
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
							<Divider />
							<Paragraph
								gap="$2"
								display="flex"
								justifyContent="space-between"
								flexWrap="wrap"
							>
								<BodyText fontWeight="bold">
									Preisgarantie
								</BodyText>
								<BodyText>
									{formatUnit(
										mergedPrice.priceData.fixedPriceMonths,
										mergedPrice.priceData
											.fixedPriceMonths === 1
											? 'Monat'
											: 'Monate',
									)}
								</BodyText>
							</Paragraph>
						</YStack>
					);
				}

				break;

			default:
				return assertUnreachable(price);
		}
	}, [price, consumption, producer]);

	if (!producer.data) {
		return null;
	}

	return (
		<ScrollView flex={1} height="$full" contentContainerStyle={{ flex: 1 }}>
			<Header defaultTo="/matches" canGoBack>
				{producer.data.name}
			</Header>

			<YStack px="$4" py="$8" gap="$4" flex={1}>
				<Link
					alignSelf="flex-start"
					to={`/matches/${producerId}/detail`}
					borderRadius="$full"
					ai="center"
					jc="center"
					focusStyle={{
						outlineStyle: 'solid',
						outlineWidth: 2,
						outlineColor: '$baseStromeeNavy',
					}}
				>
					<Avatar circular size="$11" height="$11">
						<Avatar.Image
							accessibilityLabel={producer.data.name}
							src={handleStoryblokImage(producer.data.picture)}
						/>
						<Avatar.Fallback backgroundColor="$baseStromeeNavy" />
					</Avatar>
				</Link>
				<YStack
					p="$2"
					borderColor="$baseStromeeGreen"
					borderWidth="$0.5"
					borderTopLeftRadius="$2"
					borderTopRightRadius="$6"
					borderBottomLeftRadius="$6"
					borderBottomRightRadius="$6"
					gap="$2"
				>
					<Paragraph>
						Hi, wie schön, dass du mit uns eine Strombeziehung
						eingehen möchtest!
					</Paragraph>
				</YStack>
				<YStack
					p="$2"
					borderColor="$baseStromeeGreen"
					borderWidth="$0.5"
					borderTopLeftRadius="$2"
					borderTopRightRadius="$6"
					borderBottomLeftRadius="$6"
					borderBottomRightRadius="$6"
					gap="$2"
				>
					<Paragraph mt="$2">
						Hier noch ein kurzer Überblick:
					</Paragraph>

					{handleDynamicContent()}
				</YStack>
				<YStack
					p="$2"
					borderColor="$baseStromeeGreen"
					borderWidth="$0.5"
					borderTopLeftRadius="$2"
					borderTopRightRadius="$6"
					borderBottomLeftRadius="$6"
					borderBottomRightRadius="$6"
					gap="$2"
				>
					<Paragraph>
						Willst du einen Vertrag mit uns abschließen? Wir freuen
						uns auf eine tolle gemeinsame Zeit! 💚
					</Paragraph>
				</YStack>
				<XStack mt="auto" gap="$4" flexWrap="wrap">
					<Link
						to={funnelHref}
						target="_blank"
						theme="stromeeGreen"
						height="$11"
						bg="$background"
						display="flex"
						borderRadius="$full"
						borderWidth="1px"
						borderColor="$transparent"
						px="$4"
						py="$2"
						ai="center"
						jc="center"
						flex={1}
						flexBasis={0}
						flexGrow={1}
						flexShrink={0}
						minWidth="$0"
						hoverStyle={{
							borderColor: '$baseStromeeNavy',
						}}
						focusStyle={{
							outlineStyle: 'solid',
							outlineWidth: 2,
							outlineColor: '$baseStromeeNavy',
						}}
					>
						Ja
					</Link>
					<Button
						theme="base"
						borderColor="$baseStromeeNavy"
						flex={1}
						flexBasis={0}
						flexGrow={1}
						flexShrink={0}
						onPress={() => {
							if (location.key !== 'default') {
								navigate(-1);
							} else {
								navigate('/matches');
							}
						}}
					>
						Nein
					</Button>
				</XStack>
			</YStack>
		</ScrollView>
	);
};

export { Match as Component };
