import { createFont } from '@tamagui/core';

export const fonts = {
	body: createFont({
		family: 'gilroy',
		size: {
			1: 100,
			2: 12,
			3: 14, // p
			4: 100,
			5: 100,
			6: 100,
			7: 100,
			8: 100,
			9: 100,
			10: 100,
			true: 14, // default
		},
		letterSpacing: {
			1: 0,
			true: 0,
		},
		weight: {
			1: '500',
			true: '500',
		},
		lineHeight: {
			1: 100,
			2: 22,
			3: 24,
			4: 100,
			5: 100,
			6: 100,
			7: 100,
			8: 100,
			9: 100,
			10: 100,
			true: 22,
		},
	}),

	button: createFont({
		family: 'gilroy',
		size: {
			1: 100,
			2: 100,
			3: 14, // default
			true: 14,
		},
		letterSpacing: {
			1: 0,
			true: 0,
		},
		weight: {
			1: '500',
			true: '500',
		},
		lineHeight: {
			// @ts-expect-error - this value works but throws a typescript error
			1: '100%',
			// @ts-expect-error - this value works but throws a typescript error
			true: '100%',
		},
	}),

	input: createFont({
		family: 'gilroy',
		size: {
			1: 100,
			2: 100,
			3: 16, // default
		},
		letterSpacing: {
			1: 0,
		},
		weight: {
			1: '500',
		},
		lineHeight: {
			// @ts-expect-error - this value works but throws a typescript error
			1: '100%',
		},
	}),

	heading: createFont({
		family: 'gilroy',
		size: {
			1: 100,
			2: 100,
			3: 100,
			4: 100,
			5: 100, // h6
			6: 14, // h5
			7: 18, // h4
			8: 24, // h3
			9: 28, // h2
			10: 34, // h1
			display: 44,
		},
		letterSpacing: {
			// @ts-expect-error - this value works but throws a typescript error
			5: '0.91%',
			// @ts-expect-error - this value works but throws a typescript error
			6: '0.71%',
			// @ts-expect-error - this value works but throws a typescript error
			7: '1.11%',
			// @ts-expect-error - this value works but throws a typescript error
			8: '0.83%',
			// @ts-expect-error - this value works but throws a typescript error
			9: '0.71%',
			// @ts-expect-error - this value works but throws a typescript error
			10: '0.59%',
			// @ts-expect-error - this value works but throws a typescript error
			display: '0.2%',
		},
		lineHeight: {
			1: 100,
			2: 100,
			3: 100,
			4: 100,
			5: 100,
			6: 22,
			7: 28,
			8: 32,
			9: 38,
			10: 44,
			display: 52,
		},
		weight: {
			1: '600',
		},
	}),
};
