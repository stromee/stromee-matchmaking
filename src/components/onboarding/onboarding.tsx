import { FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { configStore } from "@utils/config-store";
import { useEffect } from "react";
import { Spinner, Text, View, YStack } from "tamagui";
import * as z from "zod";

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
    <YStack flex={1} bg="blue">
      <Text>Onboarding</Text>
      {!initalValidated && <Spinner size="large" />}
    </YStack>
  );
};

export { Onboarding };
