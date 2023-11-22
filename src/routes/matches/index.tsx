import { useEffect } from "react";
import { useProducersQuery } from "@hooks/use-producers-query";
import { producerStore } from "@utils/swipable-store";
import {
  Button,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Input,
  Paragraph,
  Text,
  Theme,
  View,
  YStack,
} from "tamagui";
import { supabase } from "src/supabase";

const getData = async () => {
  let { data: location, error } = await supabase.from("location").select("*");

  console.log(location);
  console.log(error);
  return location;
};

const Matches = () => {
  const swipedRight = producerStore.use.swipedRight();
  const { data } = useProducersQuery({});
  useEffect(() => {
    getData();
  }, []);
  return (
    <YStack gap="$2" px="$2" py="$4">
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <H6>Heading 6</H6>
      <Input fontFamily="$input" placeholder="Input" />
      <Paragraph>Paragraph</Paragraph>
      <Paragraph fontWeight="bold">Paragraph</Paragraph>
      <Paragraph fontWeight="400">Font 400</Paragraph>
      <Paragraph fontWeight="500">Font 500</Paragraph>
      <Paragraph fontWeight="600">Font 600</Paragraph>
      <Paragraph fontWeight="700">Font 700</Paragraph>
      <Button borderRadius="$full" fontFamily="$button" theme="stromeeGreen">
        Paragraph
      </Button>

      <Paragraph>Matches</Paragraph>
      <Paragraph>{JSON.stringify(swipedRight, null, 2)}</Paragraph>
    </YStack>
  );
};

export { Matches as Component };
