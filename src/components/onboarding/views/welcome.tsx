import { H1, H2, Image, View, YStack } from 'tamagui';

import { Button } from '@components/themed/button';

import { OnboardingCarouselProps } from '../constants';

type WelcomeProps = OnboardingCarouselProps;

const Welcome = ({ onNext: handleNext }: WelcomeProps) => {
	return (
		<YStack flex={1} px="$4" py="$8" gap="$4" jc="space-between">
			<H1 alignSelf="center">Stromee</H1>
			<Image
				width={300}
				height={300}
				resizeMode="contain"
				alignSelf="center"
				source={{
					uri: '/images/infogr_1_producer.png',
				}}
			/>
			<View px="$8">
				<H2 textAlign="center">
					Ab ins Energieabendteuer - <br />
					Swipe dir deinen passenden Produzenten!
				</H2>
			</View>
			<Button onPress={handleNext}>Los gehts!</Button>
		</YStack>
	);
};

export { Welcome };
