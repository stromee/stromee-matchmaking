import { useEffect, useRef, useState } from 'react';

import { DotLottiePlayer } from '@dotlottie/react-player';
import { H1, Theme, View } from 'tamagui';
import { YStack } from 'tamagui';

import { PresenceStack } from '@components/presence-stack';
import { SwipableList } from '@components/swipeable-list';
import { Button } from '@components/themed/button';
import { Link } from '@components/themed/link';

import { configStore } from '@utils/config-store';
import { producerStore } from '@utils/producer-store';

const Home = () => {
	const showMatchAfterSwipe = configStore.use.showMatchAfterSwipe();
	const setShowMatchAfterSwipe = configStore.use.setShowMatchAfterSwipe();

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
	return (
		<>
			<SwipableList />
			<Theme name="popPetrol">
				<PresenceStack
					condition={!!currentSwipe && showMatchAfterSwipe}
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
						style={{
							aspectRatio: '3/1',
							width: '100%',
							maxHeight: '100px',
						}}
					/>

					<YStack px="$4" py="$8" gap="$2">
						<Link
							to={`/matches/${currentSwipe}`}
							theme="stromeeGreen"
							height="$11"
							bg="$background"
							display="flex"
							borderRadius="$full"
							borderWidth="1px"
							borderColor="$transparent"
							px="$4"
							py="$2"
							ai="center"
							jc="center"
							hoverStyle={{
								borderColor: '$baseStromeeNavy',
							}}
							focusStyle={{
								outlineStyle: 'solid',
								outlineWidth: 2,
								outlineColor: '$baseStromeeNavy',
							}}
						>
							Jetzt kennenlernen
						</Link>
						<Button
							onPress={() => {
								setCurrentSwipe(undefined);
							}}
						>
							Weiter swipen
						</Button>
						<Button
							onPress={() => {
								setShowMatchAfterSwipe(false);
								setCurrentSwipe(undefined);
							}}
						>
							Nicht mehr anzeigen
						</Button>
					</YStack>
				</PresenceStack>
			</Theme>
		</>
	);
};
export { Home as Component };
