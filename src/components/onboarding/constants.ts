import * as z from 'zod';

export const ONBOARDING_VIEWS = z.enum([
	'welcome',
	'address',
	'consumption',
	'energyType',
]);

export type ONBOARDING_VIEWS = z.infer<typeof ONBOARDING_VIEWS>;

export type OnboardingCarouselProps = {
	onNext: () => void;
	onPrev: () => void;
	index: number;
	count: number;
};
