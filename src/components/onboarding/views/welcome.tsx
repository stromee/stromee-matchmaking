import { H1, H2, Image, ScrollView, View, YStack } from 'tamagui';

import { Button } from '@components/themed/button';

import { OnboardingCarouselProps } from '../constants';

type WelcomeProps = OnboardingCarouselProps;

const Welcome = ({ onNext: handleNext }: WelcomeProps) => {
	return (
		<ScrollView
			flex={1}
			minHeight="$full"
			contentContainerStyle={{ flex: 1, minHeight: '100%' }}
		>
			<YStack flex={1} px="$4" py="$8" gap="$4" jc="space-between">
				<H1 alignSelf="center">Stromee</H1>
				<Image
					maxWidth="300px"
					width="$full"
					aspectRatio="1/1"
					resizeMode="contain"
					alignSelf="center"
					source={{
						uri: '/images/infogr_1_producer.png',
					}}
				/>
				<View px="$8">
					<H2 textAlign="center">
						Ab ins Energieabenteuer - <br />
						Swipe dir deinen passenden Produzenten!
					</H2>
				</View>
				<Button onPress={handleNext}>Los gehts!</Button>
			</YStack>
		</ScrollView>
	);
};

export { Welcome };
