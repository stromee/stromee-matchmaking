import { useEffect, useRef, useState } from 'react';

import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { H1, H2, Image, ScrollView, Theme } from 'tamagui';
import { YStack } from 'tamagui';

import Logo from '@components/icons/logo.svg?react';
import { PresenceStack } from '@components/presence-stack';
import { SwipableList } from '@components/swipeable-list';
import { Button } from '@components/themed/button';
import { Link } from '@components/themed/link';

import { configStore } from '@utils/config-store';
import { createRelativeUrl } from '@utils/misc';
import { producerStore } from '@utils/producer-store';

const Home = () => {
	const showMatchAfterSwipe = configStore.use.showMatchAfterSwipe();
	// const setShowMatchAfterSwipe = configStore.use.setShowMatchAfterSwipe();

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
			<H1 padding="$4" fontSize="$1">
				<AccessibleIcon label="stromee powermatch">
					<Logo />
				</AccessibleIcon>
			</H1>
			<SwipableList />
			<Theme name="popPetrol">
				<PresenceStack
					condition={!!currentSwipe && showMatchAfterSwipe}
				>
					<ScrollView
						pos="relative"
						flex={1}
						minHeight="$full"
						contentContainerStyle={{ flex: 1, minHeight: '100%' }}
					>
						<YStack mt="auto" gap="$4" px="$4" py="$8">
							<H2
								fontWeight="500"
								textAlign="center"
								// @ts-expect-error - this value works but throws a typescript error
								fontSize="$display"
								// @ts-expect-error - this value works but throws a typescript error
								lineHeight="$display"
								// @ts-expect-error - this value works but throws a typescript error
								letterSpacing="$display"
							>
								Du hast ein Match!
							</H2>

							<Image
								mx="$-4"
								width="$full"
								height="auto"
								resizeMode="contain"
								alignSelf="center"
								aspectRatio="390/360"
								source={{
									uri: createRelativeUrl('/images/match.svg'),
								}}
							/>

							<YStack width="$full" px="$4" py="$8" gap="$2">
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
									borderColor="$borderColor"
									theme="popPetrol"
									onPress={() => {
										setCurrentSwipe(undefined);
									}}
								>
									Weiter swipen
								</Button>
								{/* <Button
									borderColor="$borderColor"
									theme="popPetrol"
									onPress={() => {
										setShowMatchAfterSwipe(false);
										setCurrentSwipe(undefined);
									}}
								>
									Nicht mehr anzeigen
								</Button> */}
							</YStack>
						</YStack>
					</ScrollView>
				</PresenceStack>
			</Theme>
		</>
	);
};
export { Home as Component };
