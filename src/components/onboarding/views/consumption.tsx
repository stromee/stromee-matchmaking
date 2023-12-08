import { useEffect, useState } from 'react';

import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { H2, Paragraph, ScrollView, Slider, View, YStack } from 'tamagui';
import * as z from 'zod';

import { color } from '@theme/tokens';

import { Dots } from '@components/dots';
import { Header } from '@components/header';
import OnePerson from '@components/icons/person-1.svg?react';
import TwoPerson from '@components/icons/person-2.svg?react';
import ThreePerson from '@components/icons/person-3.svg?react';
import FourPerson from '@components/icons/person-4.svg?react';
import FivePerson from '@components/icons/person-5.svg?react';
import { BodyText } from '@components/themed/body-text';
import { Button } from '@components/themed/button';

import { configStore } from '@utils/config-store';
import { DEFAULT_CONSUMPTION } from '@utils/constants';
import { formatUnit } from '@utils/format';
import { consumptionSyncSchema } from '@utils/schema';

import { OnboardingCarouselProps } from '../constants';

type ConsumptionTypeProps = OnboardingCarouselProps;

const consumptions = [
	{ value: 1000, Icon: OnePerson, label: '1 Person' },
	{ value: 2000, Icon: TwoPerson, label: '2 Personen' },
	{ value: 3000, Icon: ThreePerson, label: '3 Personen' },
	{ value: 4000, Icon: FourPerson, label: '4 Personen' },
	{ value: 5000, Icon: FivePerson, label: '5 Personen' },
];

const Consumption = ({
	onNext: handleNext,
	onPrev: handlePrev,
	count,
	index,
}: ConsumptionTypeProps) => {
	const consumptionFromStore = configStore.use.consumption();
	const setConsumptionToStore = configStore.use.setConsumption();

	const [consumption, setConsumption] = useState(
		consumptionFromStore === -1
			? DEFAULT_CONSUMPTION
			: consumptionFromStore,
	);
	const [error, setError] = useState('');

	useEffect(() => {
		// sync store with local state
		setConsumption(
			consumptionFromStore === -1
				? DEFAULT_CONSUMPTION
				: consumptionFromStore,
		);
	}, [consumptionFromStore]);

	const onNext = () => {
		try {
			consumptionSyncSchema.parse(consumption);
			setError('');
			setConsumptionToStore(consumption);
			handleNext();
		} catch (error) {
			if (__DEV__) {
				console.log(error);
			}
			if (error instanceof z.ZodError) {
				setError(error.issues[0].message);
			} else {
				setError('Upps. ein unbekannter Fehler ist aufgetreten');
			}
		}
	};

	useEffect(() => {
		setError('');
	}, [consumption]);

	const tainted =
		consumption !== consumptionFromStore &&
		!(consumptionFromStore === -1 && consumption === DEFAULT_CONSUMPTION);

	return (
		<ScrollView
			flex={1}
			minHeight="$full"
			contentContainerStyle={{ flex: 1, minHeight: '100%' }}
		>
			<YStack flex={1} px="$4" pb="$8" gap="$4">
				<YStack width="$full" flexDirection="column" gap="$4">
					<Header customNavigation={handlePrev} tainted={tainted}>
						Wie viel Energie brauchst du?
					</Header>

					<YStack
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						alignSelf="center"
						gap="$1"
					>
						<BodyText>Dein Verbrauch:</BodyText>
						<H2 size="$8">{formatUnit(consumption, 'kWh')}</H2>
					</YStack>

					<Slider
						value={[consumption]}
						onValueChange={(v) => setConsumption(v[0])}
						step={10}
						min={10}
						max={10000}
						height="$6"
						px="$4"
						width="$full"
					>
						<Slider.Track bg="$baseStromeeGreen" height="$1" />
						<Slider.Thumb
							index={0}
							circular
							size="$6"
							width="$6"
							height="$6"
							bg="$baseCloudWhite"
							borderColor="$baseStromeeGreen"
							shadowColor="$baseCloudWhiteOpacity80"
							shadowRadius={4}
							hoverStyle={{
								borderColor: '$baseStromeeNavy',
								bg: '$baseCloudWhite',
							}}
							focusStyle={{
								borderColor: '$baseStromeeGreen',
								bg: '$baseCloudWhite',
							}}
						/>
					</Slider>

					<Paragraph px="$4">
						Stell deinen Strom-Jahresverbrauch über den
						Schieberegler ein oder sag uns wie viele Personen in
						deinem Haushalt leben.
					</Paragraph>
					{error !== '' && (
						<Paragraph px="$4" color="$baseLollipopRed">
							{error}
						</Paragraph>
					)}
				</YStack>

				<YStack
					gap="$4"
					ai="center"
					jc="center"
					flex={1}
					minHeight="224px"
				>
					<View gap="$4" className="consumption-grid">
						{consumptions.map(({ value, Icon, label }) => (
							<Button
								key={value}
								theme="base"
								color="$color"
								borderRadius={10}
								borderWidth="$0.5"
								width="$full"
								height="$full"
								px="$2"
								py="$1"
								minHeight="$16"
								maxHeight="$32"
								borderColor={
									consumption === value
										? '$baseStromeeGreen'
										: '$baseStromeeNavyOpacity20'
								}
								hoverStyle={{
									borderColor:
										consumption === value
											? '$baseStromeeGreen'
											: '$baseStromeeNavy',
								}}
								focusStyle={{
									borderColor:
										consumption === value
											? '$baseStromeeGreen'
											: '$baseStromeeNavy',
									outlineColor:
										consumption === value
											? '$baseStromeeGreen'
											: '$baseStromeeNavy',
								}}
								onPress={() => {
									setConsumption(value);
								}}
								className="consumption-grid-item"
							>
								<AccessibleIcon label={label}>
									<Icon
										style={{
											width: '100%',
											height: '100%',
											maxWidth: '56px',
											maxHeight: '56px',
										}}
										color={color.baseStromeeNavy}
									/>
								</AccessibleIcon>
							</Button>
						))}
					</View>
				</YStack>

				<YStack gap="$2">
					<Dots count={count} activeIndex={index} />
					<Button onPress={onNext}>Weiter</Button>
				</YStack>
			</YStack>
		</ScrollView>
	);
};

export { Consumption };
