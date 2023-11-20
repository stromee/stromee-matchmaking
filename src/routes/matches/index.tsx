import { useEffect } from "react";
import { useProducersQuery } from "@hooks/use-producers-query";
import { producerStore } from "@utils/swipable-store";
import { Paragraph, View } from "tamagui";

const Matches = () => {
  const swipedRight = producerStore.use.swipedRight();
  const { data } = useProducersQuery({});

  useEffect(() => {
    console.log("swiped", swipedRight);
  }, [swipedRight]);

  return (
    <View>
      <Paragraph>Matches</Paragraph>
      <Paragraph>{JSON.stringify(swipedRight, null, 2)}</Paragraph>
    </View>
  );
};

export { Matches };
