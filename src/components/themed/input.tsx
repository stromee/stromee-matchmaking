import { Input as TamaguiInput, styled } from "tamagui";

const Input = styled(TamaguiInput, {
  theme: "secondary",
  fontFamily: "$input",
  py: "$2",
  px: "$4",
  minHeight: "$11",
  borderRadius: "$full",
  borderColor: "$baseCloudWhite",
  shadowColor: "$baseStromeeNavyOpacity20",
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 0,
  },
  hoverStyle: {
    borderColor: "$baseGrey400",
  },

  focusStyle: {
    borderColor: "$baseGrey400",
    outlineColor: "$baseGrey400",
  },
});

export { Input };
