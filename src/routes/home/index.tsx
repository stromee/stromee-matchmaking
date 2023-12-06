import { useEffect, useRef, useState } from 'react';

import { DotLottiePlayer } from '@dotlottie/react-player';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import {
	Checkbox,
	H1,
	H2,
	Image,
	Label,
	ScrollView,
	Theme,
	XStack,
} from 'tamagui';
import { YStack } from 'tamagui';

import { color } from '@theme/tokens';

import CheckboxChecked from '@components/icons/checkbox-checked.svg?react';
import CheckboxUnchecked from '@components/icons/checkbox-unchecked.svg?react';
import Logo from '@components/icons/logo.svg?react';
import { MatchAnimation } from '@components/match-animation';
import { PresenceStack } from '@components/presence-stack';
import { SwipableList } from '@components/swipeable-list';
import { BodyText } from '@components/themed/body-text';
import { Button } from '@components/themed/button';
import { Link } from '@components/themed/link';

import { configStore } from '@utils/config-store';
import { createRelativeUrl } from '@utils/misc';
import { producerStore } from '@utils/producer-store';

const Home = () => {
	const showMatchAfterSwipeFromStore = configStore.use.showMatchAfterSwipe();
	const setShowMatchAfterSwipeFromStore =
		configStore.use.setShowMatchAfterSwipe();
	const [checked, setChecked] = useState(!showMatchAfterSwipeFromStore);
	useEffect(() => {
		// sync store with local state
		setChecked(!showMatchAfterSwipeFromStore);
	}, [showMatchAfterSwipeFromStore]);

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
			<H1
				padding="$4"
				fontSize="$1"
				display="flex"
				ai="center"
				jc="center"
			>
				<AccessibleIcon label="stromee powermatch">
					<Logo />
				</AccessibleIcon>
			</H1>
			<SwipableList />
			<Theme name="popPetrol">
				<PresenceStack
					condition={!!currentSwipe && showMatchAfterSwipeFromStore}
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

							<MatchAnimation />

							<YStack width="$full" px="$4" py="$8" gap="$2">
								<Link
									onPress={() => {
										setShowMatchAfterSwipeFromStore(
											!checked,
										);
									}}
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
										borderColor: '$baseCloudWhite',
									}}
									focusStyle={{
										outlineStyle: 'solid',
										outlineWidth: 2,
										outlineColor: '$baseCloudWhite',
									}}
								>
									Jetzt kennenlernen
								</Link>
								<Button
									borderColor="$borderColor"
									theme="popPetrol"
									onPress={() => {
										setShowMatchAfterSwipeFromStore(
											!checked,
										);
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
								<XStack gap="$2" ai="center" mt="$2">
									<Checkbox
										id="showMatchAfterSwipe"
										checked={checked}
										onCheckedChange={(checkedState) => {
											console.log(
												'checkeEvent',
												checkedState,
											);
											if (
												checkedState !== 'indeterminate'
											) {
												setChecked(checkedState);
											}
										}}
										size="$true"
										width="inital"
										height="inital"
										padding="$0"
										borderColor="$transparent"
									>
										{!checked && (
											<CheckboxUnchecked
												style={{
													color: color.baseCloudWhite,
												}}
											/>
										)}
										<Checkbox.Indicator>
											<CheckboxChecked />
										</Checkbox.Indicator>
									</Checkbox>
									<Label htmlFor="showMatchAfterSwipe">
										<BodyText>Nicht mehr anzeigen</BodyText>
									</Label>
								</XStack>
							</YStack>
						</YStack>
					</ScrollView>
				</PresenceStack>
			</Theme>
		</>
	);
};
export { Home as Component };
