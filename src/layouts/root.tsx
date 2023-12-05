import { useEffect, useRef } from 'react';

import { Outlet } from 'react-router-dom';
import { Spinner, TamaguiProvider, Theme, View, YStack } from 'tamagui';

import config from '@theme/tamagui.config';

import { AppStateProvider } from '@providers/app-state-provider';

import { Onboarding } from '@components/onboarding/onboarding';
import { BodyText } from '@components/themed/body-text';
import { Link } from '@components/themed/link';

import { usePrice } from '@hooks/use-price';
import { useProducers } from '@hooks/use-producers';
import { useProducersInfoQuery } from '@hooks/use-producers-info-query';

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

	// fetch Data top level
	const { data: producers, isLoading } = useProducers();
	useProducersInfoQuery();
	usePrice();

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

	const handleDynamicContent = () => {
		if (!initalValidated) {
			return (
				<View flex={1} px="$4" py="$8" jc="center" ai="center">
					<Spinner size="large" color="$baseStromeeNavy" />
				</View>
			);
		}

		if (!valid) {
			return <Onboarding />;
		}

		if (isLoading) {
			return (
				<View flex={1} px="$4" py="$8" jc="center" ai="center">
					<Spinner size="large" color="$baseStromeeNavy" />
				</View>
			);
		}

		return (
			<>
				<Outlet />
				{__DEV__ && (
					<nav>
						<Link
							to="/dev"
							size={undefined}
							height="unset"
							borderTopLeftRadius="$4"
							borderTopRightRadius="$4"
							borderBottomLeftRadius="$0"
							borderBottomRightRadius="$0"
							borderWidth="1px"
							borderColor="$transparent"
							p="$2"
							pr="$4"
							ai="center"
							jc="flex-start"
						>
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
							maxWidth="428px"
							maxHeight="926px"
							overflow="hidden"
							$desktop={{
								borderColor: '$baseGrey600',
								borderWidth: '1px',
								borderRadius: '$6',
							}}
						>
							{handleDynamicContent()}
						</YStack>
					</Theme>
				</View>
			</AppStateProvider>
		</TamaguiProvider>
	);
};

export { Root };
