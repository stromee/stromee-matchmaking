import { SwipableList } from "../components/swipeable-list";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createSelectors } from "../utils/store";

type State = {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
};

const baseStore = create<State>()(
  persist(
    immer((set) => ({
      bears: 0,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
    })),
    { name: "bears", version: 1 }
  )
);

const useStore = createSelectors(baseStore);

const Home = () => {
  const bears = useStore.use.bears();
  console.log("bears", bears);
  const increment = useStore.use.increasePopulation();

  return (
    <>
      <div>
        <span>{bears}</span>
        <button onClick={increment}>one up</button>
      </div>
      <SwipableList />
    </>
  );
};

export { Home };
