import { createTokens } from "tamagui";

const size = {
  0: 0,
  0.25: 2,
  0.5: 4,
  0.75: 8,
  1: 20,
  1.5: 24,
  2: 28,
  2.5: 32,
  3: 36,
  3.5: 40,
  4: 44,
  true: 44,
  4.5: 48,
  5: 52,
  5.5: 59,
  6: 64,
  6.5: 69,
  7: 74,
  7.6: 79,
  8: 84,
  8.5: 89,
  9: 94,
  9.5: 99,
  10: 104,
  11: 124,
  12: 144,
  13: 164,
  14: 184,
  15: 204,
  16: 224,
  17: 224,
  18: 244,
  19: 264,
  20: 284,
};

const spaces = Object.entries(size).map(
  ([k, v]) =>
    [
      k,
      Math.max(0, v <= 16 ? Math.round(v * 0.333) : Math.floor(v * 0.7 - 12)),
    ] as const
);

const spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k}`, -v]);

const space = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative),
} as any;

const zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
};

const radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 7,
  4: 9,
  true: 9,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
  10: 34,
  11: 42,
  12: 50,
  full: 9999,
};

export const color = {
  baseStromeeGreen: "#6ddc91",
  baseStromeeNavy: "#1d2445",
  basePopPetrol: "#1b4650",
  basePunchGreen: "#caf2a3",
  baseSummerYellow: "#fcf466",
  baseSkyBlue: "#7cb9d6",
  baseSkyBlueLight: "#b1d5e7",
  baseLollipopRed: "#b33349",
  baseGrey200: "#666a6a",
  baseGrey300: "#a3a6a6",
  baseGrey400: "#cfcfcf",
  baseGrey500: "#ebebeb",
  baseGrey600: "#f8f8f8",
  baseCloudWhite: "#ffffff",

  baseTanLight: "#f0e7da",
  baseTanDark: "#f5d6ba",
};

export const tokens = createTokens({
  color,
  space,
  size,
  radius,
  zIndex,
});
