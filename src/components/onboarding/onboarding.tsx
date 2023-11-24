import { configStore } from "@utils/config-store";
import { useEffect } from "react";
import { Spinner, View, YStack } from "tamagui";
import { OnboardingCarousel } from "./onboarding-carousel";

const Onboarding = () => {
  const initalValidated = configStore.use.initialValidated();
  const fullValidation = configStore.use.fullValidation();

  useEffect(() => {
    console.log("initalValidated", initalValidated);
    if (initalValidated === false) {
      fullValidation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalValidated]);

  return (
    <YStack flex={1}>
      {!initalValidated && (
        <View flex={1} px="$4" py="$8" jc="center" ai="center">
          <Spinner size="large" />
        </View>
      )}
      {initalValidated && <OnboardingCarousel />}
    </YStack>
  );
};

export { Onboarding };
