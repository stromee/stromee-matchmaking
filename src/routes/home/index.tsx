import { SwipableList } from "@components/swipeable-list";
import { configStore } from "@utils/config-store";

const Home = () => {
  const postalCode = configStore.use.postalCode();
  console.log("postalCode", postalCode);

  return (
    <>
      <SwipableList />
    </>
  );
};
export { Home as Component };
