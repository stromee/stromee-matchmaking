import { useEffect, useState } from "react";
import {
  Checkbox,
  H1,
  Label,
  Paragraph,
  Spinner,
  Text,
  View,
  YStack,
} from "tamagui";
import * as z from "zod";

import { configStore } from "@utils/config-store";
import { PLANT_TYPE_WITHOUT_DEFAULT } from "@utils/constants";

import { OnboardingCarouselProps } from "../constants";
import { energyTypesSyncSchema } from "@utils/schema";
import { Button } from "@components/themed/button";

type EnergyTypeProps = OnboardingCarouselProps;

const plantTypes = Object.values(PLANT_TYPE_WITHOUT_DEFAULT.Values);

const EnergyType = ({
  onNext: handleNext,
  onPrev: handlePrev,
}: EnergyTypeProps) => {
  const energyTypesFromStore = configStore.use.energyTypes();
  const setEnergyTypesToStore = configStore.use.setEnergyTypes();

  const [isValidating, setIsValidating] = useState(false);
  const [energyTypes, setEnergyTypes] = useState(energyTypesFromStore);

  const [error, setError] = useState("");
  useEffect(() => {
    // sync store with local state
    setEnergyTypes(energyTypesFromStore);
  }, [energyTypesFromStore]);

  const onNext = () => {
    try {
      energyTypesSyncSchema.parse(energyTypes);
      setIsValidating(true);
      setError("");
      setEnergyTypesToStore(energyTypes);
      handleNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error);
        setError(error.issues[0].message);
      } else {
        setError("Upps. ein unbekannter Fehler ist aufgetreten");
      }
    }
  };

  useEffect(() => {
    setError("");
  }, [energyTypes]);

  return (
    <YStack gap="$4">
      <H1>ENERGY TYPE</H1>
      {error !== "" && <Paragraph color="$baseLollipopRed">{error}</Paragraph>}
      {plantTypes.map((plantType) => {
        return (
          <View key={plantType}>
            <Checkbox
              id={`onbarding-carousel-${plantType}-checkbox`}
              checked={energyTypes.includes(plantType)}
              onCheckedChange={(checked) => {
                console.log(checked, plantType);
                if (checked) {
                  console.log(energyTypes);
                  if (!energyTypes.includes(plantType)) {
                    setEnergyTypes([...energyTypes, plantType]);
                  }
                } else {
                  setEnergyTypes(energyTypes.filter((et) => et !== plantType));
                }
              }}
            >
              <Checkbox.Indicator>
                <Text>✅</Text>
              </Checkbox.Indicator>
            </Checkbox>
            <Label htmlFor={`onbarding-carousel-${plantType}-checkbox`}>
              {plantType}
            </Label>
          </View>
        );
      })}

      {isValidating && <Spinner size="large" />}
      <Button onPress={onNext}>Weiter</Button>
      <Button onPress={handlePrev}>Zurück</Button>
    </YStack>
  );
};

export { EnergyType };
