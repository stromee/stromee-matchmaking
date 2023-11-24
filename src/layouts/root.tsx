import { TamaguiProvider, Theme, View, XStack, YStack } from "tamagui";

import { Link, Outlet } from "react-router-dom";
import config from "@theme/tamagui.config";
import { AppStateProvider } from "@providers/app-state-provider";
import { producerStore } from "@utils/swipable-store";
import { useProducersQuery } from "@hooks/use-producers-query";
import { useEffect, useRef } from "react";
import { useCitiesQuery } from "@hooks/use-cities-query";
import { configStore } from "@utils/config-store";
import { Onboarding } from "@components/onboarding/onboarding";
import { BodyText } from "@components/themed/body-text";
import { shuffle } from "@utils/misc";

const Root = () => {
  const valid = configStore.use.valid();
  const postalCode = configStore.use.postalCode();

  useEffect(() => {
    const unsub = configStore.subscribe((state) => {
      console.log("state", state);
    });
    return unsub;
  }, []);

  const setSelection = useRef(true);
  const updateAllItems = producerStore.use.updateAllItems();
  const updateSelection = producerStore.use.updateSelection();
  const { data } = useProducersQuery({ postalCode });

  useEffect(() => {
    if (data) {
      const items = shuffle(data)
        .map((producer) => ({
          id: producer.id.toString(),
          value: producer,
        }))
        .sort();
      updateAllItems(items);

      // TODO: figure out if this is good once we add some filters and reordering stuff...
      if (setSelection.current) {
        updateSelection(items);
        setSelection.current = false;
      }
    }

    return () => {
      setSelection.current = true;
    };
  }, [data]);

  return (
    <TamaguiProvider config={config} defaultTheme="popPetrol">
      <AppStateProvider>
        <View flex={1} bg="$background" ai="center" jc="center">
          <Theme name="base">
            <YStack
              bg="$background"
              fullscreen
              margin="auto"
              maxWidth="400px"
              maxHeight="800px"
              overflow="hidden"
            >
              {!valid ? (
                <Onboarding />
              ) : (
                <>
                  <nav>
                    <XStack asChild gap="$2" p="$2" m="$0">
                      <ul>
                        <View asChild>
                          <li>
                            <Link to="/">
                              <BodyText>home</BodyText>
                            </Link>
                          </li>
                        </View>
                        <View asChild>
                          <li>
                            <Link to="/matches">
                              <BodyText>matches</BodyText>
                            </Link>
                          </li>
                        </View>
                      </ul>
                    </XStack>
                  </nav>

                  <Outlet />
                </>
              )}
            </YStack>
          </Theme>
        </View>
      </AppStateProvider>
    </TamaguiProvider>
  );
};

export { Root };
