import { FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { configStore } from "@utils/config-store";
import { useEffect } from "react";
import { Spinner, Text, View, YStack } from "tamagui";
import * as z from "zod";
import { OnboardingCarousel } from "./onboarding-carousel";

const Onboarding = () => {
  const initalValidated = configStore.use.initialValidated();
  const fullValidation = configStore.use.fullValidation();

  useEffect(() => {
    console.log("initalValidated", initalValidated);
    if (initalValidated === false) {
      fullValidation();
    }
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
