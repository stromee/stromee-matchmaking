import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { H1, H2, Image, ScrollView, View, YStack } from 'tamagui';

import Logo from '@components/icons/logo.svg?react';
import { Button } from '@components/themed/button';

import { createRelativeUrl } from '@utils/misc';

import { OnboardingCarouselProps } from '../constants';

type WelcomeProps = OnboardingCarouselProps;

const Welcome = ({ onNext: handleNext }: WelcomeProps) => {
	return (
		<ScrollView
			flex={1}
			minHeight="$full"
			contentContainerStyle={{ flex: 1, minHeight: '100%' }}
		>
			<YStack
				flex={1}
				px="$4"
				pt="$0"
				pb="$8"
				gap="$4"
				jc="space-between"
			>
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
				<Image
					maxWidth="300px"
					width="$full"
					aspectRatio="1/1"
					resizeMode="contain"
					alignSelf="center"
					source={{
						uri: createRelativeUrl('/images/infogr_1_producer.png'),
					}}
				/>
				<View px="$8">
					<H2 textAlign="center">
						Auf der Suche nach der Energie deines Lebens? Swipe dir
						deinen passenden Stromerzeuger!
					</H2>
				</View>

				<Button onPress={handleNext}>Los gehts!</Button>
			</YStack>
		</ScrollView>
	);
};

export { Welcome };
