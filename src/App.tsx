import "@tamagui/polyfill-dev";

import { TamaguiProvider, XStack, View } from "tamagui";

import config from "../tamagui/tamagui.config";

import SwipeableButton from "./components/Swipeable";

export const App = () => {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <XStack fullscreen>
        <View bg="teal" flex={1} height="100%" />
        <View bg="red" flex={1} height="100%" />
      </XStack>
      <SwipeableButton
        onSwipe={(swipe) => {
          console.log("onSwipe", swipe);
        }}
        onSwipeFinished={(swipeFinished) => {
          console.log("onSwipeFinished", swipeFinished);
          swipeFinished.callback();
        }}
      />
    </TamaguiProvider>
  );
};
