import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createSelectors } from "./store";

interface State<TItem extends { key: string }> {
  items: TItem[]; // all items
  remaining: TItem[]; // remaining items (items - swiped)
  remainingDeferred: TItem[]; // remaining items (items - swiped + items waiting for callback)
  swiped: TItem["key"][];
  leftSwiped: TItem["key"][];
  rightSwiped: TItem["key"][];
  onSwipe: (swipe: { direction: "left" | "right"; key: TItem["key"] }) => void;
  onSwipeFinished: ({ key }: { key: TItem["key"] }) => void;
  updateItems: (items: TItem[]) => void;
  reset: () => void;
}

export const createSwipableStore = <TItem extends { key: string }>(
  items: TItem[],
  name: string
) => {
  const initialState = {
    items,
    remaining: items,
    remainingDeferred: items,
    swiped: [],
    leftSwiped: [],
    rightSwiped: [],
  };
  const baseStore = create<State<TItem>>()(
    persist(
      (set) => ({
        ...initialState,
        updateItems: (items) => {
          console.log("setItems", items);
        },
        onSwipe: ({ direction, key }) => {
          set((state) => {
            const index = state.remaining.findIndex((item) => item.key === key);
            if (index === -1) {
              throw new Error("Item not found");
            }

            const newRemaining = state.remaining.filter(
              (item) => item.key !== key
            );

            let newSwiped = state.swiped;
            if (!state.swiped.includes(key)) {
              newSwiped = [...state.swiped, key];
            }

            let newLeftSwiped = state.leftSwiped;
            if (direction === "left" && !state.leftSwiped.includes(key)) {
              newLeftSwiped = [...state.leftSwiped, key];
            }

            let newRightSwiped = state.rightSwiped;
            if (direction === "right" && !state.rightSwiped.includes(key)) {
              newRightSwiped = [...state.rightSwiped, key];
            }

            return {
              ...state,
              remaining: newRemaining,
              swiped: newSwiped,
              leftSwiped: newLeftSwiped,
              rightSwiped: newRightSwiped,
            };
          });
        },
        onSwipeFinished: ({ key }) => {
          set((state) => {
            const index = state.remainingDeferred.findIndex(
              (item) => item.key === key
            );
            if (index === -1) {
              throw new Error("Item not found");
            }

            const newRemainingDeferred = state.remainingDeferred.filter(
              (item) => item.key !== key
            );

            return {
              ...state,
              remainingDeferred: newRemainingDeferred,
            };
          });
        },
        reset: () => {
          set((state) => ({
            ...state,
            ...initialState,
          }));
          console.log("reset");
        },
      }),
      {
        name,
        version: 1,
        // take care of race conditions
        partialize: (state) => ({
          ...state,
          remainingDeferred: state.remaining,
        }),
      }
    )
  );

  return createSelectors(baseStore);
};
