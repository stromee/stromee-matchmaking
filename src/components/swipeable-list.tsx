import { useCallback, useEffect, useRef, useState } from 'react';

import { LinearGradient } from '@tamagui/linear-gradient';
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes';
import {
	Card,
	H4,
	Image,
	Paragraph,
	SizableText,
	Theme,
	View,
	ZStack,
	clamp,
} from 'tamagui';

import { color } from '@theme/tokens';

import { formatDistance } from '@utils/format';
import { producerStore } from '@utils/producer-store';

import { SwipableProducer } from './swipable-producer';
import { Pan, Swipable, SwipableRef } from './swipeable';
import { Button } from './themed/button';
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

	const remaining = producerStore.use.remaining();
	const remainingDeferred = producerStore.use
		.remainingDeferred()
		.slice(-count, undefined);

	const onSwipe = producerStore.use.onSwipe();
	const onSwipeFinished = producerStore.use.onSwipeFinished();
	const resetSwiped = producerStore.use.resetSwiped();
	const reset = producerStore.use.reset();

	const activeSwipableId = remaining[remaining.length - 1]?.id || '';
	// we need to copy the swipable id to a ref, so we can use the value in swipabled callbacks
	// with the current value
	const activeSwipableIdRef = useRef(activeSwipableId);

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
							bottomOffset={138}
							topOffset={60}
						>
							<SwipableProducer
								indexAfterActive={indexAfterActive({
									swipables: remaining,
									activeId: activeSwipableId,
									id,
								})}
								producer={producer}
							/>
						</Swipable>
					</CustomZStackChild>
				))}
			</CustomZStack>

			<View flex={0} padding="$4" justifyContent="space-around">
				<Button
					theme="lollipopRed"
					p="$0"
					borderRadius="$full"
					backgroundColor="$transparent"
					animation="bouncy"
					animateOnly={['transform', 'shadowOpacity', 'shadowRadius']}
					shadowColor={color.baseLollipopRed}
					shadowOpacity={0}
					shadowRadius={4}
					borderWidth="$0"
					hoverStyle={{
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
								height: 44,
								paddingHorizontal: 16,
								paddingVertical: 8,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: color.baseLollipopRed,
								borderWidth: 2,
								borderColor: color.baseCloudWhite,
								shadowColor: color.baseLollipopRed,
							},
							leftButtonStyle,
						]}
					>
						<SizableText>Nope</SizableText>
					</Animated.View>
				</Button>

				<Button
					p="$0"
					backgroundColor="$transparent"
					animation="bouncy"
					animateOnly={['transform', 'shadowOpacity', 'shadowRadius']}
					shadowColor={color.baseStromeeGreen}
					shadowOpacity={0}
					shadowRadius={4}
					borderWidth="$0"
					hoverStyle={{
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
								height: 44,
								paddingHorizontal: 16,
								paddingVertical: 8,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: color.baseStromeeGreen,
								borderWidth: 2,
								borderColor: color.baseCloudWhite,
								shadowColor: color.baseStromeeGreen,
							},
							rightButtonStyle,
						]}
					>
						<SizableText>Yes!</SizableText>
					</Animated.View>
				</Button>
			</View>
			<View jc="center" p="$2">
				<Button
					theme="popPetrol"
					onPress={resetSwiped}
					borderRadius="$full"
				>
					Reset Selection
				</Button>
				<Button theme="popPetrol" onPress={reset} borderRadius="$full">
					Reset all
				</Button>
			</View>
		</>
	);
};

export { SwipableList };
