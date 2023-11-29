import { useLocation, useNavigate } from 'react-router-dom';
import { Button, H4, View } from 'tamagui';

import { color } from '@theme/tokens';

import Left from '@components/icons/chevron-left.svg?react';

export type FloaterProps = {
	children: string;
	canGoBack: boolean;
	defaultTo: string;
};
const Header = ({ children, canGoBack = true, defaultTo }: FloaterProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	return (
		<View
			pos="relative"
			borderRadius="$full"
			mx="$4"
			mt="$4"
			py="$2"
			pl="$12"
		>
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
					if (location.key !== 'default' && canGoBack) {
						navigate(-1);
					} else {
						navigate(defaultTo);
					}
				}}
			>
				<Left style={{ color: color.baseStromeeNavy }} />
			</Button>
		</View>
	);
};

export { Header };
