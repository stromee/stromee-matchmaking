import { useLocation, useNavigate } from 'react-router-dom';
import { Button, H4, View } from 'tamagui';

import { color } from '@theme/tokens';

import Left from '@components/icons/chevron-left.svg?react';

type OnboardingHeaderProps ={
    children: string;
    onPrev: () => void;
} ;

const HeaderOnboarding = ({ children, onPrev: handlePrev}:OnboardingHeaderProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	return (
		<View
			pos="relative"
			borderRadius="$full"
			mx="$4"
			mt="$4"
			py="$2"
			px="$8"
		>
			<H4 textAlign="center" width="$full" numberOfLines={1}>
				{children}
			</H4>
			<Button
				unstyled
				pos="absolute"
				top="$0"
				left="$0"
				ai="center"
				jc="center"
				width="initial"
				height="$full"
				minHeight="$0"
				minWidth="$0"
				p="$1"
				color="$baseStromeeNavy"
				bg="$transparent"
				borderStyle="solid"
				borderWidth="1px"
				borderColor="$transparent"
				circular
				hoverStyle={{}}
				focusStyle={{}}
				onPress={() => {
                    handlePrev()
				}}
			>
				<Left style={{ color: color.baseStromeeNavy }} />
			</Button>
		</View>
	);
};

export { HeaderOnboarding };
