import { Button, H4, View } from 'tamagui';

import { color } from '@theme/tokens';

import Left from '@components/icons/chevron-left.svg?react';

type OnboardingHeaderProps = {
	children: string;
	onPrev: () => void;
};

const HeaderOnboarding = ({
	children,
	onPrev: handlePrev,
}: OnboardingHeaderProps) => {
	return (
		<View pos="relative" borderRadius="$full" mt="$4" py="$2" pl="$12">
			<H4 textAlign="left" width="$full" numberOfLines={1}>
				{children}
			</H4>
			<Button
				pos="absolute"
				top="$2"
				left="$0"
				ai="center"
				jc="center"
				minHeight="initial"
				height="initial"
				p="$1"
				borderRadius="$full"
				color="$baseStromeeNavy"
				bg="$transparent"
				borderStyle="solid"
				borderWidth="1px"
				borderColor="$transparent"
				hoverStyle={{
					bg: '$transparent',
				}}
				focusStyle={{
					bg: '$transparent',
				}}
				onPress={() => {
					handlePrev();
				}}
			>
				<Left style={{ color: color.baseStromeeNavy }} />
			</Button>
		</View>
	);
};

export { HeaderOnboarding };
