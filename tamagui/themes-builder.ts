import { createThemeBuilder } from '@tamagui/theme-builder';

import { color } from './tokens';

const themesBuilder = createThemeBuilder()
	.addPalettes({
		base: [
			color.transparent, // 0 - transparent
			color.baseGrey600, // 1 - background
			color.baseStromeeNavy, // 2 - color
			color.baseStromeeNavy, // 3 - border
			color.baseStromeeNavyOpacity20, // 4 - shadow
			color.baseStromeeNavyOpacity80, // 5 - placeholder
		],
		secondary: [
			color.transparent, // 0 - transparent
			color.baseCloudWhite, // 1 - background
			color.baseStromeeNavy, // 2 - color
			color.baseStromeeNavy, // 3 - border
			color.baseStromeeNavyOpacity20, // 4 - shadow
			color.baseStromeeNavyOpacity80, // 5 - placeholder
		],
		popPetrol: [
			color.transparent, // 0 - transparent
			color.basePopPetrol, // 1 - background
			color.baseCloudWhite, // 2 - color
			color.baseCloudWhiteOpacity20, // 3 - border / shadow
			color.baseCloudWhiteOpacity80, // 4 - placeholder
		],
		stromeeGreen: [
			color.transparent, // 0 - transparent
			color.baseStromeeGreen, // 1 - background
			color.baseStromeeNavy, // 2 - color
			color.baseStromeeNavy, // 3 - border
			color.baseStromeeNavyOpacity20, // 4 - shadow
			color.baseStromeeNavyOpacity80, // 5 - placeholder
		],
		punchGreen: [
			color.transparent, // 0 - transparent
			color.basePunchGreen, // 1 - background
			color.baseStromeeNavy, // 2 - color
			color.baseStromeeNavyOpacity20, // 3 - border / shadow
			color.baseStromeeNavyOpacity80, // 4 - placeholder
		],
		lollipopRed: [
			color.transparent, // 0 - transparent
			color.baseLollipopRed, // 1 - background
			color.baseCloudWhite, // 2 - color
			color.baseStromeeNavy, // 3 - border
			color.baseCloudWhiteOpacity20, // 4 - shadow
			color.baseCloudWhiteOpacity80, // 5 - placeholder
		],
		tanLight: [
			color.transparent, // 0 - transparent
			color.baseTanDark, // 1 - background
			color.baseStromeeNavy, // 2 - color
			color.baseStromeeNavyOpacity20, // 3 - border / shadow
			color.baseStromeeNavyOpacity80, // 4 - placeholder
		],
	})
	.addTemplates({
		base: {
			background: 1,
			backgroundFocus: 1,
			backgroundHover: 1,
			backgroundPress: 1,
			backgroundStrong: 1,
			backgroundTransparent: 0,
			borderColor: 3,
			borderColorFocus: 3,
			borderColorHover: 3,
			borderColorPress: 3,
			color: 2,
			colorFocus: 2,
			colorHover: 2,
			colorPress: 2,
			colorTransparent: 0,
			placeholderColor: 5,
			shadowColor: 4,
			shadowColorFocus: 4,
			shadowColorHover: 4,
			shadowColorPress: 4,
		},
	})
	.addThemes({
		base: {
			template: 'base',
			palette: 'base',
		},
		secondary: {
			template: 'base',
			palette: 'secondary',
		},
		popPetrol: {
			template: 'base',
			palette: 'popPetrol',
		},
		stromeeGreen: {
			template: 'base',
			palette: 'stromeeGreen',
		},
		punchGreen: {
			template: 'base',
			palette: 'punchGreen',
		},
		lollipopRed: {
			template: 'base',
			palette: 'lollipopRed',
		},
		tanLight: {
			template: 'base',
			palette: 'tanLight',
		},
	});

export const themes = themesBuilder.build();
