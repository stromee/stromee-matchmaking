import { AnimatePresence, Text, View, XStack, YStack, styled } from "tamagui";
import { ONBOARDING_VIEWS } from "./constants";
import { useState } from "react";
import { Welcome } from "./views/welcome";
import { Address } from "./views/address";
import { Consumption } from "./views/consumption";
import { EnergyType } from "./views/energy-type";
import { assertUnreachable } from "@utils/misc";
import { set } from "zod";

const YStackEnterable = styled(YStack, {
  variants: {
    toLeft: {
      true: {
        transform: [{ translateX: "100%" }, { translateY: "0%" }],
        opacity: 0,
      },
    },
    toRight: {
      true: {
        transform: [
          { translateX: "-100%" },
          {
            translateY: "0%",
          },
        ],
        opacity: 0,
      },
    },
    toTop: {
      true: {
        transform: [
          { translateX: "0%" },
          {
            translateY: "50%",
          },
        ],
        opacity: 0,
      },
    },
    toBottom: {
      true: {
        transform: [
          { translateX: "0%" },
          {
            translateY: "-50%",
          },
        ],
        opacity: 0,
      },
    },
  } as const,
});

const getEnterMode = (direction: -1 | 0 | 1) => {
  if (direction === 0) {
    return "toTop";
  }
  if (direction === 1) {
    return "toLeft";
  }
  if (direction === -1) {
    return "toRight";
  }
};

const getExitMode = (direction: -1 | 0 | 1) => {
  if (direction === 0) {
    return "toBottom";
  }
  if (direction === 1) {
    return "toRight";
  }
  if (direction === -1) {
    return "toLeft";
  }
};

const OnboardingCarousel = () => {
  const [view, setView] = useState<ONBOARDING_VIEWS>(
    ONBOARDING_VIEWS.Values.welcome
  );
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);

  const getOnboardView = (view: ONBOARDING_VIEWS) => {
    switch (view) {
      case ONBOARDING_VIEWS.Values.welcome:
        return (
          <Welcome
            onNext={() => {
              setView(ONBOARDING_VIEWS.Values.address);
              setDirection(1);
            }}
            onPrev={() => {
              console.log("first");
            }}
          />
        );
      case ONBOARDING_VIEWS.Values.address:
        return (
          <Address
            onNext={() => {
              setView(ONBOARDING_VIEWS.Values.consumption);
              setDirection(1);
            }}
            onPrev={() => {
              setView(ONBOARDING_VIEWS.Values.welcome);
              setDirection(-1);
            }}
          />
        );
      case ONBOARDING_VIEWS.Values.consumption:
        return (
          <Consumption
            onNext={() => {
              setView(ONBOARDING_VIEWS.Values.energyType);
              setDirection(1);
            }}
            onPrev={() => {
              setView(ONBOARDING_VIEWS.Values.address);
              setDirection(-1);
            }}
          />
        );
      case ONBOARDING_VIEWS.Values.energyType:
        return (
          <EnergyType
            onNext={() => {
              console.log("done");
              setDirection(0);
            }}
            onPrev={() => {
              setView(ONBOARDING_VIEWS.Values.consumption);
              setDirection(-1);
            }}
          />
        );

      default:
        return assertUnreachable(view);
    }
  };

  const enterVariant = getEnterMode(direction);
  const exitVariant = getExitMode(direction);
  const component = getOnboardView(view);

  return (
    <XStack
      overflow="hidden"
      flex={1}
      position="relative"
      width="100%"
      alignItems="center"
    >
      <AnimatePresence enterVariant={enterVariant} exitVariant={exitVariant}>
        <YStackEnterable
          fullscreen
          flex={1}
          key={view}
          width="$full"
          height="$full"
          animation="medium"
          x={0}
          y={0}
          opacity={1}
        >
          {component}
        </YStackEnterable>
      </AnimatePresence>
    </XStack>
  );
};

export { OnboardingCarousel };
