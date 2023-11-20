import { useEffect } from "react";
import { useProducersQuery } from "@hooks/use-producers-query";
import { producerStore } from "@utils/swipable-store";
import { Paragraph, View } from "tamagui";

const Matches = () => {
  const swiped = producerStore.use.rightSwiped();
  const { data } = useProducersQuery({});

  useEffect(() => {
    console.log("swiped", swiped);
  }, [swiped]);

  return (
    <View>
      <Paragraph>Matches</Paragraph>
      <Paragraph>{JSON.stringify(swiped, null, 2)}</Paragraph>
    </View>
  );
};

export { Matches };
