import { Button as TamaguiButton, styled } from "tamagui";

const Button = styled(TamaguiButton, {
  theme: "stromeeGreen",
  fontFamily: "$button",
  userSelect: "none",
  px: "8px",
  py: "4px",
  size: "$11",
  borderRadius: "$full",
});

export { Button };
