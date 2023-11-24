import { useEffect, useState } from "react";
import { H1, Paragraph, Slider, Text, YStack } from "tamagui";
import * as z from "zod";

import { configStore } from "@utils/config-store";
import { DEFAULT_CONSUMPTION } from "@utils/constants";

import { OnboardingCarouselProps } from "../constants";
import { conumptionSyncSchema } from "@utils/schema";
import { Button } from "@components/themed/button";

type ConsumptionTypeProps = OnboardingCarouselProps;

const consumptions = [1000, 2000, 3000, 4000, 5000];

const Consumption = ({
  onNext: handleNext,
  onPrev: handlePrev,
}: ConsumptionTypeProps) => {
  const consumptionFromStore = configStore.use.consumption();
  const setConsumptionToStore = configStore.use.setConsumption();

  const [consumption, setConsumption] = useState(
    consumptionFromStore === -1 ? DEFAULT_CONSUMPTION : consumptionFromStore
  );
  const [error, setError] = useState("");

  useEffect(() => {
    // sync store with local state
    setConsumption(
      consumptionFromStore === -1 ? DEFAULT_CONSUMPTION : consumptionFromStore
    );
  }, [consumptionFromStore]);

  const onNext = () => {
    try {
      conumptionSyncSchema.parse(consumption);
      setError("");
      setConsumptionToStore(consumption);
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
  }, [consumption]);

  return (
    <YStack gap="$4">
      <H1>Verbrauch {consumption}kWh</H1>
      {error !== "" && <Paragraph color="$baseLollipopRed">{error}</Paragraph>}
      <Slider
        value={[consumption]}
        onValueChange={(v) => setConsumption(v[0])}
        step={10}
        min={10}
        max={10000}
        height="$6"
      >
        <Slider.Track bg="$baseStromeeNavy" height="$1" />
        <Slider.Thumb
          index={0}
          circular
          size="$6"
          width="$6"
          height="$6"
          bg="$baseCloudWhite"
          borderColor="$baseStromeeNavy"
          shadowColor="$baseCloudWhiteOpacity80"
          shadowRadius={4}
          hoverStyle={{
            borderColor: "$baseStromeeNavy",
            bg: "$baseCloudWhite",
          }}
          focusStyle={{
            borderColor: "$baseStromeeNavy",
            bg: "$baseCloudWhite",
          }}
        />
      </Slider>
      {consumptions.map((c) => (
        <Button
          theme={consumption === c ? "stromeeGreen" : "base"}
          key={c}
          onPress={() => {
            setConsumption(c);
          }}
        >
          Verbrauch {c} kWh
        </Button>
      ))}

      <Button onPress={onNext}>Weiter</Button>
      <Button onPress={handlePrev}>Zurück</Button>
    </YStack>
  );
};

export { Consumption };
