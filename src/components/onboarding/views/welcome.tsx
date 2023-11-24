import { H2, YStack, getTokenValue } from "tamagui";
import {
  OnboardingCarouselProps,
  getEnterStyle,
  getExitStyle,
} from "../constants";
import { Button } from "@components/themed/button";
import { getAnimatedStyle } from "react-native-reanimated";

type WelcomeProps = OnboardingCarouselProps;

const Welcome = ({ onNext: handleNext }: WelcomeProps) => {
  return (
    <YStack flex={1} px="$4" py="$8" gap="$4" jc="space-between">
      <H2>
        Flirte mit stromee Powermatch und finde dein Energiematch, das dein Herz
        höher schlagen lässt
      </H2>
      <Button onPress={handleNext}>Weiter</Button>
    </YStack>
  );
};

export { Welcome };
