import { useMemo, useState } from 'react';

import { AnimatePresence, XStack, YStack, styled } from 'tamagui';

import { assertUnreachable } from '@utils/misc';

import { ONBOARDING_VIEWS } from './constants';
import { Address } from './views/address';
import { Consumption } from './views/consumption';
import { EnergyType } from './views/energy-type';
import { Welcome } from './views/welcome';

const YStackEnterable = styled(YStack, {
	variants: {
		toLeft: {
			true: {
				// @ts-expect-error - this value works but throws a typescript error
				transform: [{ translateX: '100%' }, { translateY: '0%' }],
				opacity: 0,
			},
		},
		toRight: {
			true: {
				transform: [
					// @ts-expect-error - this value works but throws a typescript error
					{ translateX: '-100%' },
					{
						// @ts-expect-error - this value works but throws a typescript error
						translateY: '0%',
					},
				],
				opacity: 0,
			},
		},
		idle: {
			true: {
				transform: [
					// @ts-expect-error - this value works but throws a typescript error
					{ translateX: '0%' },
					{
						// @ts-expect-error - this value works but throws a typescript error
						translateY: '0%',
					},
				],
				opacity: 1,
			},
		},
	} as const,
});

const getEnterMode = (direction: -1 | 0 | 1) => {
	if (direction === 0) {
		return 'idle';
	}
	if (direction === 1) {
		return 'toLeft';
	}
	if (direction === -1) {
		return 'toRight';
	}
};

const getExitMode = (direction: -1 | 0 | 1) => {
	if (direction === 0) {
		return 'idle';
	}
	if (direction === 1) {
		return 'toRight';
	}
	if (direction === -1) {
		return 'toLeft';
	}
};

const Onboarding = () => {
	const [view, setView] = useState<ONBOARDING_VIEWS>(
		ONBOARDING_VIEWS.Values.welcome,
	);
	const [direction, setDirection] = useState<-1 | 0 | 1>(0);

	const onboardView = useMemo(() => {
		switch (view) {
			case ONBOARDING_VIEWS.Values.welcome:
				return (
					<Welcome
						onNext={() => {
							setView(ONBOARDING_VIEWS.Values.address);
							setDirection(1);
						}}
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						onPrev={() => {}}
					/>
				);
			case ONBOARDING_VIEWS.Values.address:
				return (
					<Address
						onNext={() => {
							setView(ONBOARDING_VIEWS.Values.consumption);
							setDirection(1);
						}}
						onPrev={() => {
							setView(ONBOARDING_VIEWS.Values.welcome);
							setDirection(-1);
						}}
					/>
				);
			case ONBOARDING_VIEWS.Values.consumption:
				return (
					<Consumption
						onNext={() => {
							setView(ONBOARDING_VIEWS.Values.energyType);
							setDirection(1);
						}}
						onPrev={() => {
							setView(ONBOARDING_VIEWS.Values.address);
							setDirection(-1);
						}}
					/>
				);
			case ONBOARDING_VIEWS.Values.energyType:
				return (
					<EnergyType
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						onNext={() => {}}
						onPrev={() => {
							setView(ONBOARDING_VIEWS.Values.consumption);
							setDirection(-1);
						}}
					/>
				);

			default:
				return assertUnreachable(view);
		}
	}, [view]);

	const enterVariant = getEnterMode(direction);
	const exitVariant = getExitMode(direction);

	return (
		<XStack
			overflow="hidden"
			flex={1}
			position="relative"
			width="100%"
			alignItems="center"
		>
			<AnimatePresence
				enterVariant={enterVariant}
				exitVariant={exitVariant}
			>
				<YStackEnterable
					fullscreen
					flex={1}
					key={view}
					width="$full"
					height="$full"
					animation="medium"
					opacity={1}
				>
					{onboardView}
				</YStackEnterable>
			</AnimatePresence>
		</XStack>
	);
};

export { Onboarding };
