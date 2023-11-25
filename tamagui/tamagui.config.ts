import { createTamagui } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';

import { animations } from './animations';
import { fonts } from './fonts';
import { media } from './media';
import { themes } from './themes';
import { tokens } from './tokens';

const config = createTamagui({
	animations,
	shouldAddPrefersColorThemes: true,
	themeClassNameOnRoot: true,
	shorthands,
	fonts,
	themes,
	tokens,
	media,
});

type AppConfig = typeof config;

declare module 'tamagui' {
	// overrides TamaguiCustomConfig so that custom types
	// work everywhere `tamagui` is imported
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
