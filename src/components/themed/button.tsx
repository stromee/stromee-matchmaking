import { Button as TamaguiButton, styled } from 'tamagui';

const Button = styled(TamaguiButton, {
	theme: 'stromeeGreen',
	userSelect: 'none',
	size: '$true',
	minHeight: '$11',

	px: '$4',
	py: '$2',
	borderRadius: '$full',
});

export { Button };
