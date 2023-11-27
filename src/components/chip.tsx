import { LinearGradient } from '@tamagui/linear-gradient';
import { View, XStack } from 'tamagui';

import { BodyText } from './themed/body-text';

export type ChipProps = {
	icon?: unknown;
	children: string;
};
const Chip = ({ children }: ChipProps) => {
	return (
		<View
			alignSelf="flex-start"
			overflow="hidden"
			pos="relative"
			borderRadius="$full"
			py="$1"
			px="$2"
		>
			<LinearGradient
				top={0}
				left={0}
				pos="absolute"
				width="$full"
				height="$full"
				colors={['$baseStromeeGreen', '$basePunchGreen']}
				start={[0, 0]}
				end={[0, 0]}
			/>
			<XStack gap="$2" maxWidth="$full">
				<BodyText fontSize="$2" numberOfLines={1}>
					{children}
				</BodyText>
			</XStack>
		</View>
	);
};

export { Chip };
