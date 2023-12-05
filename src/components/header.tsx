import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, H4, View } from 'tamagui';

import { color } from '@theme/tokens';

import Left from '@components/icons/chevron-left.svg?react';
import User from '@components/icons/user.svg?react';

export type FloaterProps = {
	children: string;
	canGoBack: boolean;
	defaultTo: string;
	profile?: boolean;
};
const Header = ({
	children,
	canGoBack = true,
	defaultTo,
	profile = false,
}: FloaterProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	return (
		<View
			pos="relative"
			borderRadius="$full"
			mx="$4"
			mt="$4"
			py="$2"
			px="$12"
		>
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
				<AccessibleIcon label="zurück">
					<Left style={{ color: color.baseStromeeNavy }} />
				</AccessibleIcon>
			</Button>
			<H4 textAlign="center" width="$full" numberOfLines={1}>
				{children}
			</H4>
			{profile && (
				<Button
					pos="absolute"
					top="$2"
					right="$0"
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
						navigate('/profile');
					}}
				>
					<AccessibleIcon label="Profil">
						<User style={{ color: color.baseStromeeNavy }} />
					</AccessibleIcon>
				</Button>
			)}
		</View>
	);
};

export { Header };
