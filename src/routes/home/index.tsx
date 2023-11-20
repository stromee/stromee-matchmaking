import { useEffect } from "react";
import { SwipableList } from "@components/swipeable-list";
import { useProducersQuery } from "@hooks/use-producers-query";
import { producerStore } from "@utils/swipable-store";

const Home = () => {
  const updateAllItems = producerStore.use.updateAllItems();
  const updateSelection = producerStore.use.updateSelection();

  const swiped = producerStore.use.swiped();
  const { data } = useProducersQuery({});
  console.log(data);
  useEffect(() => {
    if (data) {
      const items = data.map((producer) => ({
        id: producer.id.toString(),
        value: producer,
        rotate: `${(Math.random() - 0.5) * 6}deg`,
      }));
      updateAllItems(items);
      updateSelection(items);
    }
  }, [data]);

  useEffect(() => {
    console.log("swiped", swiped);
  }, [swiped]);

  return (
    <>
      <SwipableList />
    </>
  );
};

export { Home };
