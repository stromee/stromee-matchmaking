import { useCallback, useEffect, useRef, useState } from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Square, Text, YStack, View } from "tamagui";

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const MIN_SWIPE_DISTANCE = 128;

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  return Math.min(Math.max(lowerBound, value), upperBound);
};

type SwipeButtonPropsType = {
  onSwipe: (swipe: { direction: "left" | "right"; distance: number }) => void;
  onSwipeFinished: (swipe: {
    direction: "left" | "right";
    finalDistance: number;
    callback: () => void;
  }) => void;
};

const GESTURE_DEFAULT_DIMENSIONS = {
  x: 0,
  y: 0,
  absoluteX: 0,
  absoluteY: 0,
};

const SwipeableButton = ({
  onSwipe,
  onSwipeFinished,
}: SwipeButtonPropsType) => {
  const SWIPABLE_DIMENSIONS = useRef({ width: 0, height: 0, x: 0, y: 0 });
  const ELEMENT_DIMENSIONS = useRef({ width: 0, height: 0, x: 0, y: 0 });

  const swipingCount = useRef(0);
  const [state, setState] = useState<State>(State.UNDETERMINED);

  const gestureStartDimensions = useSharedValue(GESTURE_DEFAULT_DIMENSIONS);

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const angle = useSharedValue(0);
  const velocityX = useSharedValue(0);
  const velocityY = useSharedValue(0);

  const gestureHandler = ({ nativeEvent: e }) => {
    "worklet";

    if (e.state === State.ACTIVE) {
      const LEFT_X_BOUNDARY = gestureStartDimensions.value.absoluteX * -1;
      const RIGHT_X_BOUNDARY =
        SWIPABLE_DIMENSIONS.current.width -
        gestureStartDimensions.value.absoluteX;

      const TOP_Y_BOUNDARY = gestureStartDimensions.value.absoluteY * -1;
      const BOTTOM_Y_BOUNDARY =
        SWIPABLE_DIMENSIONS.current.height -
        gestureStartDimensions.value.absoluteY;

      const newX = clamp(e.translationX, LEFT_X_BOUNDARY, RIGHT_X_BOUNDARY);

      const newY = clamp(e.translationY, TOP_Y_BOUNDARY, BOTTOM_Y_BOUNDARY);

      const ELEMENT_X_CENTER =
        ELEMENT_DIMENSIONS.current.x + ELEMENT_DIMENSIONS.current.width / 2;
      const SWIPER_X_CENTER =
        SWIPABLE_DIMENSIONS.current.x + SWIPABLE_DIMENSIONS.current.width / 2;
      const NEW_X_CENTER = ELEMENT_X_CENTER + newX;
      const X_DISTANCE = NEW_X_CENTER - SWIPER_X_CENTER;

      const newAngle = interpolate(
        X_DISTANCE,
        [
          (ELEMENT_DIMENSIONS.current.x + ELEMENT_DIMENSIONS.current.width) *
            -1,
          SWIPABLE_DIMENSIONS.current.width - ELEMENT_DIMENSIONS.current.x,
        ],
        [-45, 45],
        Extrapolate.CLAMP
      );

      x.value = newX;
      y.value = newY;
      angle.value = newAngle;

      velocityX.value = e.velocityX;
      velocityY.value = e.velocityY;
    }
  };

  const gestureStateHandler = ({ nativeEvent: e }) => {
    "worklet";
    setState(e.state);

    if (e.state === State.FAILED) {
      gestureStartDimensions.value = GESTURE_DEFAULT_DIMENSIONS;

      x.value = withTiming(0);
      y.value = withTiming(0);
      angle.value = withTiming(0);

      velocityX.value = 0;
      velocityY.value = 0;
    }

    if (e.state === State.BEGAN) {
      gestureStartDimensions.value = {
        x: e.x,
        y: e.y,
        absoluteX: e.absoluteX,
        absoluteY: e.absoluteY,
      };
    }

    if (e.state === State.CANCELLED) {
      gestureStartDimensions.value = GESTURE_DEFAULT_DIMENSIONS;

      x.value = withTiming(0);
      y.value = withTiming(0);
      angle.value = withTiming(0);

      velocityX.value = 0;
      velocityY.value = 0;
    }

    if (e.state === State.END) {
      const distance = x.value;

      if (Math.abs(distance) > MIN_SWIPE_DISTANCE) {
        const direction = distance > 0 ? "right" : "left";
        onSwipe({ direction, distance: Math.abs(distance) });
      } else {
        setState(State.UNDETERMINED);

        x.value = withTiming(0);
        y.value = withTiming(0);
        angle.value = withTiming(0);

        velocityX.value = 0;
        velocityY.value = 0;
      }
      gestureStartDimensions.value = GESTURE_DEFAULT_DIMENSIONS;
    }
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
        {
          translateY: y.value,
        },
        {
          rotate: `${angle.value}deg`,
        },
      ],
    };
  }, [x, y, angle]);

  const swipeSpringCallback = useCallback((distance) => {
    swipingCount.current = swipingCount.current + 1;
    if (swipingCount.current === 2) {
      const direction = distance > 0 ? "right" : "left";

      onSwipeFinished({
        direction,
        finalDistance: Math.abs(distance),
        callback() {
          x.value = withTiming(0);
          y.value = withTiming(0);
          angle.value = withTiming(0);

          velocityX.value = 0;
          velocityY.value = 0;
        },
      });

      swipingCount.current = 0;

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, []);

  useEffect(() => {
    if (state === State.END) {
      const a = x.value;
      const b = y.value;
      const c = Math.sqrt(a * a + b * b);

      const alpha = Math.asin(a / c) * (180 / Math.PI);
      const beta = Math.asin(b / c) * (180 / Math.PI);

      const MAX_SWIPE_DISTANCE = Math.sqrt(
        SWIPABLE_DIMENSIONS.current.width * SWIPABLE_DIMENSIONS.current.width +
          SWIPABLE_DIMENSIONS.current.height *
            SWIPABLE_DIMENSIONS.current.height
      );
      const MAX_ELEMENT_DISTANCE = Math.sqrt(
        ELEMENT_DIMENSIONS.current.width * ELEMENT_DIMENSIONS.current.width +
          ELEMENT_DIMENSIONS.current.height * ELEMENT_DIMENSIONS.current.height
      );

      const c2 = MAX_SWIPE_DISTANCE + MAX_ELEMENT_DISTANCE;

      const a2 = c2 * Math.sin(alpha * (Math.PI / 180));
      const b2 = c2 * Math.sin(beta * (Math.PI / 180));

      x.value = withSpring(
        a2,
        {
          velocity: velocityX.value,
          damping: 100,
          stiffness: 500,
        },
        () => swipeSpringCallback(c2)
      );

      y.value = withSpring(
        b2,
        {
          velocity: velocityY.value,
          damping: 100,
          stiffness: 500,
        },
        () => swipeSpringCallback(c2)
      );

      // todo move offscreen with velocity
    }
  }, [state]);
  return (
    <YStack
      f={1}
      ai="center"
      jc="center"
      width="100%"
      fullscreen
      onLayout={(e) => {
        SWIPABLE_DIMENSIONS.current = {
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
          x: e.nativeEvent.layout.x,
          y: e.nativeEvent.layout.y,
        };
      }}
    >
      <View
        bg="yellow"
        onLayout={(e) => {
          ELEMENT_DIMENSIONS.current = {
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
            x: e.nativeEvent.layout.x,
            y: e.nativeEvent.layout.y,
          };
        }}
      >
        <PanGestureHandler
          onHandlerStateChange={gestureStateHandler}
          onGestureEvent={gestureHandler}
        >
          <Animated.View style={[animatedStyles]}>
            <Square
              size={400}
              borderColor="$borderColor"
              borderWidth={1}
              borderRadius="$9"
              backgroundColor="$color9"
            >
              <Text>Hi</Text>
            </Square>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </YStack>
  );
};

export default SwipeableButton;
