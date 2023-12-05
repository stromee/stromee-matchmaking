import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
	Paragraph,
	RadioGroup,
	ScrollView,
	Spinner,
	View,
	XStack,
	YStack,
} from 'tamagui';
import * as z from 'zod';

import { fonts } from '@theme/fonts';

import { Header } from '@components/header';
import Biogas from '@components/icons/biomass.svg?react';
import Bolt from '@components/icons/bolt.svg?react';
import Divider from '@components/icons/divider.svg?react';
import Location from '@components/icons/location.svg?react';
import Solar from '@components/icons/solar.svg?react';
import Wind from '@components/icons/wind.svg?react';
import { BodyText } from '@components/themed/body-text';
import { Button } from '@components/themed/button';
import { Input } from '@components/themed/input';

import { useCitiesQuery } from '@hooks/use-cities-query';

import { configStore } from '@utils/config-store';
import {
	DEFAULT_CONSUMPTION,
	PLANT_TYPE_WITHOUT_DEFAULT,
} from '@utils/constants';
import {
	cityIdSyncSchema,
	cityNameSyncSchema,
	conumptionSyncSchema,
	energyTypesSyncSchema,
	postalCodeAsyncSchema,
	postalCodeSyncSchema,
} from '@utils/schema';

const plantTypes = [
	{
		type: PLANT_TYPE_WITHOUT_DEFAULT.Values.wind,
		label: 'Wind',
		icon: <Wind />,
		theme: 'stromeeNavy',
	},
	{
		type: PLANT_TYPE_WITHOUT_DEFAULT.Values.solar,
		label: 'Solar',
		icon: <Solar />,
		theme: 'summerYellow',
	},
	{
		type: PLANT_TYPE_WITHOUT_DEFAULT.Values.biomass,
		label: 'Biomasse',
		icon: <Biogas />,
		background: '$basePunchGreen',
		theme: 'punchGreen',
	},
] as const;

const validateInput = async ({
	postalCode,
	cityId,
	cityName,
}: {
	postalCode: string;
	cityId: number;
	cityName: string;
}) => {
	postalCodeSyncSchema.parse(postalCode);
	await postalCodeAsyncSchema.parseAsync(postalCode);

	cityIdSyncSchema.parse(cityId);
	cityNameSyncSchema.parse(cityName);
	const cityIdPromise = cityIdSyncSchema.parseAsync(cityId);
	const cityNamePromise = cityNameSyncSchema.parseAsync(cityName);

	const [cityIdResult, cityNameResult] = await Promise.allSettled([
		cityIdPromise,
		cityNamePromise,
	]);

	if (cityIdResult.status === 'rejected') {
		throw cityIdResult.reason;
	}
	if (cityNameResult.status === 'rejected') {
		throw cityNameResult.reason;
	}
};

const Profile = () => {
	const navigate = useNavigate();

	// address ---------------------------------------------
	const [isAddressValidating, setIsAddressValidating] = useState(false);
	const [addressError, setAddressError] = useState('');
	const postalCodeFromStore = configStore.use.postalCode();
	const cityNameFromStore = configStore.use.cityName();
	const cityIdFromStore = configStore.use.cityId();
	const setAddressToStore = configStore.use.setAddress();

	const [postalCode, setPostalCode] = useState(postalCodeFromStore);
	const [cityName, setCityName] = useState(cityNameFromStore);
	const [cityId, setCityId] = useState(cityIdFromStore);

	const { data: cities, isLoading } = useCitiesQuery(postalCode);

	useEffect(() => {
		setPostalCode(postalCodeFromStore);
	}, [postalCodeFromStore]);

	useEffect(() => {
		setCityName(cityNameFromStore);
	}, [cityNameFromStore]);

	useEffect(() => {
		setCityId(cityIdFromStore);
	}, [cityIdFromStore]);

	useEffect(() => {
		if (cities && cities.length === 1) {
			setCityName(cities[0].name);
			setCityId(cities[0].id);
		} else if (cities) {
			if (!cities.some((city) => city.id === cityId)) {
				setCityId(-1);
			}
			if (!cities.some((city) => city.name === cityName)) {
				setCityName('');
			}
		} else {
			setCityName('');
			setCityId(-1);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cities]);

	useEffect(() => {
		setAddressError('');
	}, [postalCode, cityId, cityName]);

	// consumption ---------------------------------------------
	const [isConsumptionValidating, setIsConsumptionValidating] =
		useState(false);
	const [consumptionError, setConsumptionError] = useState('');

	const consumptionFromStore = configStore.use.consumption();
	const setConsumptionToStore = configStore.use.setConsumption();

	const [consumption, setConsumption] = useState(
		consumptionFromStore === -1
			? DEFAULT_CONSUMPTION.toString()
			: consumptionFromStore.toString(),
	);

	useEffect(() => {
		// sync store with local state
		setConsumption(
			consumptionFromStore === -1
				? DEFAULT_CONSUMPTION.toString()
				: consumptionFromStore.toString(),
		);
	}, [consumptionFromStore]);

	useEffect(() => {
		setConsumptionError('');
	}, [consumption]);

	// energy types ---------------------------------------------
	const [isEnergyTypesValidating, setIsEnergyTypesValidating] =
		useState(false);
	const [energyTypesError, setEnergyTypesError] = useState('');

	const energyTypesFromStore = configStore.use.energyTypes();
	const setEnergyTypesToStore = configStore.use.setEnergyTypes();

	const [energyTypes, setEnergyTypes] = useState(energyTypesFromStore);

	useEffect(() => {
		setEnergyTypes(energyTypesFromStore);
	}, [energyTypesFromStore]);

	useEffect(() => {
		setEnergyTypesError('');
	}, [energyTypes]);

	// submit ---------------------------------------------
	const save = async () => {
		setAddressError('');
		setIsAddressValidating(true);
		setConsumption('');
		setIsConsumptionValidating(true);
		setEnergyTypesError('');
		setIsEnergyTypesValidating(true);

		const addressHasError = await validateInput({
			postalCode,
			cityId,
			cityName,
		})
			.then(() => {
				setAddressToStore({ postalCode, cityId, cityName }, true);
				return false;
			})
			.catch((error) => {
				if (error instanceof z.ZodError) {
					setAddressError(error.issues[0].message);
				} else {
					setAddressError(
						'Upps. ein unbekannter Fehler ist aufgetreten',
					);
				}
				return true;
			})
			.finally(() => {
				setIsAddressValidating(false);
			});

		let consumptionHasError = false;
		try {
			const parsed = isNaN(parseInt(consumption))
				? -1
				: parseInt(consumption);
			conumptionSyncSchema.parse(parsed);
			setConsumptionToStore(parsed);
		} catch (error) {
			if (error instanceof z.ZodError) {
				console.log(error);
				setConsumptionError(error.issues[0].message);
			} else {
				setConsumptionError(
					'Upps. ein unbekannter Fehler ist aufgetreten',
				);
			}
			consumptionHasError = true;
		}
		setIsConsumptionValidating(false);

		let energyTypesHasError = false;
		try {
			energyTypesSyncSchema.parse(energyTypes);
			setEnergyTypesError('');
			setEnergyTypesToStore(energyTypes, false);
		} catch (error) {
			if (error instanceof z.ZodError) {
				console.log(error);
				setEnergyTypesError(error.issues[0].message);
			} else {
				setEnergyTypesError(
					'Upps. ein unbekannter Fehler ist aufgetreten',
				);
			}
			energyTypesHasError = true;
		}
		setIsEnergyTypesValidating(false);

		if (!addressHasError && !energyTypesHasError && !consumptionHasError) {
			navigate('/matches');
		}
	};
	// };

	const showAddressSpinner = isLoading || isAddressValidating;

	const isValidating =
		isAddressValidating ||
		isConsumptionValidating ||
		isEnergyTypesValidating;
	return (
		<ScrollView flex={1} height="$full" contentContainerStyle={{ flex: 1 }}>
			<Header defaultTo="/matches" canGoBack>
				Profil
			</Header>

			<YStack px="$4" py="$8" gap="$12" flex={1}>
				<YStack gap="$2">
					<Paragraph fontWeight="bold">Dein Wohnort</Paragraph>
					{addressError !== '' && (
						<Paragraph color="$baseLollipopRed">
							{addressError}
						</Paragraph>
					)}
					<View
						flexDirection="row"
						alignItems="center"
						pos="relative"
					>
						<View
							pointerEvents="none"
							position="absolute"
							alignItems="center"
							gap="$2"
							pl="$2"
						>
							<Location />
							<Divider />
						</View>

						<Input
							disabled={showAddressSpinner}
							pl="$12"
							pr={showAddressSpinner ? '$9' : '$2'}
							width="$full"
							height="$full"
							value={postalCode}
							placeholder="Postleitzahl"
							onChangeText={setPostalCode}
						/>

						{showAddressSpinner && (
							<View
								pointerEvents="none"
								position="absolute"
								gap="$2"
								right="$0"
								pr="$2"
							>
								<Spinner color="$baseStromeeNavy" />
							</View>
						)}
					</View>

					<View
						flexDirection="row"
						alignItems="center"
						pos="relative"
					>
						<BodyText
							asChild
							width="$full"
							theme="secondary"
							py="$2"
							px="$2"
							pr={showAddressSpinner ? '$9' : '$2'}
							minHeight="$11"
							borderRadius="$full"
							borderWidth="1px"
							borderStyle="solid"
							borderColor="$baseCloudWhite"
							backgroundColor="$baseCloudWhite"
							shadowColor="$baseStromeeNavyOpacity20"
							shadowRadius={8}
							shadowOffset={{
								width: 0,
								height: 0,
							}}
							hoverStyle={{
								borderColor: '$baseGrey400',
							}}
							focusStyle={{
								borderColor: '$baseGrey400',
								outlineColor: '$baseGrey400',
								outlineStyle: 'solid',
								outlineWidth: 2,
							}}
							fontFamily="$input"
							lineHeight="$1"
							display="flex"
						>
							<select
								value={cityId}
								disabled={
									cities === undefined ||
									cities.length === 0 ||
									cities.length === 1 ||
									showAddressSpinner
								}
								onChange={(e) => {
									if (cities) {
										const id = parseInt(e.target.value);
										setCityId(id);
										const name = cities.find(
											(city) => city.id === id,
										)?.name;
										setCityName(name || '');
									}
								}}
								style={{
									fontFamily: fonts.input.family as string,
									fontSize: fonts.input.size['3'] as number,
									fontWeight: fonts.input.weight?.['3'] as
										| number
										| undefined,
								}}
							>
								<option disabled value={-1}>
									Stadt
								</option>
								{cities &&
									cities.map((city) => (
										<option key={city.id} value={city.id}>
											{city.name}
										</option>
									))}
							</select>
						</BodyText>
						{showAddressSpinner && (
							<View
								pointerEvents="none"
								position="absolute"
								gap="$2"
								right="$0"
								pr="$2"
							>
								<Spinner color="$baseStromeeNavy" />
							</View>
						)}
					</View>
				</YStack>

				<YStack gap="$2">
					<Paragraph fontWeight="bold">
						Dein Verbrauch (kWh)
					</Paragraph>
					{consumptionError !== '' && (
						<Paragraph color="$baseLollipopRed">
							{consumptionError}
						</Paragraph>
					)}
					<View
						flexDirection="row"
						alignItems="center"
						pos="relative"
					>
						<View
							pointerEvents="none"
							position="absolute"
							alignItems="center"
							gap="$2"
							pl="$2"
						>
							<Bolt />
							<Divider />
						</View>
						<Input
							disabled={isConsumptionValidating}
							pl="$12"
							pr="$9"
							width="$full"
							height="$full"
							keyboardType="numeric"
							value={consumption}
							placeholder="Verbrauch"
							onChangeText={(value) => {
								setConsumption(value.replace(/[^0-9]/g, ''));
							}}
						/>
					</View>
				</YStack>

				<YStack gap="$2">
					<Paragraph fontWeight="bold">
						Deine liebste Energieart
					</Paragraph>
					{energyTypesError !== '' && (
						<Paragraph color="$baseLollipopRed">
							{energyTypesError}
						</Paragraph>
					)}
					<RadioGroup
						gap="$4"
						width="$full"
						value={energyTypes[0]}
						onValueChange={(newEnergyType) => {
							setEnergyTypes([
								newEnergyType as PLANT_TYPE_WITHOUT_DEFAULT,
							]);
						}}
					>
						{plantTypes.map((plantTypeItem) => {
							const { type, label, icon, theme } = plantTypeItem;
							return (
								<RadioGroup.Item
									disabled={isValidating}
									theme={
										energyTypes.includes(type)
											? theme
											: 'secondary'
									}
									p="$2"
									key={type}
									value={type}
									size={undefined}
									height="initial"
									width="$full"
									borderRadius="$full"
									borderWidth="1px"
									borderColor="$baseStromeeNavy"
									backgroundColor="$background"
									// @ts-expect-error - this value works but throws a typescript error
									color="$color"
									hoverStyle={{
										borderColor: '$baseStromeeNavy',
										backgroundColor: '$background',
									}}
									focusStyle={{
										borderColor: '$baseStromeeNavy',
										outlineColor: '$baseStromeeNavy',
										backgroundColor: '$background',
									}}
								>
									<XStack
										alignItems="center"
										justifyContent="flex-start"
										width="$full"
										gap="$2"
									>
										{icon}
										<Paragraph>{label}</Paragraph>
									</XStack>
								</RadioGroup.Item>
							);
						})}
					</RadioGroup>
				</YStack>

				<Button mt="auto" disabled={isValidating} onPress={save}>
					Weiter
				</Button>
			</YStack>
		</ScrollView>
	);
};

export { Profile as Component };
