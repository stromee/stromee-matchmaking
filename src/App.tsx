import '@tamagui/polyfill-dev'

import { Button, TamaguiProvider, YStack } from 'tamagui'

import config from '../tamagui/tamagui.config'
import { Animated } from './components/Animated'

export const App = () => {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <YStack f={1} ai="center" jc="center">
        <Button onPress={() => {
          console.log('Hello world')
        }}>Hello world</Button>
        <Animated>Hi</Animated>
      </YStack>
    </TamaguiProvider>
  )
}
