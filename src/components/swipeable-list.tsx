import {
  XStack,
  View,
  Card,
  Paragraph,
  Button,
  Image,
  clamp,
  SizableText,
  H3,
  H4,
} from "tamagui";

import { Swipable, Pan, SwipableRef } from "./swipeable";
import { useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { color } from "../../tamagui/tokens";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes";
import { createSwipableStore } from "../utils/swipable-store";
import { generateName } from "../utils/name";
import { CustomZStack, CustomZStackChild } from "./z-stack";

const computedStyle = (value: number): DefaultStyle => {
  if (value == 1) {
    return {
      shadowOpacity: withTiming(0),
      shadowRadius: withTiming(4),
      transform: [
        {
          scale: 1,
        },
      ],
    };
  }
  if (value >= 1) {
    const scale = interpolate(value, [1, 2], [1, 1.2]);
    return {
      // backgroundColor: color,
      shadowOpacity: withTiming(1),
      shadowRadius: withTiming(12),

      transform: [
        {
          scale,
        },
      ],
    };
  }

  const scale = interpolate(value, [0, 1], [0.8, 1]);
  return {
    shadowOpacity: withTiming(0),
    shadowRadius: withTiming(4),
    transform: [
      {
        scale,
      },
    ],
  };
};

const createSwipables = (length: number) => {
  const swipables: { id: string; rotate: string; name: string }[] = [];
  for (let i = 0; i < length; i++) {
    swipables.push({
      id: `${i.toString().padStart(3, "0")}`,
      rotate: `${(Math.random() - 0.5) * 6}deg`,
      name: generateName(),
    });
  }

  swipables.reverse();

  return swipables;
};

const indexAfterActive = ({
  swipables,
  activeId,
  id,
}: {
  swipables: { id: string }[];
  activeId: string;
  id;
}) => {
  const activeIndex = swipables.findIndex(({ id }) => id === activeId);
  const index = swipables.findIndex(({ id: swipableId }) => swipableId === id);

  return activeIndex - index;
};

const getIndexInFull = (id: string, full: { id: string }[]) => {
  const index = full.findIndex(({ id: fullId }) => fullId === id);

  return index;
};
const once = createSwipables(40).map((item) => ({
  key: item.id,
  value: item,
}));

const SwipableList = ({ count = 5 }) => {
  const store = useRef(createSwipableStore(once, "swipables")).current;

  const swipableRef = useRef<SwipableRef | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const leftButtonTransform = useSharedValue(1);
  const rightButtonTransform = useSharedValue(1);

  const leftButtonStyle = useAnimatedStyle(
    () => computedStyle(leftButtonTransform.value),
    [leftButtonTransform]
  );

  const rightButtonStyle = useAnimatedStyle(
    () => computedStyle(rightButtonTransform.value),
    [rightButtonTransform]
  );

  const full = store.use.items().map((item) => item.value);
  const remaining = store.use.remaining().map((item) => item.value);
  const remainingDeferred = store.use
    .remainingDeferred()
    .slice(-count, undefined)
    .map((item) => item.value);

  const activeSwipable = remaining[remaining.length - 1]?.id || "";
  // we need to copy the swipable id to a ref, so we can use the value in swipabled callbacks
  // with the current value
  const activeSwipableRef = useRef(activeSwipable);
  useEffect(() => {
    activeSwipableRef.current = activeSwipable;
  }, [activeSwipable]);

  const onSwipe = store.use.onSwipe();
  const onSwipeFinished = store.use.onSwipeFinished();
  const reset = store.use.reset();

  // useEffect(() => {
  //   if (swipables.length === 0) {
  //     const newSwipables = createSwipables(10);
  //     setSwipables(newSwipables);
  //     setActiveSwipable(newSwipables[newSwipables.length - 1].id);
  //   }
  // }, [swipables]);

  const handlePan = useCallback((pan: Pan) => {
    if (pan.swipableId !== activeSwipableRef.current) {
      console.warn(
        `pan.swipableId not active for "${pan.swipableId}"; expected: "${activeSwipableRef.current}")`
      );
      return;
    }

    if (pan.translate === 0) {
      leftButtonTransform.value = withTiming(1);
      rightButtonTransform.value = withTiming(1);
      setIsSwiping(false);
      return;
    }

    const direction = pan.translate > 0 ? "right" : "left";
    setIsSwiping(true);
    const distance = Math.abs(pan.translate);

    // if the swipe isn't far enough, the scale is 0 - 1
    if (distance < pan.minSwipeDistance) {
      if (direction === "right") {
        const scale = interpolate(
          pan.translate,
          [0, pan.minSwipeDistance],
          [0, 1]
        );
        leftButtonTransform.value = 1;
        rightButtonTransform.value = scale;
      }
      // left swipe
      if (direction === "left") {
        const scale = interpolate(
          pan.translate,
          [0, -pan.minSwipeDistance],
          [0, 1]
        );
        leftButtonTransform.value = scale;
        rightButtonTransform.value = 1;
      }

      return;
    }

    // if we have an actual swipe, the scale is 1 - 2
    const clamped = clamp(distance, [
      pan.minSwipeDistance,
      pan.maxSwipeDistance,
    ]);

    const interpolated = interpolate(
      clamped,
      [pan.minSwipeDistance, pan.maxSwipeDistance],
      [1, 2]
    );

    if (direction === "left") {
      leftButtonTransform.value = interpolated;
      rightButtonTransform.value = withTiming(1);
    }
    if (direction === "right") {
      leftButtonTransform.value = withTiming(1);
      rightButtonTransform.value = interpolated;
    }
  }, []);

  return (
    <>
      <View>
        <H4>Swipe me! {isSwiping ? "true" : "false"}</H4>
      </View>
      <CustomZStack>
        {remainingDeferred.map(({ id, rotate }, index) => (
          <CustomZStackChild key={id}>
            <Swipable
              id={id}
              key={id}
              enabled={id === activeSwipable}
              ref={id === activeSwipable ? swipableRef : null}
              onSwipe={(swipe) => {
                onSwipe({
                  key: id,
                  direction: swipe.direction,
                });
                if (remaining.length === 1) {
                  setIsSwiping(true);
                } else {
                  // reset buttons
                  handlePan({
                    swipableId: id,
                    maxSwipeDistance: 0,
                    minSwipeDistance: 0,
                    translate: 0,
                  });
                  setIsSwiping(false);
                }
              }}
              onSwipeFinished={(swipeFinished) => {
                swipeFinished.callback();

                if (!activeSwipableRef.current) {
                  setIsSwiping(false);
                }

                onSwipeFinished({
                  key: id,
                });
              }}
              onPan={handlePan}
              bottomOffset={138}
              topOffset={60}
            >
              <Card
                shadowOpacity={0.2}
                size="$4"
                bordered
                backgroundColor="$baseCloudWhite"
                animation="bouncy"
                animateOnly={["transform"]}
                transform={[
                  {
                    translateY: interpolate(
                      clamp(
                        indexAfterActive({
                          swipables: remaining,
                          activeId: activeSwipable,
                          id,
                        }),
                        [0, 3]
                      ),
                      [0, 3],
                      [0, 48]
                    ),
                  },
                  {
                    scale: interpolate(
                      clamp(
                        indexAfterActive({
                          swipables: remaining,
                          activeId: activeSwipable,
                          id,
                        }),
                        [0, 3]
                      ),
                      [0, 3],
                      [1, 0.8]
                    ),
                  },
                  {
                    rotate: id !== activeSwipable ? rotate : "0deg",
                  },
                ]}
              >
                <Card.Header padded gap="$2">
                  <H3>Produzent {getIndexInFull(id, full)}</H3>
                  <Paragraph>element id: {id}</Paragraph>
                  <Paragraph>active id: {activeSwipable}</Paragraph>
                  <Paragraph fontSize="$4" mt="$4">
                    Debug infos:
                  </Paragraph>
                  <Paragraph fontSize="$2">
                    Remaining {remaining.length}
                  </Paragraph>
                  <Paragraph fontSize="$2">
                    RemainingDeferred {remainingDeferred.length}
                  </Paragraph>
                  <Paragraph fontSize="$2">Index in Render {index}</Paragraph>
                </Card.Header>
                <Card.Footer padded>
                  <XStack flex={1} />
                  <Button theme="stromeeGreen" borderRadius="$10">
                    Purchase
                  </Button>
                </Card.Footer>
                <Card.Background>
                  <Image
                    resizeMode="contain"
                    alignSelf="center"
                    source={{
                      width: 300,
                      height: 300,
                      uri: "data:image/png;base64,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",
                    }}
                  />
                </Card.Background>
              </Card>
            </Swipable>
          </CustomZStackChild>
        ))}
      </CustomZStack>

      <View flex={0} padding="$4" justifyContent="space-around">
        <Button
          theme="lollipopRed"
          p="$0"
          borderRadius="$full"
          backgroundColor="$transparent"
          animation="bouncy"
          animateOnly={["transform", "shadowOpacity", "shadowRadius"]}
          shadowColor={color.baseLollipopRed}
          shadowOpacity={0}
          shadowRadius={4}
          borderWidth="$0"
          hoverStyle={{
            backgroundColor: "$transparent",
          }}
          pressStyle={{
            transform: [{ scale: 1.1 }],
            shadowColor: color.baseLollipopRed,
            shadowOpacity: 1,
            shadowRadius: 12,
          }}
          focusStyle={{
            backgroundColor: "$transparent",
            outlineWidth: 0,
          }}
          onPress={() => {
            if (
              swipableRef.current &&
              swipableRef.current.id === activeSwipable
            ) {
              swipableRef.current.swipe("left");
            }
          }}
          disabled={isSwiping || remainingDeferred.length === 0}
        >
          <Animated.View
            style={[
              {
                borderRadius: 99999,
                height: 44,
                paddingHorizontal: 16,
                paddingVertical: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: color.baseLollipopRed,
                borderWidth: 2,
                borderColor: color.baseCloudWhite,
                shadowColor: color.baseLollipopRed,
              },
              isSwiping || remainingDeferred.length === 0
                ? {}
                : leftButtonStyle,
            ]}
          >
            <SizableText>Nope</SizableText>
          </Animated.View>
        </Button>

        <Button
          theme="stromeeGreen"
          p="$0"
          borderRadius="$full"
          backgroundColor="$transparent"
          animation="bouncy"
          animateOnly={["transform", "shadowOpacity", "shadowRadius"]}
          shadowColor={color.baseStromeeGreen}
          shadowOpacity={0}
          shadowRadius={4}
          borderWidth="$0"
          hoverStyle={{
            backgroundColor: "$transparent",
          }}
          pressStyle={{
            transform: [{ scale: 1.1 }],
            shadowColor: color.baseStromeeGreen,
            shadowOpacity: 1,
            shadowRadius: 12,
          }}
          focusStyle={{
            backgroundColor: "$transparent",
            outlineWidth: 0,
          }}
          onPress={() => {
            if (
              swipableRef.current &&
              swipableRef.current.id === activeSwipable
            ) {
              swipableRef.current?.swipe("right");
            }
          }}
          disabled={isSwiping || remainingDeferred.length === 0}
        >
          <Animated.View
            style={[
              {
                borderRadius: 99999,
                height: 44,
                paddingHorizontal: 16,
                paddingVertical: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: color.baseStromeeGreen,
                borderWidth: 2,
                borderColor: color.baseCloudWhite,
                shadowColor: color.baseStromeeGreen,
              },
              rightButtonStyle,
            ]}
          >
            <SizableText>Yes!</SizableText>
          </Animated.View>
        </Button>
      </View>
      <View jc="center" p="$2">
        <Button theme="popPetrol" onPress={reset} borderRadius="$full">
          Restart
        </Button>
      </View>
    </>
  );
};

export { SwipableList };
