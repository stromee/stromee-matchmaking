import { useEffect, useState } from 'react';

import { H3, Paragraph, Slider, View, YStack } from 'tamagui';
import * as z from 'zod';

import { HeaderOnboarding } from '@components/header-onboarding';
import OnePerson from '@components/icons/1_person.svg?react';
import TwoPerson from '@components/icons/2_person.svg?react';
import ThreePerson from '@components/icons/3_person.svg?react';
import FourPerson from '@components/icons/4_person.svg?react';
import FivePerson from '@components/icons/5_person.svg?react';
import Location from '@components/icons/location.svg?react';
import { BodyText } from '@components/themed/body-text';
import { Button } from '@components/themed/button';

import { configStore } from '@utils/config-store';
import { DEFAULT_CONSUMPTION } from '@utils/constants';
import { conumptionSyncSchema } from '@utils/schema';

import { OnboardingCarouselProps } from '../constants';

type ConsumptionTypeProps = OnboardingCarouselProps;

const consumptions = [
	{ value: 4000, icon: <FourPerson /> },
	{ value: 5000, icon: <FivePerson /> },
	{ value: 2000, icon: <TwoPerson /> },
	{ value: 3000, icon: <ThreePerson /> },
	{ value: 1000, icon: <OnePerson /> },
];

const Consumption = ({
	onNext: handleNext,
	onPrev: handlePrev,
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
			conumptionSyncSchema.parse(consumption);
			setError('');
			setConsumptionToStore(consumption);
			handleNext();
		} catch (error) {
			if (error instanceof z.ZodError) {
				console.log(error);
				setError(error.issues[0].message);
			} else {
				setError('Upps. ein unbekannter Fehler ist aufgetreten');
			}
		}
	};

	useEffect(() => {
		setError('');
	}, [consumption]);

	return (
		<YStack flex={1} px="$4" pb="$8" gap="$4" jc="space-between">
			<HeaderOnboarding onPrev={handlePrev}>
				Wie viel Energie brauhst du?
			</HeaderOnboarding>
			<View width="$full" flexDirection="column" gap="$4">
				<View
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					alignSelf="center"
				>
					<BodyText>Dein Verbrauch:</BodyText>
					<H3> {consumption}kWh</H3>
				</View>
				{error !== '' && (
					<Paragraph color="$baseLollipopRed">{error}</Paragraph>
				)}
				<Slider
					value={[consumption]}
					onValueChange={(v) => setConsumption(v[0])}
					step={10}
					min={10}
					max={10000}
					height="$6"
					px="$6"
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
			</View>
			<BodyText pl="$6" pr="$5" textAlign="left">
				Alternative kannst du uns auch einfach sagen, wie viele Personen
				in deinem Haushalt leben.
			</BodyText>

			<View
				flexDirection="row"
				flexWrap="wrap-reverse"
				gap="$4"
				alignContent="center"
				justifyContent="center"
			>
				{consumptions.map(({ value, icon }) => (
					<Button
						key={value}
						width={144}
						height={102}
						theme={'base'}
						borderRadius={10}
						borderWidth={2}
						
						borderColor={
							consumption === value
								? '$baseStromeeGreen'
								: '$baseStromeeNavyOpacity20'
						}
						hoverStyle={{
							borderColor:consumption === value
							? '$baseStromeeGreen'
							: '$baseStromeeNavy'
						}}
						focusStyle={{
							borderColor:consumption === value
							? '$baseStromeeGreen'
							: '$baseStromeeNavy',
							outlineColor: consumption === value
							? '$baseStromeeGreen'
							: '$baseStromeeNavy'
						}}
						onPress={() => {
							setConsumption(value);
						}}
					>
						{icon}
					</Button>
				))}
			</View>

			<Button onPress={onNext}>Weiter</Button>
		</YStack>
	);
};

export { Consumption };
