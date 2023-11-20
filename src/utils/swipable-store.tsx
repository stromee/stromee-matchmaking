import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSelectors } from "./store";
import { Producer } from "./types";
import { isEqualWithId } from "./misc";

interface State<TItem extends { id: string }> {
  items: TItem[]; // all items
  selection: TItem[]; // selected items
  remaining: TItem[]; // remaining items (selected - swiped)
  remainingDeferred: TItem[]; // remaining items (selected - swiped + selected items waiting for callback)
  swiped: TItem["id"][];
  leftSwiped: TItem["id"][];
  rightSwiped: TItem["id"][];
  onSwipe: (swipe: { direction: "left" | "right"; id: TItem["id"] }) => void;
  onSwipeFinished: ({ id }: { id: TItem["id"] }) => void;
  updateSelection: (selection: TItem[]) => void;
  updateAllItems: (items: TItem[]) => void;
  resetSwiped: () => void;
  reset: () => void;
}

export const createSwipableStore = <TItem extends { id: string }>(
  items: TItem[],
  name: string
) => {
  const initialState = {
    items,
    selection: items,
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
        updateAllItems: (items) => {
          set((state) => {
            if (isEqualWithId(state.items, items)) {
              if (__DEV__) {
                console.info("items are equal");
              }
              return state;
            }
            // filter all items from the current selection and check if the item is included in the items array
            const newSelection = state.selection.filter((item) =>
              items.some((newItem) => newItem.id === item.id)
            );
            const newRemaining = state.remaining.filter((item) => {
              items.some((newItem) => newItem.id === item.id);
            });
            const newRemainingDeferred = [...newRemaining];

            const newSwiped = state.swiped.filter((id) => {
              items.some((newItem) => newItem.id === id);
            });
            const newLeftSwiped = state.leftSwiped.filter((id) => {
              newSwiped.some((swipedId) => swipedId === id);
            });
            const newRightSwiped = state.rightSwiped.filter((id) => {
              newSwiped.some((swipedId) => swipedId === id);
            });

            return {
              ...state,
              items,
              selection: newSelection,
              remaining: newRemaining,
              remainingDeferred: newRemainingDeferred,
              swiped: newSwiped,
              leftSwiped: newLeftSwiped,
              rightSwiped: newRightSwiped,
            };
          });
        },
        updateSelection: (selection) => {
          set((state) => {
            if (isEqualWithId(state.selection, selection)) {
              if (__DEV__) {
                console.info("selection is equal");
              }
              return state;
            }

            const newRemaining = selection.filter(
              (item) => !state.swiped.some((id) => id === item.id)
            );

            const newRemainingDeferred = [...newRemaining];
            return {
              ...state,
              selection,
              remaining: newRemaining,
              remainingDeferred: newRemainingDeferred,
            };
          });
          console.log("updateSelection", selection);
        },
        onSwipe: ({ direction, id }) => {
          set((state) => {
            const index = state.remaining.findIndex((item) => item.id === id);
            if (index === -1) {
              throw new Error("Item not found");
            }

            const newRemaining = state.remaining.filter(
              (item) => item.id !== id
            );

            let newSwiped = state.swiped;
            if (!state.swiped.includes(id)) {
              newSwiped = [...state.swiped, id];
            }

            let newLeftSwiped = state.leftSwiped;
            if (direction === "left" && !state.leftSwiped.includes(id)) {
              newLeftSwiped = [...state.leftSwiped, id];
            }

            let newRightSwiped = state.rightSwiped;
            if (direction === "right" && !state.rightSwiped.includes(id)) {
              newRightSwiped = [...state.rightSwiped, id];
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
        onSwipeFinished: ({ id }) => {
          set((state) => {
            const index = state.remainingDeferred.findIndex(
              (item) => item.id === id
            );
            if (index === -1) {
              throw new Error("Item not found");
            }

            const newRemainingDeferred = state.remainingDeferred.filter(
              (item) => item.id !== id
            );

            return {
              ...state,
              remainingDeferred: newRemainingDeferred,
            };
          });
        },
        resetSwiped: () => {
          set((state) => {
            const newLeftSwiped = [];
            const newSwiped = [...state.rightSwiped];

            const newRemaining = state.selection.filter(
              (item) => !newSwiped.some((id) => id === item.id)
            );

            const newRemainingDeferred = [...newRemaining];

            return {
              ...state,
              remaining: newRemaining,
              remainingDeferred: newRemainingDeferred,
              swiped: newSwiped,
              leftSwiped: newLeftSwiped,
            };
          });
        },
        reset: () => {
          set((state) => {
            return {
              ...state,
              ...initialState,
            };
          });
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

const EMPTY_PRODUCERS: { id: string; value: Producer; rotate: string }[] = [];
export const producerStore = createSwipableStore(EMPTY_PRODUCERS, "producers");
