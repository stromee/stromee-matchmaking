import { useLocation, useNavigate } from 'react-router-dom';
import { Button, H4, View } from 'tamagui';

export type FloaterProps = {
	children: string;
	canGoBack: boolean;
	defaultTo: string;
};
const Header = ({ children, canGoBack = true, defaultTo }: FloaterProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	return (
		<View pos="relative" borderRadius="$full" mx="$4" py="$2" px="$8">
			<H4 textAlign="center" width="$full" numberOfLines={1}>
				{children}
			</H4>
			<Button
				top={0}
				left={0}
				ai="center"
				jc="center"
				pos="absolute"
				height="$full"
				p="$1"
				unstyled
				onPress={() => {
					if (location.key !== 'default' && canGoBack) {
						navigate(-1);
					} else {
						navigate(defaultTo);
					}
				}}
			>
				←
			</Button>
		</View>
	);
};

export { Header };
