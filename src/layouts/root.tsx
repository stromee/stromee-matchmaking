import { useEffect, useRef } from 'react';

import { Link, Outlet } from 'react-router-dom';
import { Spinner, TamaguiProvider, Theme, View, XStack, YStack } from 'tamagui';

import config from '@theme/tamagui.config';

import { AppStateProvider } from '@providers/app-state-provider';

import { Onboarding } from '@components/onboarding/onboarding';
import { BodyText } from '@components/themed/body-text';

import { usePrice } from '@hooks/use-price';
import { usePriceQuery } from '@hooks/use-price-query';
import { useProducers } from '@hooks/use-producers';
import { useProducersQuery } from '@hooks/use-producers-query';

import { configStore } from '@utils/config-store';
import {
	CAMPAIGN_IDENTIFIER,
	ENERGY_TYPE,
	PRODUCT_CODE,
} from '@utils/constants';
import { shuffle } from '@utils/misc';
import { producerStore } from '@utils/producer-store';

const Root = () => {
	const valid = configStore.use.valid();

	const initalValidated = configStore.use.initialValidated();
	const fullValidation = configStore.use.fullValidation();

	useEffect(() => {
		if (initalValidated === false) {
			fullValidation();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initalValidated]);

	const { data: producers, isLoading } = useProducers();
	const { data: price } = usePrice();

	const setSelection = useRef(true);
	const updateAllItems = producerStore.use.updateAllItems();
	const updateSelection = producerStore.use.updateSelection();

	useEffect(() => {
		if (producers) {
			const items = shuffle(producers).map((producer) => ({
				id: producer.id.toString(),
				value: producer,
			}));

			updateAllItems(items);

			// TODO: figure out if this is good once we add some filters and reordering stuff...
			if (setSelection.current) {
				updateSelection(items);
				setSelection.current = false;
			}
		}

		return () => {
			setSelection.current = true;
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [producers]);

	useEffect(() => {
		console.log('price', price);
	}, [price]);

	const handleContent = () => {
		if (!initalValidated) {
			return (
				<View flex={1} px="$4" py="$8" jc="center" ai="center">
					<Spinner size="large" />
				</View>
			);
		}

		if (!valid) {
			return <Onboarding />;
		}

		if (isLoading) {
			return (
				<View flex={1} px="$4" py="$8" jc="center" ai="center">
					<Spinner size="large" />
				</View>
			);
		}

		return (
			<>
				<nav>
					<XStack asChild gap="$2" p="$2" m="$0">
						<ul>
							<View asChild>
								<li>
									<Link to="/">
										<BodyText>home</BodyText>
									</Link>
								</li>
							</View>
							<View asChild>
								<li>
									<Link to="/matches">
										<BodyText>matches</BodyText>
									</Link>
								</li>
							</View>
						</ul>
					</XStack>
				</nav>

				<Outlet />
			</>
		);
	};

	return (
		<TamaguiProvider config={config} defaultTheme="popPetrol">
			<AppStateProvider>
				<View flex={1} bg="$background" ai="center" jc="center">
					<Theme name="base">
						<YStack
							bg="$background"
							fullscreen
							margin="auto"
							maxWidth="400px"
							maxHeight="800px"
							overflow="hidden"
						>
							{handleContent()}
						</YStack>
					</Theme>
				</View>
			</AppStateProvider>
		</TamaguiProvider>
	);
};

export { Root };
