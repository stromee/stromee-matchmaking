import { SwipableList } from "@components/swipeable-list";
import { useProducersQuery } from "@hooks/use-producers-query";
import { configStore } from "@utils/config-store";
import { producerStore } from "@utils/swipable-store";

const Home = () => {
  const items = producerStore.use.items();
  const remaining = producerStore.use.remaining();
  const swiped = producerStore.use.swiped();
  const swipedLeft = producerStore.use.swipedLeft();
  const swipedRight = producerStore.use.swipedRight();

  const selection = producerStore.use.selection();
  const remainingDeferred = producerStore.use.remainingDeferred();

  const postalCode = configStore.use.postalCode();
  console.log("postalCode", postalCode);
  const { data } = useProducersQuery({
    postalCode,
  });

  const hasSelection = selection.length > 0;
  const hasRemaing = remainingDeferred.length > 0;
  const allSwipedRight = hasSelection && !hasRemaing && swipedLeft.length === 0;

  return (
    <>
      <SwipableList />
    </>
  );
};
export { Home as Component };
