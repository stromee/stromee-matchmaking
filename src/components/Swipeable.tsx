import {
  Ref,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Square, Text, YStack, View, clamp } from "tamagui";

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const MIN_SWIPE_DISTANCE = 128;

const GESTURE_DEFAULT_DIMENSIONS = {
  x: 0,
  y: 0,
  absoluteX: 0,
  absoluteY: 0,
};

export type SwipableRef = {
  swipe: (direction: "left" | "right") => void;
};

export type Pan = {
  translate: number;
  maxSwipeDistance: number;
  minSwipeDistance: number;
};

type SwipableProps = {
  enabled?: boolean;
  offscreenOffset?: number;
  onPan: (pan: Pan) => void;
  onSwipe: (swipe: { direction: "left" | "right"; distance: number }) => void;
  onSwipeFinished: (swipe: {
    direction: "left" | "right";
    finalDistance: number;
    callback: () => void;
  }) => void;
  children: React.ReactNode;
};

const Swipable = forwardRef<SwipableRef, SwipableProps>(
  (
    { enabled, offscreenOffset = 0, onPan, onSwipe, onSwipeFinished, children },
    ref
  ) => {
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

    useEffect(() => {
      if (ref && typeof ref !== "function" && "current" in ref) {
        ref.current = {
          swipe: (direction) => {
            if (direction === "left") {
              x.value = MIN_SWIPE_DISTANCE * -1;
            }

            if (direction === "right") {
              x.value = MIN_SWIPE_DISTANCE;
            }

            const Y_RANGE = [-24, 24];
            y.value = Math.random() * (Y_RANGE[1] - Y_RANGE[0]) + Y_RANGE[0];
            handleEndState();
          },
        };
      }
    }, [ref]);

    const handleEndState = () => {
      const distance = x.value;

      if (Math.abs(distance) >= MIN_SWIPE_DISTANCE) {
        const direction = distance > 0 ? "right" : "left";
        onSwipe({ direction, distance: Math.abs(distance) });
        setState(State.END);
      } else {
        setState(State.UNDETERMINED);
        x.value = withTiming(0);
        y.value = withTiming(0);
        angle.value = withTiming(0);

        velocityX.value = 0;
        velocityY.value = 0;

        onPan({
          translate: 0,
          maxSwipeDistance:
            SWIPABLE_DIMENSIONS.current.width / 2 +
            ELEMENT_DIMENSIONS.current.width / 2,
          minSwipeDistance: MIN_SWIPE_DISTANCE,
        });
      }

      gestureStartDimensions.value = GESTURE_DEFAULT_DIMENSIONS;
    };

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

        const newX = clamp(e.translationX, [LEFT_X_BOUNDARY, RIGHT_X_BOUNDARY]);

        const newY = clamp(e.translationY, [TOP_Y_BOUNDARY, BOTTOM_Y_BOUNDARY]);

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
          [-15, 15],
          Extrapolate.CLAMP
        );

        x.value = newX;
        y.value = newY;
        angle.value = newAngle;

        velocityX.value = e.velocityX;
        velocityY.value = e.velocityY;

        onPan({
          translate: newX,
          maxSwipeDistance:
            SWIPABLE_DIMENSIONS.current.width / 2 +
            ELEMENT_DIMENSIONS.current.width / 2,
          minSwipeDistance: MIN_SWIPE_DISTANCE,
        });
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

        onPan({
          translate: 0,
          maxSwipeDistance:
            SWIPABLE_DIMENSIONS.current.width / 2 +
            ELEMENT_DIMENSIONS.current.width / 2,
          minSwipeDistance: MIN_SWIPE_DISTANCE,
        });
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

        onPan({
          translate: 0,
          maxSwipeDistance:
            SWIPABLE_DIMENSIONS.current.width / 2 +
            ELEMENT_DIMENSIONS.current.width / 2,
          minSwipeDistance: MIN_SWIPE_DISTANCE,
        });
      }

      if (e.state === State.END) {
        handleEndState();
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

            onPan({
              translate: 0,
              maxSwipeDistance:
                SWIPABLE_DIMENSIONS.current.width / 2 +
                ELEMENT_DIMENSIONS.current.width / 2,
              minSwipeDistance: MIN_SWIPE_DISTANCE,
            });
            setState(State.UNDETERMINED);
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

        const MAX_SWIPE_DISTANCE =
          Math.sqrt(
            Math.pow(SWIPABLE_DIMENSIONS.current.width, 2) +
              Math.pow(SWIPABLE_DIMENSIONS.current.height, 2)
          ) / 2;

        const MAX_ELEMENT_DISTANCE =
          Math.sqrt(
            Math.pow(ELEMENT_DIMENSIONS.current.width, 2) +
              Math.pow(ELEMENT_DIMENSIONS.current.height, 2)
          ) / 2;

        const c2 = MAX_SWIPE_DISTANCE + MAX_ELEMENT_DISTANCE + offscreenOffset;

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

        angle.value = withSpring(a2 > 0 ? 30 : -30);

        // todo move offscreen with velocity
      }
    }, [state]);

    return (
      <YStack
        f={1}
        ai="center"
        jc="center"
        width="100%"
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
            enabled={enabled}
            onHandlerStateChange={gestureStateHandler}
            onGestureEvent={gestureHandler}
          >
            <Animated.View style={[animatedStyles]}>{children}</Animated.View>
          </PanGestureHandler>
        </View>
      </YStack>
    );
  }
);

export default Swipable;
