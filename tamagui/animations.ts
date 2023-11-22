import { createAnimations } from "@tamagui/animations-css";

export const animations = createAnimations({
  lazy: "ease-in 500ms",
  quick: "ease-in 100ms",
  medium: "ease-in 250ms",
  bouncy: "cubic-bezier(0.175, 0.885, 0.32, 1.275) 500ms",
});
