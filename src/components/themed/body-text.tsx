import { GetProps, Text as TamaguiText, styled } from "tamagui";

const BodyText = styled(TamaguiText, {
  name: "BodyText",
  fontFamily: "$body",
  fontSize: "$true",
  fontWeight: "$true",
  lineHeight: "$true",
  letterSpacing: "$true",
});

// helper to get props for any TamaguiComponent
export type BodyTextProps = GetProps<typeof BodyText>;

export { BodyText };
