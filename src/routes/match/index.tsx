import { useEffect } from "react";
import { useProducersQuery } from "@hooks/use-producers-query";
import { producerStore } from "@utils/swipable-store";
import { Paragraph, View } from "tamagui";
import { useParams } from "react-router-dom";
import { useDefinedParam } from "@hooks/use-defined-param";
import { useProducerQuery } from "@hooks/use-producer-query";

const Match = () => {
  const producerId = useDefinedParam("producerId");
  const params = useParams();

  const { data } = useProducerQuery({ producerId });

  const rightSwiped = producerStore.use.rightSwiped();

  const isInRightSwiped = rightSwiped.some((id) => id === producerId);

  useEffect(() => {
    console.log("swiped", params);
  }, [rightSwiped]);

  return (
    <View>
      <Paragraph>Match {producerId}</Paragraph>
      <Paragraph>{JSON.stringify(data, null, 2)}</Paragraph>
    </View>
  );
};

export { Match };
