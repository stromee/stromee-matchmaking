import { useEffect, useState } from 'react';

import { Image, Paragraph, ScrollView, Spinner, View, YStack } from 'tamagui';
import * as z from 'zod';

import { color } from '@theme/tokens';

import { Dots } from '@components/dots';
import { Header } from '@components/header';
import ArrowDropDown from '@components/icons/arrow-drop-down.svg?react';
import Divider from '@components/icons/divider.svg?react';
import Location from '@components/icons/location.svg?react';
import { Button } from '@components/themed/button';
import { Input } from '@components/themed/input';

import { useCitiesQuery } from '@hooks/use-cities-query';

import { configStore } from '@utils/config-store';
import { createRelativeUrl } from '@utils/misc';
import {
	cityIdSyncSchema,
	cityNameSyncSchema,
	postalCodeAsyncSchema,
	postalCodeSyncSchema,
} from '@utils/schema';

import { OnboardingCarouselProps } from '../constants';

type PostalCodeTypeProps = OnboardingCarouselProps;

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

const Address = ({
	onNext: handleNext,
	onPrev: handlePrev,
	count,
	index,
}: PostalCodeTypeProps) => {
	const postalCodeFromStore = configStore.use.postalCode();
	const cityNameFromStore = configStore.use.cityName();
	const cityIdFromStore = configStore.use.cityId();
	const setAddressToStore = configStore.use.setAddress();

	const [postalCode, setPostalCode] = useState(postalCodeFromStore);
	const [cityName, setCityName] = useState(cityNameFromStore);
	const [cityId, setCityId] = useState(cityIdFromStore);

	const [isValidating, setIsValidating] = useState(false);
	const [error, setError] = useState('');

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

	const onNext = () => {
		setIsValidating(true);
		setError('');
		validateInput({ postalCode, cityId, cityName })
			.then(() => {
				setIsValidating(false);
				setAddressToStore({ postalCode, cityId, cityName });
				handleNext();
			})
			.catch((error) => {
				setIsValidating(false);
				if (error instanceof z.ZodError) {
					setError(error.issues[0].message);
				} else {
					setError('Upps. ein unbekannter Fehler ist aufgetreten');
				}
			});
	};

	useEffect(() => {
		setError('');
	}, [postalCode, cityId, cityName]);

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

	const showSpinner = isLoading || isValidating;
	const tainted =
		postalCode !== postalCodeFromStore ||
		cityId !== cityIdFromStore ||
		cityName !== cityNameFromStore;
	return (
		<ScrollView
			flex={1}
			minHeight="$full"
			contentContainerStyle={{ flex: 1, minHeight: '100%' }}
		>
			<YStack flex={1} px="$4" pb="$8" gap="$4" jc="space-between">
				<YStack gap="$4">
					<Header customNavigation={handlePrev} tainted={tainted}>
						Woher kommst du?
					</Header>
					<Paragraph px="$4">
						Lieber Nah- oder Fernbeziehung? Um die Distanz zu
						unseren Produzenten einzuschätzen, gib bitte deine
						Postleitzahl ein.
					</Paragraph>

					{error !== '' && (
						<Paragraph px="$4" color="$baseLollipopRed">
							{error}
						</Paragraph>
					)}
					<View
						flexDirection="column"
						justifyContent="space-between"
						gap="$4"
						px="$4"
					>
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
								pl="$12"
								pr={showSpinner ? '$9' : '$2'}
								width="$full"
								height="$full"
								value={postalCode}
								placeholder="Postleitzahl"
								onChangeText={setPostalCode}
							/>

							{showSpinner && (
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

						{/* @TODO fix Dropdowntrigger (padding is not right) */}
						<View
							flexDirection="row"
							alignItems="center"
							pos="relative"
						>
							<View
								asChild
								theme="secondary"
								pr={
									showSpinner || (cities && cities.length > 1)
										? '$9'
										: '$2'
								}
								disabled={
									cities === undefined ||
									cities.length === 0 ||
									cities.length === 1
								}
							>
								<select
									value={cityId}
									className="font_input"
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
									disabled={
										cities === undefined ||
										cities.length === 0 ||
										cities.length === 1
									}
								>
									<option disabled value={-1}>
										Stadt
									</option>
									{cities &&
										cities.map((city) => (
											<option
												key={city.id}
												value={city.id}
											>
												{city.name}
											</option>
										))}
								</select>
							</View>
							{!showSpinner && cities && cities.length > 1 && (
								<View
									pointerEvents="none"
									position="absolute"
									gap="$2"
									right="$0"
									pr="$2"
								>
									<ArrowDropDown
										style={{ color: color.baseStromeeNavy }}
									/>
								</View>
							)}
							{showSpinner && (
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
					</View>
				</YStack>

				<View flex={1} overflow="hidden" ai="center" jc="center">
					<Image
						width="100%"
						height="auto"
						maxWidth="100%"
						maxHeight="100%"
						aspectRatio="327/176"
						resizeMode="contain"
						alignSelf="center"
						alt="Ein Pfad verbindet zwei Herzen"
						source={{
							uri: createRelativeUrl('/images/address_image.svg'),
						}}
					/>
				</View>

				<YStack gap="$2">
					<Dots count={count} activeIndex={index} />
					<Button
						disabled={isLoading || isValidating}
						onPress={onNext}
					>
						Weiter
					</Button>
				</YStack>
			</YStack>
		</ScrollView>
	);
};

export { Address };
