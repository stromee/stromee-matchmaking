import { useEffect, useState } from 'react';

import { Paragraph, RadioGroup, Spinner, View, YStack } from 'tamagui';
import * as z from 'zod';

import { HeaderOnboarding } from '@components/header-onboarding';
import Biogas from '@components/icons/biogas.svg?react';
import Solar from '@components/icons/solar.svg?react';
import Wind from '@components/icons/wind.svg?react';
import { BodyText } from '@components/themed/body-text';
import { Button } from '@components/themed/button';

import { configStore } from '@utils/config-store';
import { PLANT_TYPE_WITHOUT_DEFAULT } from '@utils/constants';
import { energyTypesSyncSchema } from '@utils/schema';

import { OnboardingCarouselProps } from '../constants';

type EnergyTypeProps = OnboardingCarouselProps;

const plantTypes = Object.values(PLANT_TYPE_WITHOUT_DEFAULT.Values);

const plantTypesProps = [
	{
		description:
			'Ich bin eher der stürmische Typ - zu mir passt Windkraft!',
		icon: <Wind />,
	},
	{
		description: 'Ich mag es heiß - Sonnenenergie ist mein Ding!',
		icon: <Solar />,
	},
	{
		description:
			'Für mich muss es knistern und brodeln - daher libe ich Biogas!',
		icon: <Biogas />,
	},
];

const combinedPlantTypes = plantTypes.map((type, index) => ({
	type,
	...plantTypesProps[index],
}));

const EnergyType = ({
	onNext: handleNext,
	onPrev: handlePrev,
}: EnergyTypeProps) => {
	const energyTypesFromStore = configStore.use.energyTypes();
	const setEnergyTypesToStore = configStore.use.setEnergyTypes();

	const [isValidating, setIsValidating] = useState(false);
	const [energyTypes, setEnergyTypes] = useState(energyTypesFromStore);

	const [error, setError] = useState('');
	useEffect(() => {
		// sync store with local state
		setEnergyTypes(energyTypesFromStore);
	}, [energyTypesFromStore]);

	const onNext = () => {
		try {
			energyTypesSyncSchema.parse(energyTypes);
			setIsValidating(true);
			setError('');
			setEnergyTypesToStore(energyTypes);
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
	}, [energyTypes]);

	return (
		<YStack flex={1} px="$4" pb="$8" gap="$4" jc="space-between">
			<View flexDirection="column" gap="$8">
				<HeaderOnboarding onPrev={handlePrev}>
					Was sind deine Vorlieben?
				</HeaderOnboarding>

				<BodyText px="$3" textAlign="left">
					Natürlich ist jede Energieart schön! Dennoch hat jeder
					persönliche Präferenzen. Welche Energieart ist dir die
					Libste?
				</BodyText>
			</View>

			{error !== '' && (
				<Paragraph color="$baseLollipopRed">{error}</Paragraph>
			)}
			<RadioGroup
				gap="$4"
				alignSelf="center"
				value={energyTypes[0]}
				onValueChange={(newEnergyType) => {
					setEnergyTypes([
						newEnergyType as PLANT_TYPE_WITHOUT_DEFAULT,
					]);
				}}
			>
				{combinedPlantTypes.map((plantTypeItem) => {
					const { type, description, icon } = plantTypeItem;

					return (
						<RadioGroup.Item
							key={type}
							value={type}
							size={undefined}
							width={272}
							height={124}
							p="$8"
							borderRadius="$4"
							borderColor={
								energyTypes.includes(type)
									? '$baseStromeeGreen'
									: '$baseStromeeNavyOpacity20'
							}
							hoverStyle={{
								borderColor: energyTypes.includes(type)
									? '$baseStromeeGreen'
									: '$baseStromeeNavy',
							}}
							focusStyle={{
								borderColor: energyTypes.includes(type)
									? '$baseStromeeGreen'
									: '$baseStromeeNavy',
								outlineColor: energyTypes.includes(type)
									? '$baseStromeeGreen'
									: '$baseStromeeNavy',
							}}
						>
							<View
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
								p="$4"
								width="$full"
							>
								{icon}
								<BodyText>{description}</BodyText>
							</View>
						</RadioGroup.Item>
					);
				})}
			</RadioGroup>

			{isValidating && <Spinner size="large" color="$baseStromeeNavy" />}
			<Button onPress={onNext}>Weiter</Button>
		</YStack>
	);
};

export { EnergyType };
