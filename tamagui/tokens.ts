import { createTokens } from 'tamagui';

const size = {
	0: 0,
	px: '1px',
	0.5: 2,
	1: 4,
	1.5: 6,
	2: 8,
	2.5: 10,
	3: 12,
	3.5: 14,
	4: 16,
	5: 20,
	6: 24,
	7: 28,
	8: 32,
	true: 32,
	9: 36,
	10: 40,
	11: 44,
	12: 48,
	14: 56,
	16: 64,
	20: 80,
	24: 96,
	28: 112,
	32: 128,
	36: 144,
	40: 160,
	44: 176,
	48: 192,
	52: 208,
	56: 224,
	60: 240,
	64: 256,
	72: 288,
	80: 320,
	96: 384,
	full: '100%',
};

const spaces = Object.entries(size)
	.filter(
		(entries): entries is [string, number] =>
			typeof entries[1] === 'number',
	)
	.map(([k, v]) => [k, v] as const);

const spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k}`, -v]);

const space = {
	...Object.fromEntries(spaces),
	...Object.fromEntries(spacesNegative),
};

const zIndex = {
	0: 0,
	1: 100,
	2: 200,
	3: 300,
	4: 400,
	5: 500,
};

export const radius = {
	0: 0,
	2: 2,
	3: 4,
	4: 8,
	true: 8,
	5: 16,
	6: 24,
	full: 9999,
};

export const color = {
	baseStromeeGreen: '#6ddc91',
	baseStromeeNavy: '#1d2445',
	baseStromeeNavyOpacity20: '#1d244533',
	baseStromeeNavyOpacity40: '#1d244566',
	baseStromeeNavyOpacity60: '#1d244599',
	baseStromeeNavyOpacity80: '#1d2445CC',
	basePopPetrol: '#1b4650',
	basePunchGreen: '#caf2a3',
	baseSummerYellow: '#fcf466',
	baseSkyBlue: '#7cb9d6',
	baseSkyBlueLight: '#b1d5e7',
	baseLollipopRed: '#b33349',
	baseGrey200: '#666a6a',
	baseGrey300: '#a3a6a6',
	baseGrey400: '#cfcfcf',
	baseGrey500: '#ebebeb',
	baseGrey600: '#f8f8f8',
	baseCloudWhite: '#ffffff',
	baseCloudWhiteOpacity20: '#ffffff33',
	baseCloudWhiteOpacity40: '#ffffff66',
	baseCloudWhiteOpacity60: '#ffffff99',
	baseCloudWhiteOpacity80: '#ffffffCC',

	baseTanLight: '#f0e7da',
	baseTanDark: '#f5d6ba',

	transparent: 'transparent',
};

export const tokens = createTokens({
	color,
	space,
	size,
	radius,
	zIndex,
});
