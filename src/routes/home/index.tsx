import { useEffect, useRef, useState } from 'react';

import { DotLottiePlayer } from '@dotlottie/react-player';
import { AnimatePresence, H1, View, ZStack } from 'tamagui';
import { YStack } from 'tamagui';

import { SwipableList } from '@components/swipeable-list';
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
						animation="medium"
						style={{
							transformOrigin: 'center left',
						}}
						enterStyle={{
							opacity: 1,
							transform: [{ translateX: '-100%' }],
						}}
						exitStyle={{
							opacity: 0,
							transform: [{ translateX: '100%' }],
						}}
					>
						<View px="$4" py="$8">
							<H1
								fontSize="$display"
								lineHeight="$display"
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
							<Button
								onPress={() => {
									setCurrentSwipe(undefined);
								}}
							>
								Jetzt kennenlernen
							</Button>
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
