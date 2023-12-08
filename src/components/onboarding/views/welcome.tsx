import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { H1, H2, Image, Paragraph, ScrollView, View, YStack } from 'tamagui';

import Logo from '@components/icons/logo.svg?react';
import { Button } from '@components/themed/button';
import { WelcomeImage } from '@components/welcome-image';

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
				<View
					flex={1}
					overflow="hidden"
					ai="center"
					jc="center"
					minHeight="$48"
				>
					<Image
						width="300px"
						height="300px"
						maxWidth="100%"
						maxHeight="100%"
						aspectRatio="672/674"
						resizeMode="contain"
						alignSelf="center"
						alt="Produzent winkt vor seiner Biogasanlage"
						source={{
							uri: 'https://a.storyblok.com/f/116218/672x674/9050b1f04c/infogr_1_producer.png/m/600x0',
						}}
					/>
				</View>
				<YStack px="$8" gap="$2">
					<H2 size="$7" textAlign="center">
						Auf der Suche nach der Energie deines Lebens? Finde dein
						Strom 💚 Match!
					</H2>
					<Paragraph textAlign="center">
						stromee bietet Ökostrom aus erneuerbaren Energieanlagen.
						Entdecke die Produzenten dahinter und finde mit unserem
						Powermatch heraus, wer perfekt zu dir passt.
					</Paragraph>
					<Paragraph textAlign="center" fontWeight="bold">
						Einfach swipen und kennenlernen!
					</Paragraph>
				</YStack>

				<Button onPress={handleNext}>Los gehts!</Button>
			</YStack>
		</ScrollView>
	);
};

export { Welcome };
