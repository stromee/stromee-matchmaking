import { useCallback, useEffect, useRef, useState } from 'react';

import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes';
import { H2, Paragraph, XStack, YStack, clamp } from 'tamagui';
import { Image } from 'tamagui';

import { color } from '@theme/tokens';

import Close from '@components/icons/close.svg?react';
import HeartFilled from '@components/icons/heart-filled.svg?react';
import Menu from '@components/icons/menu.svg?react';

import { producerStore } from '@utils/producer-store';
import { Producer } from '@utils/types';

import { PresenceStack } from './presence-stack';
import { ProducerDetail } from './producer-detail';
import { ProducerSwipable } from './producer-swipable';
import { Pan, Swipable, SwipableRef } from './swipeable';
import { Button } from './themed/button';
import { Link } from './themed/link';
import { CustomZStack, CustomZStackChild } from './z-stack';

const computedStyle = (value: number): DefaultStyle => {
	if (value == 1) {
		return {
			shadowOpacity: withTiming(0),
			shadowRadius: withTiming(4),
			transform: [
				{
					scale: 1,
				},
			],
		};
	}
	if (value >= 1) {
		const scale = interpolate(value, [1, 2], [1, 1.2]);
		return {
			// backgroundColor: color,
			shadowOpacity: withTiming(1),
			shadowRadius: withTiming(12),
			transform: [
				{
					scale,
				},
			],
		};
	}

	const scale = interpolate(value, [0, 1], [0.8, 1]);
	return {
		shadowOpacity: withTiming(0),
		shadowRadius: withTiming(4),
		transform: [
			{
				scale,
			},
		],
	};
};

const indexAfterActive = ({
	swipables,
	activeId,
	id,
}: {
	swipables: { id: string }[];
	activeId: string;
	id;
}) => {
	const activeIndex = swipables.findIndex(({ id }) => id === activeId);
	const index = swipables.findIndex(
		({ id: swipableId }) => swipableId === id,
	);

	return activeIndex - index;
};

const SwipableList = ({ count = 4 }) => {
	const swipableRef = useRef<SwipableRef | null>(null);
	const [isSwiping, setIsSwiping] = useState(false);

	const leftButtonTransform = useSharedValue(1);
	const rightButtonTransform = useSharedValue(1);

	const leftButtonStyle = useAnimatedStyle(
		() => computedStyle(leftButtonTransform.value),
		[leftButtonTransform],
	);

	const rightButtonStyle = useAnimatedStyle(
		() => computedStyle(rightButtonTransform.value),
		[rightButtonTransform],
	);

	const swipedRight = producerStore.use.swipedRight();
	const swipedLeft = producerStore.use.swipedLeft();
	const resetSwipedLeft = producerStore.use.resetSwipedLeft();

	const remaining = producerStore.use.remaining();
	const remainingDeferred = producerStore.use
		.remainingDeferred()
		.slice(-count, undefined);

	const onSwipe = producerStore.use.onSwipe();
	const onSwipeFinished = producerStore.use.onSwipeFinished();

	const activeSwipableId = remaining[remaining.length - 1]?.id || '';
	// we need to copy the swipable id to a ref, so we can use the value in swipabled callbacks
	// with the current value
	const activeSwipableIdRef = useRef(activeSwipableId);

	const [producerDetail, setProducerDetail] = useState<
		Producer | undefined
	>();

	useEffect(() => {
		activeSwipableIdRef.current = activeSwipableId;
	}, [activeSwipableId]);

	// useEffect(() => {
	//   if (swipables.length === 0) {
	//     const newSwipables = createSwipables(10);
	//     setSwipables(newSwipables);
	//     setActiveSwipable(newSwipables[newSwipables.length - 1].id);
	//   }
	// }, [swipables]);

	const handlePan = useCallback((pan: Pan) => {
		if (pan.swipableId !== activeSwipableIdRef.current) {
			if (__DEV__) {
				console.warn(
					`pan.swipableId not active for "${pan.swipableId}"; expected: "${activeSwipableIdRef.current}")`,
				);
			}

			return;
		}

		if (pan.translate === 0) {
			leftButtonTransform.value = withTiming(1);
			rightButtonTransform.value = withTiming(1);
			setIsSwiping(false);
			return;
		}

		const direction = pan.translate > 0 ? 'right' : 'left';
		setIsSwiping(true);
		const distance = Math.abs(pan.translate);

		// if the swipe isn't far enough, the scale is 0 - 1
		if (distance < pan.minSwipeDistance) {
			if (direction === 'right') {
				const scale = interpolate(
					pan.translate,
					[0, pan.minSwipeDistance],
					[0, 1],
				);
				leftButtonTransform.value = 1;
				rightButtonTransform.value = scale;
			}
			// left swipe
			if (direction === 'left') {
				const scale = interpolate(
					pan.translate,
					[0, -pan.minSwipeDistance],
					[0, 1],
				);
				leftButtonTransform.value = scale;
				rightButtonTransform.value = 1;
			}

			return;
		}

		// if we have an actual swipe, the scale is 1 - 2
		const clamped = clamp(distance, [
			pan.minSwipeDistance,
			pan.maxSwipeDistance,
		]);

		const interpolated = interpolate(
			clamped,
			[pan.minSwipeDistance, pan.maxSwipeDistance],
			[1, 2],
		);

		if (direction === 'left') {
			leftButtonTransform.value = interpolated;
			rightButtonTransform.value = withTiming(1);
		}
		if (direction === 'right') {
			leftButtonTransform.value = withTiming(1);
			rightButtonTransform.value = interpolated;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<CustomZStack>
				{remaining.length === 0 && (
					<CustomZStackChild>
						<YStack
							px="$4"
							py="$8"
							gap="$4"
							flex={1}
							pointerEvents="auto"
						>
							<H2 mt="auto">Alles weg?!</H2>
							{swipedRight.length > 0 ? (
								<Paragraph>
									Das waren alle unsere Produzenten. Zeit,
									deine Matches kennenzulernen!
								</Paragraph>
							) : (
								<Paragraph>
									Das waren alle unsere Produzenten. Es sieht
									so aus als wäre nix für dich dabei gewesen.
									Schau doch einfach nochmal!
								</Paragraph>
							)}
							<Image
								mt="$16"
								mb="$4"
								width="$full"
								maxWidth="$full"
								height="auto"
								aspectRatio="368/92"
								source={{
									uri: '/images/lonely_plant_01.svg',
									width: 368,
									height: 92,
								}}
							/>
							{swipedRight.length > 0 && (
								<Link
									to="/matches"
									theme="stromeeNavy"
									display="flex"
									borderRadius="$full"
									borderWidth="1px"
									borderColor="$transparent"
									minHeight="$11"
									ai="center"
									jc="center"
									px="$4"
									py="$2"
									bg="$background"
									hoverStyle={{
										borderColor: '$baseGrey400',
									}}
									focusStyle={{
										outlineStyle: 'solid',
										outlineWidth: 2,
										outlineColor: '$baseGrey400',
									}}
								>
									Matches ansehen
								</Link>
							)}
							{swipedRight.length === 0 && (
								<Button
									theme="stromeeNavy"
									hoverStyle={{
										borderColor: '$baseGrey400',
									}}
									focusStyle={{
										outlineStyle: 'solid',
										outlineWidth: 2,
										outlineColor: '$baseGrey400',
									}}
									onPress={() => {
										resetSwipedLeft();
									}}
								>
									Neustart
								</Button>
							)}
							{swipedLeft.length > 0 &&
								swipedRight.length !== 0 && (
									<Button
										theme="base"
										borderColor="$borderColor"
										onPress={() => {
											resetSwipedLeft();
										}}
									>
										Neustart
									</Button>
								)}
						</YStack>
					</CustomZStackChild>
				)}
				{remainingDeferred.map(({ id, value: producer }) => (
					<CustomZStackChild key={id}>
						<Swipable
							key={id}
							id={id}
							enabled={id === activeSwipableId}
							ref={id === activeSwipableId ? swipableRef : null}
							onSwipe={(swipe) => {
								onSwipe({
									id,
									direction: swipe.direction,
								});
								if (remaining.length === 1) {
									setIsSwiping(true);
								} else {
									// reset buttons
									handlePan({
										swipableId: id,
										maxSwipeDistance: 0,
										minSwipeDistance: 0,
										translate: 0,
									});
									setIsSwiping(false);
								}
							}}
							onSwipeFinished={(swipeFinished) => {
								swipeFinished.callback();

								if (!activeSwipableIdRef.current) {
									handlePan({
										swipableId: activeSwipableIdRef.current,
										maxSwipeDistance: 0,
										minSwipeDistance: 0,
										translate: 0,
									});
									setIsSwiping(false);
								}

								onSwipeFinished({
									id,
								});
							}}
							onPan={handlePan}
							bottomOffset={76}
							topOffset={60}
						>
							<ProducerSwipable
								indexAfterActive={indexAfterActive({
									swipables: remaining,
									activeId: activeSwipableId,
									id,
								})}
								producer={producer}
								onProducerDetailClick={(producer) => {
									setProducerDetail(producer);
								}}
							/>
						</Swipable>
					</CustomZStackChild>
				))}
			</CustomZStack>

			<XStack
				width="$full"
				mx="auto"
				maxWidth="$72"
				flex={0}
				padding="$4"
				justifyContent="space-around"
			>
				<Button
					p="$0"
					size={undefined}
					width="64px"
					height="64px"
					circular
					backgroundColor="$transparent"
					animation="easeInOutSine"
					animateOnly={['transform', 'shadowOpacity', 'shadowRadius']}
					shadowColor={color.baseLollipopRed}
					shadowOpacity={0}
					shadowRadius={4}
					borderWidth="$0.5"
					borderColor="$transparent"
					hoverStyle={{
						borderWidth: '$0',
						borderColor: '$transparent',
						backgroundColor: '$transparent',
					}}
					pressStyle={{
						transform: [{ scale: 1.1 }],
						shadowColor: color.baseLollipopRed,
						shadowOpacity: 1,
						shadowRadius: 12,
					}}
					focusStyle={{
						backgroundColor: '$transparent',
						outlineWidth: 0,
					}}
					onPress={() => {
						if (
							swipableRef.current &&
							swipableRef.current.id === activeSwipableId
						) {
							swipableRef.current.swipe('left');
						}
					}}
					disabled={isSwiping || remainingDeferred.length === 0}
				>
					<Animated.View
						style={[
							{
								borderRadius: 99999,
								height: 64,
								width: 64,
								alignItems: 'center',
								justifyContent: 'center',
								color: color.baseCloudWhite,
								backgroundColor: color.baseLollipopRed,
								borderWidth: 2,
								borderColor: color.baseCloudWhite,
								shadowColor: color.baseLollipopRed,
							},
							leftButtonStyle,
						]}
					>
						<AccessibleIcon label="Kein Match">
							<Close />
						</AccessibleIcon>
					</Animated.View>
				</Button>
				<Link
					to="/matches"
					theme="base"
					display="flex"
					borderRadius="$full"
					borderWidth="1px"
					borderColor="$baseStromeeNavy"
					backgroundColor="$background"
					p="$2"
					ai="center"
					jc="center"
					m="auto"
					aspectRatio="1"
					focusStyle={{
						outlineStyle: 'solid',
						outlineWidth: 2,
						outlineColor: '$baseStromeeNavy',
					}}
				>
					<AccessibleIcon label="Deine Matches">
						<Menu />
					</AccessibleIcon>
				</Link>
				<Button
					p="$0"
					size={undefined}
					width="64px"
					height="64px"
					circular
					backgroundColor="$transparent"
					animation="easeInOutSine"
					animateOnly={['transform', 'shadowOpacity', 'shadowRadius']}
					shadowColor={color.baseStromeeGreen}
					shadowOpacity={0}
					shadowRadius={4}
					borderWidth="$0.5"
					borderColor="$transparent"
					hoverStyle={{
						borderWidth: '$0',
						borderColor: '$transparent',
						backgroundColor: '$transparent',
					}}
					pressStyle={{
						transform: [{ scale: 1.1 }],
						shadowColor: color.baseStromeeGreen,
						shadowOpacity: 1,
						shadowRadius: 12,
					}}
					focusStyle={{
						backgroundColor: '$transparent',
						outlineWidth: 0,
					}}
					onPress={() => {
						if (
							swipableRef.current &&
							swipableRef.current.id === activeSwipableId
						) {
							swipableRef.current?.swipe('right');
						}
					}}
					disabled={isSwiping || remainingDeferred.length === 0}
				>
					<Animated.View
						style={[
							{
								borderRadius: 99999,
								height: 64,
								width: 64,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: color.baseStromeeNavy,
								borderWidth: 2,
								borderColor: color.baseCloudWhite,
								shadowColor: color.baseStromeeGreen,
							},
							rightButtonStyle,
						]}
					>
						<AccessibleIcon label="Match">
							<HeartFilled />
						</AccessibleIcon>
					</Animated.View>
				</Button>
			</XStack>

			<PresenceStack condition={!!producerDetail}>
				{producerDetail && (
					<ProducerDetail
						producer={producerDetail}
						onBack={() => {
							setProducerDetail(undefined);
						}}
						floatingButton
					/>
				)}
			</PresenceStack>
		</>
	);
};

export { SwipableList };
