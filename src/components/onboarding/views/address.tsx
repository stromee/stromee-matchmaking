import { useEffect, useState } from 'react';

import { H1, Paragraph, Spinner, View, YStack } from 'tamagui';
import * as z from 'zod';

import { fonts } from '@theme/fonts';
import { color, radius } from '@theme/tokens';

import { Button } from '@components/themed/button';
import { Input } from '@components/themed/input';

import { useCitiesQuery } from '@hooks/use-cities-query';

import { configStore } from '@utils/config-store';
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
		} else {
			setCityName('');
			setCityId(-1);
		}
	}, [cities]);

	return (
		<YStack gap="$4">
			<H1>Postalcode</H1>
			{error !== '' && (
				<Paragraph color="$baseLollipopRed">{error}</Paragraph>
			)}

			<Input
				value={postalCode}
				placeholder="Postleitzahl"
				onChangeText={setPostalCode}
			/>
			<View
				asChild
				theme="secondary"
				py="$2"
				px="$4"
				minHeight="$11"
				borderRadius="$full"
			>
				<select
					value={cityId}
					disabled={
						cities === undefined ||
						cities.length === 0 ||
						cities.length === 1
					}
					onChange={(e) => {
						console.log(e.target.value);
						if (cities) {
							const id = parseInt(e.target.value);
							setCityId(id);
							const name = cities.find((city) => city.id === id)
								?.name;
							setCityName(name || '');
						}
					}}
					style={{
						fontFamily: fonts.input.family as string,
						fontSize: fonts.input.size['3'] as number,
						fontWeight: fonts.input.weight?.['3'] as
							| number
							| undefined,
						color: color.baseStromeeNavy,
						backgroundColor: color.baseCloudWhite,
						borderRadius: radius.full,
						border: `1px solid ${color.baseStromeeNavy}`,
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
			</View>
			{(isLoading || isValidating) && <Spinner size="large" />}
			<Button disabled={isLoading || isValidating} onPress={onNext}>
				Weiter
			</Button>
			<Button disabled={isValidating} onPress={handlePrev}>
				Zurück
			</Button>
		</YStack>
	);
};

export { Address };
