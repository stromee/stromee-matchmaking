import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const shouldExtract = process.env.EXTRACT === '1';

const tamaguiConfig = {
	components: ['tamagui'],
	config: 'tamagui/tamagui.config.ts',
	themeBuilder: {
		input: './tamagui/themes-builder.ts',
		output: './tamagui/generated-themes.ts',
	},
};

// eslint-disable-next-line import/no-default-export
export default defineConfig({
	clearScreen: true,
	plugins: [
		tsconfigPaths(),
		svgr(),
		react(),
		tamaguiPlugin(tamaguiConfig),
		shouldExtract ? tamaguiExtractPlugin(tamaguiConfig) : null,
	].filter(Boolean),
	define: {
		global: 'globalThis',
	},
	build: {
		sourcemap: true,
	},
});
