import { useEffect, useRef } from 'react';

import { Link, Outlet } from 'react-router-dom';
import { Spinner, TamaguiProvider, Theme, View, YStack } from 'tamagui';

import config from '@theme/tamagui.config';

import { AppStateProvider } from '@providers/app-state-provider';

import { Onboarding } from '@components/onboarding/onboarding';
import { BodyText } from '@components/themed/body-text';

import { usePrice } from '@hooks/use-price';
import { useProducers } from '@hooks/use-producers';

import { configStore } from '@utils/config-store';
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
				<Outlet />
				{__DEV__ && (
					<nav>
						<Link to="/dev">
							<BodyText>dev</BodyText>
						</Link>
					</nav>
				)}
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
