import { createAnimations } from '@tamagui/animations-css';

export const animations = createAnimations({
	lazy: 'ease-in 500ms',
	quick: 'ease-in 100ms',
	medium: 'ease-in 250ms',
	bouncy: 'cubic-bezier(0.175, 0.885, 0.32, 1.275) 500ms',

	easeInExpo: 'cubic-bezier(0.7, 0, 0.84, 0) 200ms',
	easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1) 200ms',
	easeInOutSine: 'cubic-bezier(0.37, 0, 0.63, 1) 200ms',
});
