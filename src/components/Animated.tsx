import { AnimationProp } from '@tamagui/core'
import { Button, Square, useControllableState, useEvent } from 'tamagui'

interface AnimatedProps {
    children: React.ReactNode
    animation?: AnimationProp
    position?: number
}

export function Animated({animation, children, position:positionProps}: AnimatedProps) {
  const [positionI, setPositionI] = useControllableState({
    strategy: 'most-recent-wins',
    prop: positionProps,
    defaultProp: 0,
  })

  const position = positions[positionI]

  const onPress = useEvent(() => {
    setPositionI((x) => {
      return (x + 1) % positions.length
    })
  })

  return (
    <>
      <Square
        animation={animation || 'bouncy'}
        animateOnly={['transform']}
        onPress={onPress}
        size={104}
        borderColor="$borderColor"
        borderWidth={1}
        borderRadius="$9"
        backgroundColor="$color9"
        hoverStyle={{
          scale: 1.5,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...position}
      >
        {children}
      </Square>
    </>
  )
}

const positions = [
  {
    x: 0,
    y: 0,
    scale: 1,
    rotate: '0deg',
  },
  {
    x: -50,
    y: -50,
    scale: 0.5,
    rotate: '-45deg',
    hoverStyle: {
      scale: 0.6,
    },
    pressStyle: {
      scale: 0.4,
    },
  },
  {
    x: 50,
    y: 50,
    scale: 1,
    rotate: '180deg',
    hoverStyle: {
      scale: 1.1,
    },
    pressStyle: {
      scale: 0.9,
    },
  },
]
