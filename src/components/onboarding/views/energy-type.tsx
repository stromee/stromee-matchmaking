import { useEffect, useState } from 'react';

import { Paragraph, RadioGroup, ScrollView, Spinner, YStack } from 'tamagui';
import * as z from 'zod';

import { Header } from '@components/header';
import Biogas from '@components/icons/biomass-filled.svg?react';
import Solar from '@components/icons/solar-filled.svg?react';
import Wind from '@components/icons/wind-filled.svg?react';
import { Button } from '@components/themed/button';

import { configStore } from '@utils/config-store';
import { PLANT_TYPE_WITHOUT_DEFAULT } from '@utils/constants';
import { energyTypeSyncSchema } from '@utils/schema';

import { OnboardingCarouselProps } from '../constants';

type EnergyTypeProps = OnboardingCarouselProps;

const plantTypes = [
	{
		type: PLANT_TYPE_WITHOUT_DEFAULT.Values.wind,
		description:
			'Ich bin eher der stürmische Typ - zu mir passt Windkraft!',
		icon: <Wind />,
	},
	{
		type: PLANT_TYPE_WITHOUT_DEFAULT.Values.solar,
		description: 'Ich mag es heiß - Sonnenenergie ist mein Ding!',
		icon: <Solar />,
	},
	{
		type: PLANT_TYPE_WITHOUT_DEFAULT.Values.biomass,
		description:
			'Für mich muss es knistern und brodeln - daher liebe ich Biogas!',
		icon: <Biogas />,
	},
];

const EnergyType = ({
	onNext: handleNext,
	onPrev: handlePrev,
}: EnergyTypeProps) => {
	const energyTypeFromStore = configStore.use.energyType();
	const setEnergyTypeToStore = configStore.use.setEnergyType();

	const [isValidating, setIsValidating] = useState(false);
	const [energyType, setEnergyType] = useState(energyTypeFromStore);

	const [error, setError] = useState('');
	useEffect(() => {
		// sync store with local state
		setEnergyType(energyTypeFromStore);
	}, [energyTypeFromStore]);

	const onNext = () => {
		try {
			energyTypeSyncSchema.parse(energyType);
			setIsValidating(true);
			setError('');
			setEnergyTypeToStore(energyType);
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
	}, [energyType]);

	const tainted = energyType !== energyTypeFromStore;

	return (
		<ScrollView
			flex={1}
			minHeight="$full"
			contentContainerStyle={{ flex: 1, minHeight: '100%' }}
		>
			<YStack flex={1} px="$4" pb="$8" gap="$4" jc="space-between">
				<YStack gap="$4">
					<Header customNavigation={handlePrev} tainted={tainted}>
						Was sind deine Vorlieben?
					</Header>

					<Paragraph px="$4" textAlign="left">
						Natürlich ist jede Energieart schön! Dennoch hat jeder
						persönliche Präferenzen. Welche Energieart ist dir die
						Liebste?
					</Paragraph>
				</YStack>

				<YStack gap="$4">
					{error !== '' && (
						<Paragraph px="$4" color="$baseLollipopRed">
							{error}
						</Paragraph>
					)}
					<RadioGroup
						gap="$4"
						alignSelf="center"
						value={energyType}
						onValueChange={(newEnergyType) => {
							setEnergyType(
								newEnergyType as PLANT_TYPE_WITHOUT_DEFAULT,
							);
						}}
					>
						{plantTypes.map((plantTypeItem) => {
							const { type, description, icon } = plantTypeItem;
							return (
								<RadioGroup.Item
									key={type}
									value={type}
									size={undefined}
									height="initial"
									width="$full"
									maxWidth={272}
									minHeight={124}
									p="$4"
									borderWidth="$0.5"
									borderRadius="$4"
									borderColor={
										energyType === type
											? '$baseStromeeGreen'
											: '$baseStromeeNavyOpacity20'
									}
									hoverStyle={{
										borderColor:
											energyType === type
												? '$baseStromeeGreen'
												: '$baseStromeeNavy',
									}}
									focusStyle={{
										borderColor:
											energyType === type
												? '$baseStromeeGreen'
												: '$baseStromeeNavy',
										outlineColor:
											energyType === type
												? '$baseStromeeGreen'
												: '$baseStromeeNavy',
									}}
								>
									<YStack
										alignItems="center"
										justifyContent="center"
										width="$full"
										gap="$2"
									>
										{icon}
										<Paragraph>{description}</Paragraph>
									</YStack>
								</RadioGroup.Item>
							);
						})}
					</RadioGroup>

					{isValidating && (
						<Spinner size="large" color="$baseStromeeNavy" />
					)}
				</YStack>
				<Button onPress={onNext}>Weiter</Button>
			</YStack>
		</ScrollView>
	);
};

export { EnergyType };
