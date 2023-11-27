import { useEffect, useRef, useState } from 'react';

import { DotLottiePlayer } from '@dotlottie/react-player';
import { Link } from 'react-router-dom';
import { AnimatePresence, H1, View } from 'tamagui';
import { YStack } from 'tamagui';

import { SwipableList } from '@components/swipeable-list';
import { BodyText } from '@components/themed/body-text';
import { Button } from '@components/themed/button';

import { configStore } from '@utils/config-store';
import { producerStore } from '@utils/producer-store';

const Home = () => {
	const postalCode = configStore.use.postalCode();
	console.log('postalCode', postalCode);

	const lastLength = useRef(-1);
	const [currentSwipe, setCurrentSwipe] = useState<string | undefined>(
		undefined,
	);
	const swipedRight = producerStore.use.swipedRight();
	useEffect(() => {
		// we got a new swipe
		if (swipedRight.length === lastLength.current + 1) {
			lastLength.current = swipedRight.length;
			setCurrentSwipe(swipedRight[swipedRight.length - 1]);
		} else {
			// either we got new producer and some swipes are missing
			// or its the inital render
			lastLength.current = swipedRight.length;
		}
	}, [swipedRight]);
	console.log('swipedRight', swipedRight);
	return (
		<>
			<SwipableList />
			<AnimatePresence>
				{currentSwipe && (
					<YStack
						bg="$background"
						jc="space-between"
						fullscreen
						animateOnly={['opacity', 'transform']}
						animation="easeInOutSine"
						enterStyle={{
							opacity: 0,
							// @ts-expect-error - this value works but throws a typescript error
							transform: [{ translateY: '60%' }],
						}}
						exitStyle={{
							opacity: 0,
							// @ts-expect-error - this value works but throws a typescript error
							transform: [{ translateY: '60%' }],
						}}
					>
						<View px="$4" py="$8">
							<H1
								// @ts-expect-error - this value works but throws a typescript error
								fontSize="$display"
								// @ts-expect-error - this value works but throws a typescript error
								lineHeight="$display"
								// @ts-expect-error - this value works but throws a typescript error
								letterSpacing="$display"
							>
								Du hast ein Match!
							</H1>
						</View>
						<DotLottiePlayer
							autoplay
							loop
							src="./animations/watermelon.lottie"
							style={{ aspectRatio: '3/2', width: '100%' }}
						/>

						<YStack px="$4" py="$8" gap="$2">
							<Link to={`/matches/${currentSwipe}`}>
								<BodyText>Jetzt kennenlernen</BodyText>
							</Link>
							<Button
								onPress={() => {
									setCurrentSwipe(undefined);
								}}
							>
								Weiter swipen
							</Button>
						</YStack>
					</YStack>
				)}
			</AnimatePresence>
		</>
	);
};
export { Home as Component };
