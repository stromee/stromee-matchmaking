import { TamaguiProvider, Theme, View, YStack } from "tamagui";

import { Link, Outlet } from "react-router-dom";
import config from "@theme/tamagui.config";
import { AppStateProvider } from "@providers/app-state-provider";
import { producerStore } from "@utils/swipable-store";
import { useProducersQuery } from "@hooks/use-producers-query";
import { useEffect } from "react";

const Root = () => {
  const updateAllItems = producerStore.use.updateAllItems();

  const { data } = useProducersQuery({});
  useEffect(() => {
    if (data) {
      const items = data.map((producer) => ({
        id: producer.id.toString(),
        value: producer,
        rotate: `${(Math.random() - 0.5) * 6}deg`,
      }));
      updateAllItems(items);
    }
  }, [data]);

  return (
    <TamaguiProvider config={config} defaultTheme="popPetrol">
      <AppStateProvider>
        <View flex={1} bg="$background" ai="center" jc="center">
          <Theme name="secondary">
            <YStack
              bg="$background"
              fullscreen
              margin="auto"
              maxWidth="400px"
              maxHeight="800px"
              overflow="hidden"
            >
              <nav>
                <ul>
                  <li>
                    <Link to="/">Your Name</Link>
                  </li>
                  <li>
                    <Link to="/matches">Matches</Link>
                  </li>
                </ul>
              </nav>
              <Outlet />
            </YStack>
          </Theme>
        </View>
      </AppStateProvider>
    </TamaguiProvider>
  );
};

export { Root };
