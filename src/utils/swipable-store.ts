import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSelectors } from "./store";

export interface State<TItem extends { id: string }> {
  items: TItem[]; // all items
  selection: TItem[]; // selected items
  remaining: TItem[]; // remaining items (selected - swiped)
  remainingDeferred: TItem[]; // remaining items (selected - swiped + selected items waiting for callback)
  swiped: TItem["id"][];
  swipedLeft: TItem["id"][];
  swipedRight: TItem["id"][];
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
    swipedLeft: [],
    swipedRight: [],
  };
  const baseStore = create<State<TItem>>()(
    persist(
      (set) => ({
        ...initialState,
        updateAllItems: (items) => {
          // we always need to update all items, because the distance might have changed
          set((state) => {
            // filter all items from the current selection and check if the item is included in the items array
            const newSelection = state.selection.filter((item) =>
              items.some((newItem) => newItem.id === item.id)
            );

            const newSwiped = state.swiped.filter((id) =>
              items.some((item) => item.id === id)
            );

            const newRemaining = newSelection.filter(
              (item) => !newSwiped.some((id) => id === item.id)
            );

            const newRemainingDeferred = [...newRemaining];

            const newSwipedLeft = state.swipedLeft.filter((id) =>
              newSwiped.some((swipedId) => swipedId === id)
            );

            const newSwipedRight = state.swipedRight.filter((id) =>
              newSwiped.some((swipedId) => swipedId === id)
            );

            return {
              ...state,
              items,
              selection: newSelection,
              remaining: newRemaining,
              remainingDeferred: newRemainingDeferred,
              swiped: newSwiped,
              swipedLeft: newSwipedLeft,
              swipedRight: newSwipedRight,
            };
          });
        },
        updateSelection: (selection) => {
          // we always need to update all items, because the distance might have changed
          set((state) => {
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

            let newSwipedLeft = state.swipedLeft;
            if (direction === "left" && !state.swipedLeft.includes(id)) {
              newSwipedLeft = [...state.swipedLeft, id];
            }

            let newSwipedRight = state.swipedRight;
            if (direction === "right" && !state.swipedRight.includes(id)) {
              newSwipedRight = [...state.swipedRight, id];
            }

            return {
              ...state,
              remaining: newRemaining,
              swiped: newSwiped,
              swipedLeft: newSwipedLeft,
              swipedRight: newSwipedRight,
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
            const newSwipedLeft = [];
            const newSwiped = [...state.swipedRight];

            const newRemaining = state.selection.filter(
              (item) => !newSwiped.some((id) => id === item.id)
            );

            const newRemainingDeferred = [...newRemaining];

            return {
              ...state,
              remaining: newRemaining,
              remainingDeferred: newRemainingDeferred,
              swiped: newSwiped,
              swipedLeft: newSwipedLeft,
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
