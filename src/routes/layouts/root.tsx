import { TamaguiProvider, Theme, View, YStack } from "tamagui";

import { Link, Outlet } from "react-router-dom";
import config from "../../../tamagui/tamagui.config";
import { AppStateProvider } from "../../providers/app-state-provider";

const Root = () => {
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
                    <Link to="/bla">Your Friend</Link>
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
